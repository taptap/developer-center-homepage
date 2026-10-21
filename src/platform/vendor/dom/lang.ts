// @ts-nocheck -- vendored utility code; upstream type declarations are not available here
import { clientApi } from '../client';
import { inTapClient } from '../in-tap-client';
import { parse } from '../query-string';
import { Cookie } from './cookie';

interface LangConfig {
  locale: string;
  lang: string;
  regExp: RegExp;
  cookieRegion: string;
  name: string;
  cn: boolean;
  intl: boolean;
  hreflang: string;
}

interface LangParams {
  useSystemSetting: boolean;
  disableLocaleCookie: boolean;
  isIntl: boolean;
}

export const langConfigs: LangConfig[] = [
  {
    locale: 'zh_CN',
    lang: 'zh_CN',
    regExp: /(^zh[-_]CN|^zh[-_]Hans|^zh$)/i,
    cookieRegion: 'CN',
    name: '中文 (简体)',
    cn: true,
    intl: false,
    hreflang: 'zh-CN',
  },
  {
    locale: 'zh_TW',
    lang: 'zh_TW',
    regExp: /(^zh[-_]HK|^zh[-_]TW|^zh[-_]Hant)/i,
    cookieRegion: 'TW',
    name: '中文 (繁體)',
    cn: false,
    intl: true,
    hreflang: 'zh-TW',
  },
  {
    locale: 'en',
    lang: 'en_US',
    regExp: /^en/i,
    cookieRegion: 'US',
    name: 'English',
    cn: true,
    intl: true,
    hreflang: 'en-US',
  },
  {
    locale: 'ja',
    lang: 'ja_JP',
    regExp: /^ja/i,
    cookieRegion: 'JP',
    name: '日本語',
    cn: false,
    intl: true,
    hreflang: 'ja-JP',
  },
  {
    locale: 'ko',
    lang: 'ko_KR',
    regExp: /^ko/i,
    cookieRegion: 'KR',
    name: '한국어',
    cn: false,
    intl: true,
    hreflang: 'ko-KR',
  },
  {
    locale: 'th',
    lang: 'th_TH',
    regExp: /^th/i,
    cookieRegion: 'TH',
    name: 'ภาษาไทย',
    cn: false,
    intl: true,
    hreflang: 'th-TH',
  },
  {
    locale: 'id',
    lang: 'id_ID',
    regExp: /^id/i,
    cookieRegion: 'ID',
    name: 'Bahasa Indonesia',
    cn: false,
    intl: true,
    hreflang: 'id-ID',
  },
];

const getLanguages = (isIntl: boolean = false) => {
  return langConfigs.filter((lang) => (isIntl ? lang.intl : lang.cn));
};

const getLangConfigByLanguage = (language: string, isIntl: boolean = false) => {
  return getLanguages(isIntl).find((config) => {
    let { regExp, locale } = config;
    if (isIntl && locale === 'zh_TW') {
      regExp = /^zh/i;
      return regExp.test(language);
    }
    return regExp.test(language);
  });
};

const getLangConfigByRegion = (region: string, isIntl = false) => {
  return getLanguages(isIntl).find((language) => language.cookieRegion === region);
};

export function fallbackLanguage(isIntl = false) {
  const fallbackLocale = isIntl ? 'en' : 'zh_CN';
  return langConfigs.find((language) => language.locale === fallbackLocale) as LangConfig;
}

const getLangConfig = (params?: boolean | LangParams) => {
  let useSystemSetting = false;
  let disableLocaleCookie = false;
  let isIntl = false;

  if (typeof params === 'boolean') {
    useSystemSetting = params;
  } else if (params && typeof params === 'object') {
    useSystemSetting = params?.useSystemSetting ?? false;
    disableLocaleCookie = params?.disableLocaleCookie ?? false;
    isIntl = params?.isIntl ?? false;
  }

  if (!isIntl) {
    return getLanguages().find((language) => language.lang === 'zh_CN');
  }

  if (typeof window === 'undefined') {
    return fallbackLanguage(isIntl);
  }

  if (inTapClient()) {
    try {
      const tapEnvStr = clientApi('tapEnv');
      if (tapEnvStr && typeof tapEnvStr === 'string') {
        const tapEnv = JSON.parse(tapEnvStr);
        const clientLang = tapEnv?.LANG;
        const language = getLanguages(isIntl).find((language) => language.lang.includes(clientLang));
        if (language) {
          return language;
        }
      }
    } catch (error) {
      console.error('getLangConfig error', error);
      if (error instanceof SyntaxError) {
        throw error;
      }
    }
  }

  const queryParams = parse(location.search || '');
  const hreflang = queryParams?.hreflang;
  if (hreflang) {
    const langConfig = getLangConfigByLanguage(hreflang, isIntl);
    if (langConfig) {
      return langConfig;
    }
  }

  const cookieRegion = Cookie.get('region');
  if (cookieRegion) {
    const language = getLangConfigByRegion(cookieRegion, isIntl);
    if (language) {
      return language;
    }
  }

  const cookieLocale = Cookie.get('locale');
  if (cookieLocale && !disableLocaleCookie) {
    const language = getLanguages(isIntl).find((language) => language.lang === cookieLocale);
    if (language) {
      return language;
    }
  }

  if (typeof window !== 'undefined' && typeof window.navigator !== 'undefined') {
    const language = getLangConfigByLanguage(window.navigator.language, isIntl);
    if (language) {
      return language;
    }
    if (useSystemSetting && window.navigator.language) {
      return {
        locale: undefined,
        lang: window.navigator.language,
      };
    }
  }

  return fallbackLanguage(isIntl);
};

/**
 */
export function getLang(params?: boolean | LangParams) {
  return getLangConfig(params)?.lang;
}

/**
 */
export function getLocale(params?: boolean | LangParams) {
  return getLangConfig(params)?.locale || '';
}
