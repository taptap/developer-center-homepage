// @ts-nocheck -- vendored utility code; upstream type declarations are not available here
/**
 */
export const inTapClient = (): boolean => {
  try {
    return !!(window?.urlResource?.TapTapAPI || window?.TapTapAPI);
  } catch {
    return false;
  }
};
