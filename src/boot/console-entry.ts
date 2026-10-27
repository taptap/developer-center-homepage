import { fetchDeveloperList } from '@/api/developer-list';
import { fetchMe } from '@/api/me';
import { ON_LOOPBACK, PRERENDERING } from '@/config/origin';

/**
 * The homepage doubles as the console's front door: a visitor who is signed in and already
 * owns a developer account is sent straight to `/{developerId}/all-apps` instead of being
 * shown the marketing page. The rules mirror the SPA route guard this page replaced, so
 * that landing on `/` behaves the same way from either entry point.
 *
 * Every uncertainty resolves to `null` — "stay on the homepage". A wrong redirect is much
 * worse than a missed one: it would drop a signed-out visitor, or a developer whose list
 * failed to load, into a console page they cannot use.
 */

/** Upper bound for keeping the first-paint skeleton up while deciding. */
const ENTRY_CHECK_TIMEOUT_MS = 1200;

/** Path prefix of the login callback: coming back from a sign-in still ends in the console. */
const LOGIN_CALLBACK_PREFIX = '/auth/';

/** Navigation types the browser reports for history traversal. */
const BACK_FORWARD = 'back_forward';

/**
 * Where the console starts for this visitor, or `null` when the homepage should stay.
 *
 * Never throws: the caller always gets to render the page.
 */
export async function resolveConsoleEntry(): Promise<string | null> {
  // The prerendered artifact must always be the homepage; a redirect would bake it in.
  if (PRERENDERING) return null;
  // A bare static server has no API behind it, so the check cannot answer anything.
  if (ON_LOOPBACK) return null;
  // `?from=…` marks an intentional landing (campaign, docs, QR code): the homepage is the
  // destination, not a trampoline.
  if (new URLSearchParams(location.search).has('from')) return null;
  // A history traversal is the visitor asking for the homepage: going "back" from the
  // console must not bounce them forward again, even when the browser reloads the document
  // instead of restoring it from the back/forward cache (in which case `document.referrer`
  // can still point at wherever the session originally started).
  if (isHistoryTraversal()) return null;
  // Internal navigation back to `/` means the visitor asked for the homepage.
  if (!isFirstVisit()) return null;

  const target = await withTimeout(probeConsoleEntry(), ENTRY_CHECK_TIMEOUT_MS);
  return target;
}

/**
 * `true` for a first visit, a reload, or a return from the login callback — the cases where
 * the visitor has not expressed interest in the homepage itself. Cross-origin referrers
 * (search results, docs, social posts) count as first visits too.
 */
function isHistoryTraversal(): boolean {
  const [navigation] = performance.getEntriesByType('navigation');
  return (navigation as PerformanceNavigationTiming | undefined)?.type === BACK_FORWARD;
}

function isFirstVisit(): boolean {
  const referrer = document.referrer;
  if (!referrer) return true;

  let url: URL;
  try {
    url = new URL(referrer);
  } catch {
    return true;
  }

  if (url.origin !== location.origin) return true;
  if (url.pathname.startsWith(LOGIN_CALLBACK_PREFIX)) return true;
  // A reload reports the page itself as the referrer.
  return url.pathname === location.pathname;
}

async function probeConsoleEntry(): Promise<string | null> {
  const me = await fetchMe();
  if (!me) return null; // signed out

  const developers = await fetchDeveloperList();
  if (!developers || developers.length === 0) return null; // unresolved, or no account yet

  const developerId = developers[0]?.id;
  if (developerId === undefined || developerId === null || developerId === '') return null;

  return `/${encodeURIComponent(String(developerId))}/all-apps`;
}

/** A late redirect is worse than none: once the deadline passes, the page is the answer. */
async function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T | null> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  const timeout = new Promise<null>((resolve) => {
    timer = setTimeout(() => resolve(null), ms);
  });
  try {
    return await Promise.race([promise.catch(() => null), timeout]);
  } finally {
    if (timer !== undefined) clearTimeout(timer);
  }
}
