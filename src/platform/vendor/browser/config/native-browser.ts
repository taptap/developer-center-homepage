// @ts-nocheck -- vendored utility code; upstream type declarations are not available here
export const HuaweiBrowser = /HuaweiBrowser|Build\/HUAWEI|ELS-|BNE-huawei.*?Build\/huawei/i;
export const MZBrowser = /MZBrowser/i;
export const VivoBrowser = /VivoBrowser|VIVO/i;
export const HeyTapBrowser = /HeyTapBrowser|OPPO/i;
export const MiuiBrowser = /MiuiBrowser/i;
export const HonorBrowser = /Build\/HONOR|bdhonorbrowser|LGE-/i;
export const LenovoBrowser = /LENOVO/i;

export const nativeBrowser: Record<string, RegExp> = {
  HuaweiBrowser,
  MZBrowser,
  VivoBrowser,
  HeyTapBrowser,
  MiuiBrowser,
  HonorBrowser,
  LenovoBrowser,
};

export function isNativeBrowser(ua: string): boolean {
  return Object.keys(nativeBrowser).some((key) => {
    return nativeBrowser[key]?.test(ua) || false;
  });
}
