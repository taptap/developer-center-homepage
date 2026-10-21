// @ts-nocheck -- vendored utility code; upstream type declarations are not available here
import { Cookie } from './dom/cookie';
import { clientApi, initWebview } from './client';
import { inTapClient } from './in-tap-client';
import { throttle } from './tap-lodash';

interface AuthCertificateResponse {
  client_id: string;
  state: string;
}

type GetRequestFunction = <T = any>(url: string) => Promise<T>;

interface SyncClientAuthOptions {
  /**
   */
  requestGet: GetRequestFunction;
  /**
   * @default false
   */
  isForceLogin?: boolean;
}

const USER_ID_COOKIE = 'user_id';
const API_FIRST_PARTY_LOGIN = '/webapiv2/auth/v1/callback-first-party';
const API_GET_LOGIN_CERTIFICATE = '/webapiv2/auth/v1/login';

export const getUserId = () => {
  return Cookie.get(USER_ID_COOKIE);
};

export const setUserId = (userId: string) => {
  Cookie.set(USER_ID_COOKIE, userId);
};

export const clearUserId = () => {
  Cookie.remove(USER_ID_COOKIE);
};

/**
 * @returns boolean
 */
export const isClientLogined = (): boolean => {
  return inTapClient() && clientApi('getClientLoginState') === '1';
};

/**
 */
const loginWithCertificateSuccess = (options: SyncClientAuthOptions): Promise<boolean> => {
  if (!window.webviewOff) {
    initWebview();
  }

  return new Promise((resolve) => {
    options
      .requestGet<AuthCertificateResponse>(API_GET_LOGIN_CERTIFICATE)
      .then((res: AuthCertificateResponse) => {
        clientApi('getLoginCertificate', {
          client_id: res?.client_id,
          state: res?.state,
        });
      })
      .catch((e: unknown) => {
        console.warn('getLoginCertificate error', e);
        resolve(false);
      });

    window.webviewOff?.('getLoginCertificateSuccess');
    window.webviewOn!('getLoginCertificateSuccess', async (res: string) => {
      try {
        const resData = JSON.parse(res);
        await options.requestGet(API_FIRST_PARTY_LOGIN + `?code=${resData?.code}&state=${resData?.state}`);
        resolve(true);
      } catch (e) {
        console.warn('callbackFirstParty error', e);
        resolve(false);
      }
    });
  });
};

/**
 *
 * @param options
 */
const syncClientAuth = async (options: SyncClientAuthOptions): Promise<boolean> => {
  if (!inTapClient()) {
    return false;
  }

  if (isClientLogined()) {
    return await loginWithCertificateSuccess(options);
  }

  if (options?.isForceLogin) {
    return await loginWithCertificateSuccess(options);
  }

  return false;
};

export const syncClientLoginState: (options: SyncClientAuthOptions) => Promise<boolean> = throttle(syncClientAuth, 500);

export const goToLogin = async (options: SyncClientAuthOptions) => {
  if (inTapClient()) {
    return await syncClientLoginState({
      ...options,
      isForceLogin: true,
    });
  } else {
    window.location.href = '/auth/login';
  }
};
