// @ts-nocheck -- vendored utility code; upstream type declarations are not available here
import { getUserId } from './auth';
import { stringify } from './query-string';
import { getUUID } from './uuid-browser';
import { getLang } from './dom/lang';
import { getPlatform, isBot } from './browser';
import { getOS } from './os';
import { getDataSource } from './data-source';
import { normalizeOSName } from './os/normalize-os-name';

export interface Options {
  /**
   */
  projectName: string;
  /**
   */
  version: string;
  /**
   */
  userId?: string;
  /**
   */
  lang?: string;
  /**
   */
  dataSource?: string;
  /**
   */
  custom?: Record<string, string>;
  /**
   */
  uuid?: string;
  /**
   */
  userAgent?: string;
};

/**
 * @see
 */
export function toVersionCode(version: string): string {
  const rawVersion = String(version ?? '');
  let suffixIndex = -1;
  for (let index = 0; index < rawVersion.length; index += 1) {
    if (rawVersion[index] === '-' || rawVersion[index] === '+') {
      suffixIndex = index;
      break;
    }
  }
  const segments = (suffixIndex >= 0 ? rawVersion.slice(0, suffixIndex) : rawVersion)
    .split('.')
    .map((segment) => {
      const parsed = Number.parseInt(segment, 10);
      return Number.isFinite(parsed) ? parsed : 0;
    });
  const [major = 0, minor = 0, patch = 0] = segments;
  return ((major * 10000 + minor * 100 + patch) * 10000).toString();
}

/**
 */
export function getXUA(options: Options) {
  let userAgent: string = options?.userAgent || '';
  let dataSource: string = options?.dataSource || '';
  let userId: string | undefined = options?.userId;
  let uuid: string = options?.uuid || '';
  const lang: string = options?.lang || getLang(true) || '';
  if (typeof window !== 'undefined' && typeof window.navigator !== 'undefined') {
    if (!userAgent) {
      userAgent = window.navigator.userAgent;
    }
    if (!dataSource) {
      dataSource = getDataSource();
    }
    if (!userId) {
      userId = getUserId();
    }
    if (!uuid) {
      uuid = getUUID();
    }
  }
  const { name: OS, version: OSV } = getOS(userAgent);
  const normOS = normalizeOSName(OS || '');
  let platform: string = getPlatform(userAgent);
  if (platform === 'web') {
    platform = 'PC';
  }
  const XUA: Record<string, string> = {
    V: '1',
    PN: options?.projectName || '',
    LANG: lang,
    VN_CODE: options?.version || '',
    LOC: 'CN',
    PLT: platform,
    DS: dataSource,
    UID: uuid,
    ...options?.custom || {},
  };

  if (OS) {
    XUA.OS = normOS;
    if (OSV) {
      XUA.OSV = OSV;
    }
  }
  if (userId) {
    XUA.VID = userId;
  }
  if (platform === 'PC') {
    XUA.DT = 'PC';
  }
  if (isBot(userAgent)) {
    XUA.BOT = 'bot';
  }
  return stringify(XUA);
}
