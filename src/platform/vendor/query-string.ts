// @ts-nocheck -- vendored utility code; upstream type declarations are not available here
/**
 * @param {object} obj
 * @param {{addQueryPrefix: boolean}} [option]
 */
export function stringify(obj: string | Record<string, string>, option: any = {}): string {
  const { addQueryPrefix = false } = option;
  if (typeof obj === 'string') {
    if (addQueryPrefix && obj[0] !== '?') {
      obj = '?' + obj;
    }
    return obj;
  }
  try {
    const searchParams = new URLSearchParams(obj);
    const searchStr = searchParams.toString();
    if (addQueryPrefix) {
      return '?' + searchStr;
    }
    return searchStr;
  } catch (e) {
    console.error(e);
  }
  return '';
}

/**
 * @param {string} str
 */
export function parse(str: string): Record<string, string> {
  if (typeof str !== 'string') {
    return str;
  }
  if (str[0] === '?') {
    str = str.slice(1);
  }
  try {
    const searchParams = new URLSearchParams(str);
    const obj: Record<string, string> = {};
    for (const [key, value] of searchParams.entries()) {
      obj[key] = value;
    }
    return obj;
  } catch (e) {
    console.error(e);
  }
  return {};
}
