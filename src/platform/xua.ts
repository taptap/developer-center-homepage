import Cookie from 'js-cookie';
import { getXUA as buildXUA, toVersionCode } from './vendor/xua';

declare const __APP_VERSION__: string;

/**
 * X-UA — the identity string shared by network calls and analytics.
 *
 * Field semantics that must not drift:
 * - `PN=DevCenter` identifies the product; downstream reporting groups by it
 * - `VN_CODE` is derived from the package version (`1.0.0` → `100000000`)
 * - `LANG=zh_CN` is fixed: the page is Chinese-only
 * - `VID` carries the `user_id` cookie when present
 */
const LOCALE = 'zh_CN';

const VN_CODE = toVersionCode(__APP_VERSION__);

let cachedXua: string | null = null;
let cachedUserId: string | undefined;

function getXuaUserId(): string | undefined {
  return Cookie.get('user_id') || undefined;
}

export function getXua(): string {
  const userId = getXuaUserId();
  if (cachedXua === null || cachedUserId !== userId) {
    cachedXua = buildXUA({
      projectName: 'DevCenter',
      version: VN_CODE,
      lang: LOCALE,
      userId,
    });
    cachedUserId = userId;
  }
  return cachedXua;
}
