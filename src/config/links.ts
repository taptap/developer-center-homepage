import { PRODUCTION_ORIGIN } from './origin';

/**
 * Every link this page points at, in one place.
 *
 * Paths are relative to this origin, absolute URLs leave it; where each one lands is up
 * to the app on the other side, so nothing here needs to know about it.
 */

/**
 * Same-origin paths resolve against the page's own origin, which in production *is*
 * developer.taptap.cn — that keeps the artifact free of absolute URLs.
 *
 * Two exceptions:
 * - while prerendering (`__PRERENDER_INJECTED`) behave like production, so no absolute
 *   URL is baked into `dist/index.html`
 * - on loopback (`pnpm dev` / `pnpm preview`) those paths do not exist locally, so point
 *   them at production and the links stay clickable
 */
const prerendering = typeof window !== 'undefined' && window.__PRERENDER_INJECTED === true;
const onLoopback =
  !prerendering &&
  typeof location !== 'undefined' &&
  /^(localhost|127\.0\.0\.1|\[::1\]|0\.0\.0\.0)$/i.test(location.hostname);

const ORIGIN = onLoopback ? PRODUCTION_ORIGIN : '';
const path = (value: string): string => `${ORIGIN}${value}`;

export const LINKS = {
  // Paths on this origin
  console: path('/console'),
  login: path('/auth/login?refer=%2F'),
  cli: path('/v3/cli/'),
  docs: path('/docs/'),
  tutorials: path('/tds-tutorials/list'),
  agents: path('/agents/'), // trailing slash: the bare path answers with a 301
  tdw: path('/tdw2026/'), // trailing slash: the bare path answers with a 302

  // External
  forum: 'https://www.taptap.cn/forum/g28',
  terms: 'https://www.taptap.cn/doc/terms/',
  privacy: 'https://www.taptap.cn/doc/privacy-policy/',
  spotlight: 'https://spotlight.taptap.cn/',

  // Growth partners
  adPlatform: 'https://biz.taptap.cn/',
  /** Same partner as `adPlatform`, kept as shipped in the navigation menu. */
  adPlatformMenu: 'https://biz.taptap.com/?currentLang=zh_CN',
  resExchange: 'https://rep.taptap.cn/',
  contentMarketing: 'https://tapu.taptap.cn/',
  adNetwork: 'https://www.dirichlet.cn/',

  // Footer legal
  icp: 'https://beian.miit.gov.cn',
  icpLicense: 'https://www.taptap.cn/license/www.html',
  // The old `beian.gov.cn` entry point redirects here; link the https target directly.
  police: 'https://beian.mps.gov.cn/#/query/webSearch?code=31010402003255',
  antiSpam: 'https://www.shjbzx.cn/',
  reportCenter: 'https://www.12377.cn/',
  mailBusiness: 'mailto:cooperation@taptap.com',
  mailOperation: 'mailto:operation@taptap.com',
} as const;
