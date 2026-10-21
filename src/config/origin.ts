/**
 * Where this page is published, and whether it is currently rendering somewhere else.
 *
 * The production origin is only needed by two callers: same-origin *links* while
 * previewing on loopback, and nothing else — API calls stay relative so the page talks to
 * whatever environment is serving it (production, RND/staging, …). Keeping the checks here
 * means the rules are stated once.
 */
export const PRODUCTION_ORIGIN = 'https://developer.taptap.cn';

/** Prerendering runs on a local server but must behave like production. */
export const PRERENDERING = typeof window !== 'undefined' && window.__PRERENDER_INJECTED === true;

/** `pnpm dev` / `pnpm preview`: the page runs on a bare static server, no app behind it. */
export const ON_LOOPBACK =
  !PRERENDERING &&
  typeof location !== 'undefined' &&
  /^(localhost|127\.0\.0\.1|\[::1\]|0\.0\.0\.0)$/i.test(location.hostname);
