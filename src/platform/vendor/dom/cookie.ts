// @ts-nocheck -- vendored utility code; upstream type declarations are not available here
/**
 * Cookie helper with a secure-by-default `set`.
 *
 * Compatibility note: js-cookie v3 builds its API with `Object.create(prototype)`,
 * so its methods are inherited rather than own enumerable properties. Spreading the
 * default export (which worked with v2's plain object) yields an empty object, so the
 * methods are forwarded explicitly here.
 */
import Cookies from 'js-cookie';

const defaultOptions = {
  secure: (() => {
    // eslint-disable-next-line node/prefer-global/process -- Preserve legacy global process lookup.
    if (typeof process === 'undefined') {
      return true;
    }
    // eslint-disable-next-line node/prefer-global/process -- Preserve legacy global process lookup.
    if (process?.env?.NODE_ENV === 'development') {
      return false;
    }
    return true;
  })(),
};

const set = (key: string, value: string, options?: Cookies.CookieAttributes) => {
  return Cookies.set(key, value, { ...defaultOptions, ...options });
};

export const Cookie = {
  get: (key: string) => Cookies.get(key),
  set,
  remove: (key: string, options?: Cookies.CookieAttributes) => Cookies.remove(key, options),
};
