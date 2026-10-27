import { ON_LOOPBACK, PRODUCTION_ORIGIN } from '@/config/origin';

/** A developer (vendor) account the current user can manage. */
export interface DeveloperSummary {
  id: string | number;
  name: string;
}

/**
 * Developers the current user belongs to.
 *
 * Same transport rules as `fetchMe`: relative URL so each environment talks to its own
 * API, `credentials: 'include'` for the session cookie, and a 401 resolves to `null`
 * instead of throwing.
 *
 * `null` means "the question could not be answered" — signed out, network error, or a
 * payload without a `list`. Callers must not read it as "no developers": the entry
 * decision treats every unresolved state as "stay on the homepage".
 */
const LIST_ENDPOINT = ON_LOOPBACK ? `${PRODUCTION_ORIGIN}/api/developer/v1/list` : '/api/developer/v1/list';

export async function fetchDeveloperList(): Promise<DeveloperSummary[] | null> {
  try {
    const res = await fetch(LIST_ENDPOINT, {
      method: 'GET',
      credentials: 'include',
    });
    if (res.status === 401 || !res.ok) return null;
    const json = await res.json();
    const data = json && json.success ? json.data : json;
    const list = data && data.list;
    return Array.isArray(list) ? (list as DeveloperSummary[]) : null;
  } catch (error) {
    // Expected on loopback: production sends no CORS headers for a local origin.
    if (!ON_LOOPBACK) console.warn('[landing] request to /api/developer/v1/list failed', error);
    return null;
  }
}
