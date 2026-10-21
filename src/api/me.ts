import { PRODUCTION_ORIGIN } from '@/config/origin';

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
 * - Authenticates with cookies, so `credentials: 'include'` is required
 * - A 401 means "not signed in" and resolves to `null` instead of throwing
 * - The endpoint answers either `{ success, data }` or the payload directly
 */
export async function fetchMe(): Promise<UserWithMenu | null> {
  try {
    const res = await fetch(`${PRODUCTION_ORIGIN}/api/user/v1/me`, {
      method: 'GET',
      credentials: 'include',
    });
    if (res.status === 401 || !res.ok) return null;
    const json = await res.json();
    const data = json && json.success ? json.data : json;
    return data && data.user ? (data as UserWithMenu) : null;
  } catch (error) {
    console.warn('[landing] request to /api/user/v1/me failed', error);
    return null;
  }
}
