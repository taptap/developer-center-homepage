#!/usr/bin/env node
/**
 * Package release assets:
 *   .release/developer-center-homepage-v<version>.tar.gz
 *   .release/developer-center-homepage-v<version>.sha256
 *   .release/manifest.json
 *
 * The tarball always contains `./index.html` and `./assets/**`, so the deployment
 * pipeline can unpack and publish it without extra logic.
 */
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { copyFileSync, mkdirSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs';
import path from 'node:path';

const DIST = path.resolve('dist');
const OUT = path.resolve('.release');
const pkg = JSON.parse(readFileSync(path.resolve('package.json'), 'utf8'));

/**
 * Version resolution: prefer the tag being released over `package.json`.
 *
 * Release tags are CalVer (`v2026.10.21`, same-day repeats `v2026.10.21.1`), so the asset
 * name always matches the release it is attached to even when `package.json` was not
 * bumped (it only feeds local, non-tag builds).
 * `workflow_dispatch` runs on a branch, where `GITHUB_REF_NAME` is a branch name —
 * reject that explicitly, and otherwise only accept values shaped like a version.
 */
const TAG_VERSION = /^v?(\d+(?:\.\d+)+(?:-[0-9A-Za-z.-]+)?(?:\+[0-9A-Za-z.-]+)?)$/;
const refName = process.env.GITHUB_REF_NAME ?? '';
const onBranchRef = process.env.GITHUB_REF_TYPE === 'branch';
const tagMatch = onBranchRef ? null : TAG_VERSION.exec(refName);
const version = tagMatch ? tagMatch[1] : pkg.version;
const versionSource = tagMatch ? `tag ${refName}` : 'package.json';

const name = pkg.name;

rmSync(OUT, { recursive: true, force: true });
mkdirSync(OUT, { recursive: true });

const tarballName = `${name}-v${version}.tar.gz`;
const tarballPath = path.join(OUT, tarballName);

execFileSync('tar', ['-czf', tarballPath, '-C', DIST, '.'], { stdio: 'inherit' });

const sha256 = createHash('sha256').update(readFileSync(tarballPath)).digest('hex');
writeFileSync(path.join(OUT, `${name}-v${version}.sha256`), `${sha256}  ${tarballName}\n`);

const files = readdirSync(DIST, { recursive: true })
  .filter((entry) => {
    try {
      return statSync(path.join(DIST, entry)).isFile();
    } catch {
      return false;
    }
  })
  .map((entry) => String(entry));

/**
 * Provenance: the commit that was actually built.
 *
 * `GITHUB_SHA` is the commit of the ref the workflow ran on, which is not necessarily the
 * commit that was checked out — `workflow_dispatch` takes a second, optional `ref` input.
 * Ask git first and keep the event value only as a fallback (tarball exports, no repo).
 */
const commit = (() => {
  try {
    const sha = execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim();
    return sha || null;
  } catch {
    return process.env.GITHUB_SHA ?? null;
  }
})();

const manifest = {
  name,
  version,
  commit,
  buildTime: new Date().toISOString(),
  entry: 'index.html',
  sha256,
  bytes: statSync(tarballPath).size,
  files: files.sort(),
};
writeFileSync(path.join(OUT, 'manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`);

// A checksum file that is easy to consume by hand
copyFileSync(path.join(OUT, `${name}-v${version}.sha256`), path.join(OUT, 'sha256.txt'));

console.log(
  `[package] ${tarballName} | version ${version} (from ${versionSource}) | ${(manifest.bytes / 1024 / 1024).toFixed(2)} MB | ${files.length} files`,
);
console.log(`[package] sha256 ${sha256}`);
