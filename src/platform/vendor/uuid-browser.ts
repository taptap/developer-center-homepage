// @ts-nocheck -- vendored utility code; upstream type declarations are not available here
// eslint-disable-next-line ts/ban-ts-comment -- Preserve legacy UUID type suppression.
import { tapStorage } from './dom/storage';
import type { StorageValue } from './dom/storage';
import { Cookie } from './dom/cookie';

let rnds8Pool: Uint8Array | null = null;

const getRandomValues = (arr: Uint8Array) => {
  if (typeof window !== 'undefined' && window?.crypto?.getRandomValues) {
    return window.crypto.getRandomValues(arr);
  }
  const { length } = arr;
  for (let i = 0; i < length; i++) {
    arr[i] = Math.floor(Math.random() * 256);
  }
  return arr;
};

const rng = () => {
  if (!rnds8Pool) {
    rnds8Pool = new Uint8Array(16);
  }
  rnds8Pool = getRandomValues(rnds8Pool);
  return rnds8Pool;
};
const byteToHex: string[] = [];

const unsafeStringify = (arr: Uint8Array) => {
  if (!byteToHex.length) {
    for (let i = 0; i < 256; ++i) {
      byteToHex.push((i + 0x100).toString(16).slice(1));
    }
  }
  return (
    byteToHex[arr[0]]
    + byteToHex[arr[1]]
    + byteToHex[arr[2]]
    + byteToHex[arr[3]]
    + '-'
    + byteToHex[arr[4]]
    + byteToHex[arr[5]]
    + '-'
    + byteToHex[arr[6]]
    + byteToHex[arr[7]]
    + '-'
    + byteToHex[arr[8]]
    + byteToHex[arr[9]]
    + '-'
    + byteToHex[arr[10]]
    + byteToHex[arr[11]]
    + byteToHex[arr[12]]
    + byteToHex[arr[13]]
    + byteToHex[arr[14]]
    + byteToHex[arr[15]]
  );
};

export const uuidv4 = () => {
  if (typeof window !== 'undefined' && window?.crypto?.randomUUID) {
    return window.crypto.randomUUID();
  }
  const rnds = rng();

  rnds[6] = (rnds[6] & 0x0F) | 0x40;
  rnds[8] = (rnds[8] & 0x3F) | 0x80;

  return unsafeStringify(rnds);
};

export const getUUID = (uuidKey = 'web_app_uuid') => {
  let uuid: StorageValue = Cookie.get(uuidKey);
  if (uuid) {
    tapStorage.set(uuidKey, uuid);
    return uuid;
  }
  uuid = tapStorage.get(uuidKey);
  if (uuid) {
    Cookie.set(uuidKey, uuid);
    return uuid;
  }
  uuid = uuidv4();
  Cookie.set(uuidKey, uuid);
  tapStorage.set(uuidKey, uuid);
  return uuid;
};
