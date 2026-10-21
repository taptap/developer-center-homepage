// @ts-nocheck -- vendored utility code; upstream type declarations are not available here
import { tapStorage } from './dom/storage';
import type { StorageValue } from './dom/storage';
import { isAndroid, isiOS } from './browser';
interface ModelSupportedPlatform {
  key?: string;
  released_time?: number;
}

export enum Platform {
  Android = 'android',
  iOS = 'ios',
  Pc = 'pc',
  Steam = 'steam',
  Psn = 'psn',
  Epic = 'epic',
  Xbox = 'xbox',
  Ps = 'ps',
}

export type DataSource = 'Android' | 'iOS' | 'PC' | 'Steam' | 'PSN' | 'Epic' | 'Xbox' | 'Ps';

export const DataSourceMap: Record<Platform, DataSource> = {
  [Platform.Android]: 'Android',
  [Platform.iOS]: 'iOS',
  [Platform.Pc]: 'PC',
  [Platform.Steam]: 'Steam',
  [Platform.Psn]: 'PSN',
  [Platform.Epic]: 'Epic',
  [Platform.Xbox]: 'Xbox',
  [Platform.Ps]: 'Ps',
} as const;

export const getSupportedConsolePlatform = (supportedPlatforms: ModelSupportedPlatform[]) => {
  return supportedPlatforms?.find(
    (platform) => platform.key !== Platform.Android.toLowerCase() && platform.key !== Platform.iOS.toLowerCase(),
  )?.key as Platform;
};

export const isConsoleGame = (platform: Platform) => {
  return platform !== Platform.Android && platform !== Platform.iOS;
};

const DataSourceKey = 'currentDataSource';

export function getDataSource(options?: {
  ua?: string;
  localStorageGet?: (key: string) => StorageValue;
  cookieGet?: (key: string) => string | undefined | null;
  queryOs?: string;
}): DataSource {
  const ds = getDataSourceByQuery(options?.queryOs);
  if (ds) {
    return ds;
  }

  options = options || {};

  if (typeof window !== 'undefined' && typeof window.navigator !== 'undefined') {
    if (!options.ua) {
      options.ua = window.navigator.userAgent;
    }
    if (typeof options.localStorageGet !== 'function') {
      options.localStorageGet = (key) => tapStorage.get(key);
    }
  }

  if (options.cookieGet?.(DataSourceKey) === 'iOS') {
    return 'iOS';
  }
  if (options.cookieGet?.(DataSourceKey) === 'Android') {
    return 'Android';
  }

  if (options.localStorageGet?.(DataSourceKey) === 'iOS') {
    return 'iOS';
  }
  if (options.localStorageGet?.(DataSourceKey) === 'Android') {
    return 'Android';
  }

  if (isiOS(options.ua || '')) {
    return 'iOS';
  }
  return 'Android';
}

export function setDataSource(
  dataSource: DataSource,
  options: {
    localStorageSet?: (key: string, value: string) => void;
    cookieSet: (key: string, value: string) => void;
  },
) {
  if (!['iOS', 'Android'].includes(dataSource)) {
    throw new Error('Invalid data source');
  }
  options.cookieSet(DataSourceKey, dataSource);
  options.localStorageSet?.(DataSourceKey, dataSource);
  return dataSource;
}

/**
 * @see
 */
export function getDefaultAppButtonDataSource(options?: {
  ua?: string;
  localStorageGet?: (key: string) => StorageValue;
  cookieGet?: (key: string) => string | undefined | null;
  queryOs?: string;
}): DataSource {
  options = options || {};

  if (typeof window !== 'undefined' && typeof window.navigator !== 'undefined') {
    if (!options.ua) {
      options.ua = window.navigator.userAgent;
    }
  }

  if (isAndroid(options.ua || '')) {
    return 'Android';
  }
  if (isiOS(options.ua || '')) {
    return 'iOS';
  }
  return getDataSource(options);
}

/**
 */
export function getDataSourceByQuery(queryOs?: string): DataSource | undefined {
  let os = queryOs;
  if (!os && typeof window !== 'undefined' && window.location && window.location.search) {
    const params = new URLSearchParams(window.location.search);

    os = params.get('os') as string;
  }
  const ds = Object.values(Platform).find((p) => p.toLowerCase() === os?.toLowerCase());
  if (ds) {
    return DataSourceMap[ds];
  }
  return undefined;
}
