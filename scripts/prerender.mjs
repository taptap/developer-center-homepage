#!/usr/bin/env node
/**
 * Prerender: render the SPA once and write the result back into dist/index.html.
 *
 * - Renders `/` only
 * - Sets `window.__PRERENDER_INJECTED = true` before scripts run, so the page skips the
 *   user request and analytics during rendering
 * - Injects **only** the rendered `#app` subtree into the template Vite produced, instead
 *   of serialising the whole live document: anything the rendering browser injects
 *   (extensions, translators, enterprise policies) would otherwise ship in the artifact
 * - Keeps the `<script type="module">` tag, so the app still boots in the browser
 *   (same approach as any prerendered SPA)
 * - Supports an absolute `PUBLIC_BASE`: the built bundle references the CDN by absolute
 *   URL, so those requests are served from `dist/` during rendering instead of hitting
 *   the network (the CDN does not hold this build yet)
 * - Degrades to "build only" when puppeteer is unavailable, with a warning
 */
import { createServer } from 'node:http';
import { readFile, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const DIST = path.resolve('dist');
const PORT = 4319;
const LOCAL_ORIGIN = `http://127.0.0.1:${PORT}`;

/**
 * Public base handling: in production the HTML and the JS chunks point at a CDN that
 * does not hold this build yet while prerendering runs.
 */
const rawBase = process.env.PUBLIC_BASE || '/';
const absoluteBase = rawBase.startsWith('//') ? `https:${rawBase}` : rawBase;
const trimSlash = (value) => (value.endsWith('/') ? value.slice(0, -1) : value);
const baseNoSlash = trimSlash(absoluteBase);
const isAbsoluteBase = /^https?:\/\//.test(baseNoSlash);

/**
 * A protocol-relative base (`//cdn…`) is emitted into the HTML as-is, so the local
 * `http://` page requests it over **http**. Match on host + path instead of the full
 * origin, otherwise the bundle is never served from `dist/` and the page stays blank.
 */
const stripProtocol = (value) => value.replace(/^https?:\/\//, '');
const baseKey = trimSlash(stripProtocol(baseNoSlash));
const requestPathFor = (url) => {
  const key = stripProtocol(url.split('?')[0]);
  if (!key.startsWith(`${baseKey}/`)) return null;
  return decodeURIComponent(key.slice(baseKey.length + 1));
};

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
};

if (!existsSync(path.join(DIST, 'index.html'))) {
  console.error('[prerender] dist/index.html is missing — run `vite build` first');
  process.exit(1);
}

let puppeteer;
try {
  ({ default: puppeteer } = await import('puppeteer'));
} catch {
  console.warn('[prerender] puppeteer is not installed — skipping prerender (the SPA build is still deployable)');
  process.exit(0);
}

/**
 * A sub-path base (`/<repo>/`) keeps assets on the local origin, so the static server has
 * to strip that prefix before touching the filesystem.
 */
const localBasePrefix = isAbsoluteBase ? '' : baseKey;

const server = createServer(async (req, res) => {
  try {
    const url = new URL(req.url ?? '/', LOCAL_ORIGIN);
    let pathname = url.pathname;
    if (localBasePrefix && pathname.startsWith(`${localBasePrefix}/`)) {
      pathname = pathname.slice(localBasePrefix.length);
    }
    let filePath = path.join(DIST, decodeURIComponent(pathname));
    if (pathname === '/' || !path.extname(filePath)) {
      filePath = path.join(DIST, 'index.html');
    }
    const body = await readFile(filePath);
    res.writeHead(200, { 'content-type': MIME[path.extname(filePath)] ?? 'application/octet-stream' });
    res.end(body);
  } catch {
    res.writeHead(404).end('not found');
  }
});

await new Promise((resolve) => server.listen(PORT, '127.0.0.1', resolve));

/**
 * Prefer a locally installed Chrome so contributors do not have to download Chromium.
 * CI has no system Chrome and falls back to puppeteer's own binary.
 */
const localChrome = [
  process.env.CHROME_PATH,
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/usr/bin/google-chrome-stable',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium-browser',
  '/usr/bin/chromium',
]
  .filter(Boolean)
  .find((candidate) => existsSync(candidate));

const browser = await puppeteer.launch({
  executablePath: localChrome,
  headless: true,
  args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
});

try {
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  const failedRequests = [];
  page.on('requestfailed', (request) => failedRequests.push(request.url()));

  if (isAbsoluteBase) {
    // Serve every CDN-base request from dist/ so the bundle boots without the network.
    await page.setRequestInterception(true);
    page.on('request', async (request) => {
      const relative = requestPathFor(request.url());
      if (!relative) {
        request.continue().catch(() => {});
        return;
      }
      try {
        const body = await readFile(path.join(DIST, relative));
        await request.respond({
          status: 200,
          headers: {
            'content-type': MIME[path.extname(relative)] ?? 'application/octet-stream',
            // The CDN URL is cross-origin relative to the local page, and Vite emits
            // `crossorigin` on its tags, so the response must allow the local origin.
            'access-control-allow-origin': '*',
          },
          body,
        });
      } catch {
        await request.abort().catch(() => {});
      }
    });
  }

  await page.evaluateOnNewDocument(() => {
    window.__PRERENDER_INJECTED = true;
  });
  await page.goto(`${LOCAL_ORIGIN}/`, { waitUntil: 'networkidle0', timeout: 60_000 });
  // `<main>` is the semantic page root — stable across class renames.
  try {
    await page.waitForSelector('main', { timeout: 30_000 });
  } catch {
    const failed = failedRequests.length ? failedRequests.slice(0, 5).join('\n  ') : '(no failed requests)';
    throw new Error(
      `[prerender] the app never rendered <main>. Failed requests:\n  ${failed}\n` +
        'A CDN base that cannot be served from dist/ is the usual cause.',
    );
  }

  /**
   * `index.html` keeps `body` at `overflow: hidden`, so the page has to scroll inside an
   * ancestor of `<main>`. `behavior.ts` finds that element by computed overflow, so the
   * contract is behavioural: if nobody scrolls, every scroll-driven interaction dies.
   */
  const brokenScrollContainer = await page.evaluate(() => {
    const main = document.querySelector('main');
    if (!main) return 'the page has no <main> element';
    for (let el = main.parentElement; el && el !== document.documentElement; el = el.parentElement) {
      const overflowY = getComputedStyle(el).overflowY;
      if (overflowY === 'auto' || overflowY === 'scroll' || overflowY === 'overlay') return '';
    }
    return 'no inner scroll container — body overflow is hidden, so the page will not scroll';
  });
  if (brokenScrollContainer) throw new Error(`[prerender] ${brokenScrollContainer}`);
  // Let the entrance animations and counters settle so the snapshot is not the initial frame.
  await new Promise((resolve) => setTimeout(resolve, 1200));

  /**
   * Only the rendered `#app` subtree is taken from the browser. The rest of the document
   * comes from the template Vite emitted, so a rendering browser can never contribute
   * markup to the artifact (see the "extensions" note in the header).
   */
  const appHtml = await page.evaluate(() => {
    const app = document.querySelector('#app');
    return app ? app.outerHTML : '';
  });
  if (!appHtml) throw new Error('[prerender] the rendered page has no #app container');

  const template = await readFile(path.join(DIST, 'index.html'), 'utf8');
  const mountPoint = /<div id="app"><\/div>/;
  if (!mountPoint.test(template)) throw new Error('[prerender] the built index.html has no empty #app mount point');

  // Drop the first-paint skeleton: the prerendered page already has real content. The
  // non-greedy body plus the `#app` lookahead lands on the skeleton's own closing tag.
  const withoutSkeleton = template.replace(
    /\s*<div class="landing-loading">[\s\S]*?<\/div>\s*(?=<div id="app">)/,
    '\n    ',
  );
  if (withoutSkeleton.includes('class="landing-loading"')) {
    throw new Error('[prerender] could not remove the first-paint skeleton from the template');
  }

  const html = withoutSkeleton.replace(mountPoint, () => appHtml);

  /**
   * Anything the app resolved against `location` during rendering carries the local
   * origin; rewrite it to the configured base so a build-machine address never ships.
   */
  const output = [LOCAL_ORIGIN, `http://localhost:${PORT}`].reduce(
    (acc, origin) => acc.replaceAll(origin, isAbsoluteBase ? baseNoSlash : ''),
    html,
  );

  await writeFile(path.join(DIST, 'index.html'), output, 'utf8');

  const title = await page.title();
  const hasCopy = output.includes('为全球开发者');
  const leftover = output.includes('127.0.0.1') || output.includes('localhost');
  console.log(
    `[prerender] ok | title="${title}" | copy=${hasCopy} | bytes=${output.length} | base=${baseNoSlash || '/'} | loopback=${leftover}`,
  );
  if (!hasCopy) {
    console.error('[prerender] the prerendered output is missing the hero copy — aborting');
    process.exitCode = 1;
  }
  if (leftover) {
    console.error('[prerender] a loopback address leaked into the output — aborting');
    process.exitCode = 1;
  }
} finally {
  await browser.close();
  await new Promise((resolve) => server.close(resolve));
}
