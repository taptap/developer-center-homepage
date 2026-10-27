import { ON_LOOPBACK, PRODUCTION_ORIGIN } from '@/config/origin';

interface UserWithMenu {
  menu: Array<{ title: string; url: string }>;
  user: {
    id: number;
    name: string;
    avatar: string;
    isDeveloperManagement?: boolean;
    isOfficialAccount?: boolean;
    developer?: { name?: string };
  };
}

/**
 * Current user (with menu entries).
 *
 * - The URL is **relative** so each environment talks to its own API: production hits
 *   `developer.taptap.cn/api/...`, RND hits `developer.xdrnd.cn/api/...`, each with its own
 *   session cookie
 * - The one exception is loopback (`pnpm dev` / `pnpm preview`): the static server has no
 *   API behind it, so the request falls back to the production origin. Note the browser
 *   still blocks it — production sends no CORS headers and its cookies are not sent
 *   cross-site — so locally the header simply stays in the signed-out state.
 * - Authenticates with cookies, so `credentials: 'include'` is required
 * - A 401 means "not signed in" and resolves to `null` instead of throwing
 * - The endpoint answers either `{ success, data }` or the payload directly
 * - The answer is memoised for the page lifetime: the console-entry check and the
 *   signed-in header ask the same question, and a second round trip would only repeat it
 */
const USER_ENDPOINT = ON_LOOPBACK ? `${PRODUCTION_ORIGIN}/api/user/v1/me` : '/api/user/v1/me';

let meRequest: Promise<UserWithMenu | null> | null = null;

export function fetchMe(): Promise<UserWithMenu | null> {
  meRequest ??= requestMe();
  return meRequest;
}

async function requestMe(): Promise<UserWithMenu | null> {
  try {
    const res = await fetch(USER_ENDPOINT, {
      method: 'GET',
      credentials: 'include',
    });
    if (res.status === 401 || !res.ok) return null;
    const json = await res.json();
    const data = json && json.success ? json.data : json;
    return data && data.user ? (data as UserWithMenu) : null;
  } catch (error) {
    // Expected on loopback: the production API has no CORS headers for a local origin.
    // Elsewhere this is a genuine failure worth surfacing.
    if (!ON_LOOPBACK) console.warn('[landing] request to /api/user/v1/me failed', error);
    return null;
  }
}
