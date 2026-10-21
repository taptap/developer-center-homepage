// @ts-nocheck -- vendored utility code; upstream type declarations are not available here
type Timer = ReturnType<typeof setTimeout>;

const isObject = (value: any) => {
  return typeof value === 'object' && value !== null;
};

const defaultTo = <T>(value: T, defaultValue: T) => {
  if (value === undefined || value === null || Number.isNaN(value)) {
    return defaultValue;
  }
  return value;
};

/**
 * @see https://www.measurethat.net/Benchmarks/Show/7472/0/lodash-clonedeep-vs-json-clone-with-youtube-data
 */
export function cloneDeep(data: object) {
  if (!isObject(data)) {
    return data;
  }
  return JSON.parse(JSON.stringify(data));
}

/**
 * @example
 * ```js
 *  lg({ out: { inner: 3}}, 'out.inner', 4) // 3
 *  lg({ out: { inner: 3}}, 'out.inner.inner') // null
 *  lg({ out: { inner: 3}}, 'out.inner.inner', 4) // 4
 * ```
 */
export const lg = <TDefault = unknown>(
  value: any,
  path?: string,
  defaultValue?: TDefault,
  isDeepClone = false,
): TDefault => {
  if (defaultValue === undefined) {
    defaultValue = null as TDefault;
  }
  if (typeof path !== 'string') {
    return defaultValue;
  }
  const segments = path.split(/[.[\]]/g);
  let current: any = value;
  for (let key of segments) {
    if (current === null || current === undefined) {
      return defaultValue;
    }
    key = key.replace(/['"]/g, '');
    if (key.trim() === '') {
      continue;
    }
    current = current?.[key];
  }
  current = defaultTo(current, defaultValue);
  return isDeepClone ? cloneDeep(current) : current;
};

type AnyFunction = (...args: any[]) => any;

export const debounce = (func: AnyFunction, wait: number = 50, config: { leading?: boolean; } = { leading: false }) => {
  let timer: Timer | undefined;
  const active = true;
  const leading = config.leading;
  const debounced = (...args: any[]) => {
    if (active) {
      clearTimeout(timer);
      if (leading && !timer) {
        func(...args);
      }
      timer = setTimeout(() => {
        active && !leading && func(...args);
        timer = undefined;
      }, wait);
    } else {
      func(...args);
    }
  };
  return debounced;
};

export const throttle = (func: AnyFunction, wait: number = 50) => {
  let timer: Timer | undefined;
  let active = true;
  const throttled = (...args: any[]) => {
    if (!active) {
      return;
    }
    active = false;
    timer = setTimeout(() => {
      clearTimeout(timer);
      timer = undefined;
      active = true;
    }, wait);
    return func(...args);
  };
  return throttled;
};

export const uniqBy = (arr: Record<string, any> | string[], keys: string[]) => {
  if (!Array.isArray(arr) || !Array.isArray(keys) || keys.length === 0) {
    throw new Error(
      'Invalid input. The first parameter should be an array, and the second parameter should be a non-empty array of keys.',
    );
  }

  if (typeof arr[0] === 'string') {
    // If the array is a string array, ensure unique values based on keys
    const uniqueValues = new Set();
    return arr.filter((item) => {
      if (uniqueValues.has(item)) {
        return false;
      }
      uniqueValues.add(item);
      return true;
    });
  } else if (typeof arr[0] === 'object') {
    // If the array is an object array, ensure unique objects based on key combinations
    const uniqueObjects = new Set();
    return arr.filter((item) => {
      const keyCombination = keys.map((key) => lg(item, key)).join('|');
      if (uniqueObjects.has(keyCombination)) {
        return false;
      }
      uniqueObjects.add(keyCombination);
      return true;
    });
  } else {
    throw new Error('Invalid input. The first parameter should be an array of strings or an array of objects.');
  }
};
