#!/usr/bin/env node
/**
 * Build output audit — the last gate before a release.
 *
 * Checks:
 * 1. dist/ exists and index.html is readable
 * 2. no build-machine absolute paths (e.g. `/Users/…` hard-coded in a source file)
 * 3. no browser-extension URLs — prerendering drives a real browser, so anything an
 *    extension injects into the page would otherwise be packaged and served
 * 4. no loopback hosts (prerender runs on a local server, so any address read from
 *    `location` gets baked into the HTML — that is how a `localhost:8001` link once
 *    reached production)
 * 5. no sourcemaps (files or sourceMappingURL references)
 * 6. index.html carries the build version (`<meta name="x-release-version">`), matching
 *    `APP_VERSION` (the release tag) or `package.json`, plus a
 *    `<meta name="x-release-time">` in `YYYY/MM/DD HH:mm:ss`
 * 7. with `--expect-base`: every static reference in index.html points at that CDN base
 *    (the contract with tds-dc, which uploads the files to that prefix)
 * 8. with `--require-prerender`: index.html must be a prerendered page
 *
 * Internal hostnames and tool names are deliberately not scanned: this repository is
 * public, so such strings are already visible in the source that produces the build.
 *
 * Usage:
 *   node scripts/audit-dist.mjs
 *   node scripts/audit-dist.mjs --require-prerender
 *   node scripts/audit-dist.mjs --expect-base '//assets.tapimg.com/developer-center-homepage/current/'
 */
import { readdir, readFile, stat } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';

const pkg = JSON.parse(await readFile(new URL('../package.json', import.meta.url), 'utf8'));
const expectedVersion = process.env.APP_VERSION || pkg.version;

const DIST = path.resolve('dist');
const requirePrerender = process.argv.includes('--require-prerender');
const expectBaseArg = process.argv.find((arg) => arg.startsWith('--expect-base='));
const expectBase = expectBaseArg ? expectBaseArg.slice('--expect-base='.length) : '';

/** Build-machine paths: they never belong in a published artifact */
const MACHINE_PATHS = ['/Users/'];

/** Browser-extension schemes: proof that a local browser contributed to the artifact */
const EXTENSION_SCHEMES = [
  'chrome-extension://',
  'moz-extension://',
  'safari-extension://',
  'safari-web-extension://',
  'ms-browser-extension://',
];

/**
 * Loopback addresses: a sign that a build-machine URL was frozen into the output.
 *
 * Only match them where they would actually be navigable — as a URL host or as `host:port`.
 * A bare occurrence can be legitimate (e.g. code that compares against the hostname to
 * decide whether it runs locally).
 */
const LOOPBACK = [
  /(?:https?:)?\/\/(?:localhost|127\.0\.0\.1|0\.0\.0\.0|\[::1\])/i,
  /\b(?:localhost|127\.0\.0\.1|0\.0\.0\.0|\[::1\]):\d+/i,
];

const failures = [];
const fail = (msg) => failures.push(msg);

async function walk(dir) {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await walk(full)));
    else out.push(full);
  }
  return out;
}

if (!existsSync(path.join(DIST, 'index.html'))) {
  console.error('[audit] dist/index.html is missing — run `pnpm build` first');
  process.exit(1);
}

const files = await walk(DIST);
const textFiles = files.filter((file) => /\.(?:html|js|css|json|xml|txt|svg)$/.test(file));

// 2) machine paths, 3) extension URLs, 4) loopback (text files, case-insensitive)
for (const file of textFiles) {
  const relative = path.relative(DIST, file);
  const content = (await readFile(file, 'utf8')).toLowerCase();

  for (const needle of MACHINE_PATHS) {
    if (content.includes(needle.toLowerCase())) fail(`build-machine path "${needle}" found in ${relative}`);
  }
  for (const scheme of EXTENSION_SCHEMES) {
    if (content.includes(scheme)) fail(`browser-extension URL "${scheme}" packaged in ${relative}`);
  }
  for (const pattern of LOOPBACK) {
    const match = pattern.exec(content);
    if (match) {
      fail(`loopback address "${match[0]}" baked into ${relative} — do not read location host/port at build time`);
    }
  }
}

// 5) sourcemaps
for (const file of files) {
  if (file.endsWith('.map')) fail(`sourcemap shipped: ${path.relative(DIST, file)}`);
  if (file.endsWith('.js')) {
    const content = await readFile(file, 'utf8');
    if (content.includes('sourceMappingURL=')) fail(`JS references a sourcemap: ${path.relative(DIST, file)}`);
  }
}

// 6) version stamp (the release tag is the only source of truth, see vite.config.ts)
const html = await readFile(path.join(DIST, 'index.html'), 'utf8');
const releaseVersion = html.match(/<meta name="x-release-version" content="([^"]*)"\s*\/?>/);
if (!releaseVersion) {
  fail('index.html has no `<meta name="x-release-version">` — the version stamp did not run');
} else if (releaseVersion[1] !== expectedVersion) {
  fail(`\`x-release-version\` reports "${releaseVersion[1]}" but "${expectedVersion}" was built`);
}

const releaseTime = html.match(/<meta name="x-release-time" content="([^"]*)"\s*\/?>/);
if (!releaseTime) {
  fail('index.html has no `<meta name="x-release-time">`');
} else if (!/^\d{4}\/\d{2}\/\d{2} \d{2}:\d{2}:\d{2}$/.test(releaseTime[1])) {
  fail(`\`x-release-time\` is not YYYY/MM/DD HH:mm:ss: "${releaseTime[1]}"`);
}

// 7) CDN base contract: the release is served from one fixed prefix, and tds-dc uploads
//    exactly these files there — a mismatch only surfaces after deployment otherwise.
if (expectBase) {
  const base = expectBase.endsWith('/') ? expectBase : `${expectBase}/`;
  const references = [...html.matchAll(/(?:src|href|content)="([^"]+)"/g)]
    .map((match) => match[1])
    .filter((url) => /\.(?:js|css|ico|png|jpe?g|webp|svg|woff2?)(?:[?#].*)?$/.test(url));
  if (references.length === 0) {
    fail('index.html has no static references — the build looks empty');
  }
  for (const url of references) {
    if (!url.startsWith(base) && !url.startsWith(`https:${base}`)) {
      fail(`static reference "${url}" is not under ${base} — was PUBLIC_BASE passed to the build?`);
    }
  }
}

// 8) prerender assertions
if (requirePrerender) {
  if (!html.includes('为全球开发者')) fail('index.html is missing the hero copy — prerender did not run');
  if (!html.includes('id="app"'))
    fail('index.html is missing the #app mount point — the page would lose all interactivity');
  if (html.includes('class="landing-loading"')) fail('index.html still contains the first-paint skeleton');
}

// summary
let bytes = 0;
for (const file of files) bytes += (await stat(file)).size;

if (failures.length > 0) {
  console.error('[audit] failed:');
  for (const item of failures) console.error(`  - ${item}`);
  process.exit(1);
}

console.log(
  `[audit] passed | files ${files.length} | ${(bytes / 1024 / 1024).toFixed(2)} MB | prerender check ${requirePrerender ? 'enabled' : 'skipped'}`,
);
