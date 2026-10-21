// @ts-nocheck -- vendored utility code; upstream type declarations are not available here
export const HeadlessChrome = /HeadlessChrome/i;
export const Electron = /electron/i;
export const Chrome = /Chrome|CriOS|CrMo/i;
export const Firefox = /Firefox|fxios/i;
export const iOSWebview = /like\sGecko\)\sMobile\/\w{3,}$/i;
export const Safari = /Version[|/]([\w.]+)(\s\w.+)?\s?Safari/i;
export const Chromium = /chromium/i;
export const AndroidBrowser
  = /Android.*Mobile\sSafari|Android\/(\d[.\d]+)\sRelease\/(\d[.\d]+)\sBrowser\/AppleWebKit(\d[.\d]+)/i;

export const fallbackBrowser: Record<string, RegExp> = {
  HeadlessChrome,
  Electron,
  Chrome,
  Firefox,
  iOSWebview,
  Safari,
  Chromium,
  AndroidBrowser,
};

export function isFallbackBrowser(ua: string): boolean {
  return Object.keys(fallbackBrowser).some((key) => {
    return fallbackBrowser[key]?.test(ua) || false;
  });
}
