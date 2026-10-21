// @ts-nocheck -- vendored utility code; upstream type declarations are not available here
export const HuaWei = /HUAWEI/i;
export const Honor = /HONOR/i;
export const Lenovo = /Lenovo/i;

export const deviceModel: Record<string, RegExp> = {
  HuaWei,
  Honor,
  Lenovo,
};
export function isDeviceModel(ua: string): boolean {
  return Object.keys(deviceModel).some((key) => {
    return deviceModel[key]?.test(ua) || false;
  });
}
