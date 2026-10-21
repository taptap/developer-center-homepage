import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

const pkg = JSON.parse(readFileSync(new URL('./package.json', import.meta.url), 'utf8'));

/**
 * The release workflow passes the tag-derived version (`APP_VERSION`), so the artifact
 * carries the version it is released as even when `package.json` was not bumped. Local
 * builds fall back to `package.json`.
 */
const appVersion = process.env.APP_VERSION || pkg.version;

/**
 * `PUBLIC_BASE`:
 * - Local dev and preview builds: leave unset, or pass `/<repo>/`
 * - Production: pass the absolute CDN base, e.g.
 *   `//<bucket>.oss-accelerate.aliyuncs.com/developer-center-homepage/current/`
 *
 * Only `index.html` has to be same-origin (it is proxied); assets are served from
 * that absolute base, so they need no proxy rule.
 */
const publicBase = process.env.PUBLIC_BASE || '/';
const absoluteBase = publicBase.startsWith('//') ? `https:${publicBase}` : publicBase;
const withTrailingSlash = absoluteBase.endsWith('/') ? absoluteBase : `${absoluteBase}/`;

/**
 * Social preview images must be absolute URLs: crawlers do not resolve relative
 * paths reliably. `public/og-wide.png` is emitted next to `index.html`, so the URL is
 * the same base plus the file name.
 *
 * When the base is an absolute CDN origin, the same origin also gets a `preconnect`:
 * the stylesheet and every image come from there, so the handshake starts earlier.
 */
const htmlHeadPlugin = {
  name: 'html-head',
  transformIndexHtml(html: string) {
    const rendered = html
      .replaceAll('__OG_IMAGE_WIDE__', `${withTrailingSlash}og-wide.png`)
      .replaceAll('__APP_VERSION__', appVersion);
    if (!/^https?:\/\//.test(withTrailingSlash)) return rendered;
    const origin = new URL(withTrailingSlash).origin;
    return rendered.replace('</title>', `</title>\n    <link rel="preconnect" href="${origin}" crossorigin />`);
  },
};

export default defineConfig({
  base: publicBase,
  plugins: [vue(), htmlHeadPlugin],
  resolve: {
    // `@` points at `src`, so imports do not depend on how deep a file sits
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  define: {
    __APP_VERSION__: JSON.stringify(appVersion),
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    target: 'es2022',
  },
});
