// @ts-nocheck -- vendored utility code; upstream type declarations are not available here
type Storage = Window['localStorage'] | Window['sessionStorage'] | typeof localMemoryStorage;
type StorageType = 'local' | 'session' | 'memory' | boolean;
export type StorageValue = string | undefined | null;

const storageAvailable = (storage: Storage): boolean => {
  try {
    const x = '__storage_test__';
    storage.setItem(x, x);
    const ok = storage.getItem(x) === x;
    storage.removeItem(x);
    return ok;
  } catch {
    return false;
  }
};

let memoryData: Record<string, StorageValue> = {};

const localMemoryStorage = {
  setItem(key: string, value: StorageValue): void {
    memoryData[key] = value;
  },
  getItem(key: string): StorageValue {
    return memoryData[key] || null;
  },
  removeItem(key: string): void {
    delete memoryData[key];
  },
  clear(): void {
    memoryData = {};
  },
};

const localTapStorage = {
  storage: (() => {
    if (typeof window === 'undefined') {
      return localMemoryStorage;
    }
    if (window.localStorage && storageAvailable(window.localStorage)) {
      return window.localStorage;
    } else if (window && window.sessionStorage && storageAvailable(window.sessionStorage)) {
      return window.sessionStorage;
    } else {
      return localMemoryStorage;
    }
  })(),
  /**
   * @param {'local' | 'session' | 'memory'} type
   * @returns Storage
   */
  getStorage(type?: StorageType): Storage {
    if (!type) {
      return this.storage;
    }
    switch (type) {
      case 'local':
        try {
          return localStorage;
        } catch {
          return localMemoryStorage;
        }
      case 'session':
        try {
          return sessionStorage;
        } catch {
          return localMemoryStorage;
        }
      case 'memory':
        return localMemoryStorage;
      default:
        return this.storage;
    }
  },
};

const serialize = function (value: StorageValue): string | undefined {
  if (!value) {
    return;
  }
  return JSON.stringify(value);
};

const safelyDeserialize = (value: StorageValue): StorageValue => {
  if (typeof value !== 'string') {
    return value;
  }
  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
};

const storeApi = {
  set(key: string, value: StorageValue, options: { type: StorageType; } = { type: false }): void {
    if (!value) {
      return;
    }
    // @ts-expect-error -- this is bound to localTapStorage via Object.assign
    this.getStorage(options.type).setItem(key, serialize(value));
  },

  get(key: string, options: { type: StorageType; } = { type: false }): StorageValue {
    if (!key) {
      return;
    }
    // @ts-expect-error -- this is bound to localTapStorage via Object.assign
    const value = this.getStorage(options.type).getItem(key);
    return safelyDeserialize(value);
  },

  remove(key: string, options: { type: StorageType; } = { type: false }): void {
    if (!key) {
      return;
    }
    // @ts-expect-error -- this is bound to localTapStorage via Object.assign
    this.getStorage(options.type).removeItem(key);
  },

  clear(options: { type: StorageType; } = { type: false }): void {
    // @ts-expect-error -- this is bound to localTapStorage via Object.assign
    this.getStorage(options.type).clear();
  },

  // obj  e.：{ key: value, key1: value }
  setList(obj: Record<string, StorageValue>, options: { type: StorageType; } = { type: false }): void {
    for (const key in obj) {
      this.set(key, obj[key], options);
    }
  },

  getList(keys: string[], options: { type: StorageType; } = { type: false }): StorageValue[] {
    return keys.map((key) => this.get(key, options));
  },
};

export const tapStorage = Object.assign(localTapStorage, storeApi);
