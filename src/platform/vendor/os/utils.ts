// @ts-nocheck -- vendored utility code; upstream type declarations are not available here
import { EMPTY, STR_TYPE, UA_MAX_LENGTH, UNDEF_TYPE } from './constants';

export const has = (str1: string, str2: string) => {
  // eslint-disable-next-line valid-typeof, ts/no-use-before-define, unicorn/prefer-includes -- Preserve constants and legacy String#indexOf lookup.
  return typeof str1 === STR_TYPE ? lowerize(str2).indexOf(lowerize(str1)) !== -1 : false;
};
export const lowerize = (str: string) => {
  return str.toLowerCase();
};
export const trim = (str: string, len: number) => {
  // eslint-disable-next-line valid-typeof -- Preserve constants used by the legacy UA parser.
  if (typeof str === STR_TYPE) {
    str = str.replace(/^\s\s*/, EMPTY).replace(/\s\s*$/, EMPTY);
    // eslint-disable-next-line valid-typeof -- Preserve constants used by the legacy UA parser.
    return typeof len === UNDEF_TYPE ? str : str.substring(0, UA_MAX_LENGTH);
  }
};
