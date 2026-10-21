// @ts-nocheck -- vendored utility code; upstream type declarations are not available here
import { inTapClient } from './in-tap-client';
import { isAndroid } from './browser/index';
import { parse } from './query-string';
import { uuidv4 } from './uuid-browser';

export const initWebview = () => {
  if (typeof window === 'undefined') {
    return;
  }
  if (!window.webviewEvents) {
    window.webviewEvents = {};
  }
  if (!window.webviewEmit) {
    window.webviewEmit = (event, params) => {
      if (!window.webviewEvents?.[event]) {
        return;
      }
      window.webviewEvents[event]?.forEach((cb) => {
        cb(params);
      });
    };
  }
  if (!window.webviewOn) {
    window.webviewOn = (event, cb) => {
      if (!window.webviewEvents) {
        window.webviewEvents = {};
      }
      if (!window.webviewEvents?.[event]) {
        window.webviewEvents[event] = [];
      }
      window.webviewEvents[event]?.push(cb);
    };
  }
  if (!window.webviewOff) {
    window.webviewOff = (event, cb) => {
      if (!window.webviewEvents?.[event]) {
        return;
      }
      if (!cb) {
        window.webviewEvents[event] = [];
        return;
      }
      const index = window.webviewEvents[event]?.findIndex((item) => item === cb) ?? -1;
      if (index > -1) {
        window.webviewEvents[event]?.splice(index, 1);
      }
    };
  }
};

/**
 */
export const clientApi = (apiName: string, params?: string | object) => {
  if (!inTapClient()) {
    return;
  }

  const serializedParams = typeof params === 'object' ? JSON.stringify(params) : params;

  try {
    if (isAndroid(navigator.userAgent) && window.urlResource?.TapTapAPI) {
      return window.urlResource?.TapTapAPI(apiName, serializedParams);
    }

    if (window?.TapTapAPI?.[apiName]) {
      return window?.TapTapAPI?.[apiName](serializedParams);
    }
    return window?.TapTapAPI?.(apiName, serializedParams);
  } catch (e) {
    console.error(`[clientApi] ${apiName} failed:`, e);
  }
};

export const callAsyncClientApi = (apiName: string, params: object, eventName: string) => {
  const deffer: any = {};
  deffer.promise = new Promise((resolve, reject) => {
    deffer.resolve = resolve;
    deffer.reject = reject;
  });

  if (!hasTapClientApi(apiName)) {
    deffer.reject({ isSupport: false, message: `${apiName} is nonsupport` });
  } else {
    const event_id = uuidv4();
    const cb = (json: string) => {
      try {
        const data = JSON.parse(json);
        if (!data.event_id || event_id === data.event_id) {
          deffer.resolve(data);
        }
      } catch (e) {
        console.error(e);
        deffer.reject(e);
      } finally {
        window.webviewOff?.(eventName, cb);
      }
    };

    window.webviewOn?.(eventName, cb);
    clientApi(apiName, { ...params, event_id });
  }

  return deffer.promise;
};

export function hasTapClientApi(apiName: string): boolean {
  try {
    const actionList = JSON.parse(clientApi('actionList'));
    return actionList.includes(apiName);
  } catch {
    return false;
  }
};

export const getClientVersion = (): string => {
  let version = '0';
  if (!inTapClient()) {
    return version;
  }
  try {
    const clientXUA = clientApi('getClientXUA');
    if (!clientXUA) {
      return version;
    }
    const VN = parse(clientXUA).VN_CODE;
    if (VN && typeof VN === 'string') {
      version = VN;
    }
  } catch {}
  return version;
};

/**
 * @description
 */
export const getClientPrefix = (isIntl = false) => {
  return isIntl ? 'tapglobal://taptap.tw' : 'taptap://taptap.com';
};

const getTapClientPN = () => {
  if (!inTapClient()) {
    return '';
  }
  try {
    const tapEnv = JSON.parse(clientApi('tapEnv'));
    const PN = tapEnv?.PN;
    return typeof PN === 'string' ? PN.toLowerCase() : '';
  } catch {}
  return '';
};

export const inWinTapPC = () => {
  return getTapClientPN() === 'tappc';
};

export const inMacTapPC = () => {
  return getTapClientPN() === 'tapmac';
};

export const inTapPC = () => {
  return inWinTapPC() || inMacTapPC();
};
export const inTapMiniGame = (): boolean => {
  if (!inTapClient()) {
    return false;
  }
  try {
    const tapEnv = JSON.parse(clientApi('tapEnv'));
    return tapEnv.IS_IN_INSTANT_GAME;
  } catch {}
  return false;
};
