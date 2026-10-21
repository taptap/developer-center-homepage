// @ts-nocheck -- vendored utility code; upstream type declarations are not available here
//
import { deviceModel, Honor, HuaWei } from './config/device-model';
import {
  AndroidSDK,
  brandBrowser,
  Bytedance,
  iOSSDK,
  MobileQQ,
  Opera,
  QQBrowser,
  Shoujibaidu,
  TapSDK,
  Weibo,
} from './config/brand-browser';
import { Chrome, fallbackBrowser, Firefox } from './config/fallback-browser';
import { nativeBrowser } from './config/native-browser';
import { inTapClient } from '../in-tap-client';

interface Request {
  get: (name: string) => string | undefined;
}

const UA = (exp: RegExp, ua: string): boolean => {
  return exp.test(ua);
};

export const isAndroid = (ua: string) => UA(/android/i, ua);
export const isiOS = (ua: string) => UA(/iPhone|iPad|iPod/i, ua);
export const isWindows = (ua: string) => UA(/windows/i, ua);
export const isPad = (ua: string) => UA(/iPad/i, ua);
export const isIPad = (ua: string) =>
  UA(/iPad/i, ua) || (UA(/Macintosh/i, ua) && typeof window !== 'undefined' && typeof window.navigator !== 'undefined' && window.navigator.maxTouchPoints > 1);
export const isMac = (ua: string) =>
  !!ua
  && UA(/Macintosh/i, ua)
  && !isIPad(ua);
export const isMobileDevice = (ua: string) => /(mobi|mzbrowser)/i.test(ua);
export const isTouchDevice = () => typeof window !== 'undefined' && typeof window.navigator !== 'undefined' && window.navigator.maxTouchPoints > 1;
export const isMobileOS = (ua: string) => isAndroid(ua) || isiOS(ua);
export const isMobile = (ua: string) => !isPad(ua) && (isMobileDevice(ua) || isMobileOS(ua));
export const isIphone = (ua: string) => UA(/iPhone/i, ua);
export const isWeb = (ua: string) => !isMobile(ua);
export const isWechat = (ua: string) => UA(/MicroMessenger/i, ua) || UA(/WindowsWechat/i, ua) || UA(/wxwork/i, ua);
export const isAlipay = (ua: string) => UA(/AlipayClient/i, ua);
export const isPC = (ua: string) => !isMobile(ua) && !isPad(ua);
export const getPlatform = (ua?: string): 'web' | 'Android' | 'iOS' => {
  if (ua && typeof ua === 'string') {
    if (isAndroid(ua)) {
      return 'Android';
    } else if (isiOS(ua)) {
      return 'iOS';
    }
    return 'web';
  }
  if (!ua) {
    if (typeof window !== 'undefined' && typeof window.navigator !== 'undefined') {
      if (
        typeof window.navigator.userAgentData !== 'undefined'
        && window.navigator.userAgentData
        && window.navigator.userAgentData.platform
      ) {
        const { platform } = window.navigator.userAgentData;
        return getPlatform(platform);
      } else if (window.navigator.userAgent && typeof window.navigator.userAgent === 'string') {
        return getPlatform(window.navigator.userAgent);
      }
    }
  }
  return 'web';
};

export function isHuaWeiNativeBrowser(ua: string): boolean {
  if (
    UA(HuaWei, ua)
    || (UA(Honor, ua)
      && !UA(QQBrowser, ua)
      && !UA(Opera, ua)
      && !UA(Chrome, ua)
      && !UA(Firefox, ua)
      && !UA(Shoujibaidu, ua))
  ) {
    return true;
  }
  return false;
}

export function isChromeBrowser(ua: string): boolean {
  return (window as any).chrome || (isiOS(ua) && UA(Chrome, ua));
}

export function isTapSDK(ua: string): boolean;
export function isTapSDK(request: Request): boolean;
export function isTapSDK(request: string | Request): boolean {
  let ua: string = '';
  if (!request) {
    return false;
  }
  if (typeof request === 'string') {
    ua = request;
  }
  if (typeof request === 'object' && request?.get && typeof request.get === 'function') {
    if (request.get('x-sdk-ua') || request.get('x-tap-sdk-ua')) {
      return true;
    }
    ua = request.get('User-Agent') || '';
  }
  return UA(AndroidSDK, ua) || UA(iOSSDK, ua) || UA(TapSDK, ua);
}

export function isMobileQQ(ua: string): boolean {
  return UA(MobileQQ, ua);
}

export function isWeibo(ua: string): boolean {
  return UA(Weibo, ua);
}

export function isTapClient(request?: Request): boolean {
  return Boolean((request?.get('x-ua') || '').startsWith('V'));
}

export function isTapClientOrTapSDK(request: Request): boolean {
  return isTapSDK(request) || isTapClient(request);
}

export function isBot(ua: string): boolean {
  return UA(
    /(jiankongbao|bot(\b|\d)|spider|googlebot|yahoo|bingbot|baiduspider|yandex|yeti|yodaobot|gigabot|ia_archiver|facebookexternalhit|twitterbot|developers\.google\.com)/i,
    ua,
  );
}

export function isBytedance(ua: string): boolean {
  return UA(Bytedance, ua);
}

export function getIOSVersion(ua: string) {
  const agent = ua || window?.navigator?.userAgent || '';
  const start = agent.indexOf('OS ');
  if ((agent.includes('iPhone') || agent.includes('iPad')) && start > -1) {
    return window.Number(agent.substr(start + 3, 3).replace('_', '.'));
  }
  return 0;
}

export function getOperatingPlatform(ua: string) {
  const isApple = UA(/(iPod|iPad|iPhone)/i, ua);
  const isHuawei = UA(
    /huawei|(Huawei[\s-_](\w*[-_]?\w*)|\s(7D-\w*|ALE-\w*|ATH-\w*|CHE-\w*|CHM-\w*|Che1-\w*|Che2-\w*|D2-\w*|G616-\w*|G620S-\w*|G621-\w*|G660-\w*|G750-\w*|GRA-\w*|Hol-\w*|MT2-\w*|MT7-\w*|PE-\w*|PLK-\w*|SC-\w*|SCL-\w*|H60-\w*|H30-\w*)[\s)])/i,
    ua,
  );
  const isHonor = UA(/honor/i, ua);
  const isOppo = UA(
    /oppo|(Oppo[\s-_](\w*)|\s(1100|1105|1107|3000|3005|3007|6607|A100|A103|A105|A105K|A109|A109K|A11|A113|A115|A115K|A121|A125|A127|A129|A201|A203|A209|A31|A31c|A31t|A31u|A51kc|A520|A613|A615|A617|E21W|Find|Mirror|N5110|N5117|N5207|N5209|R2010|R2017|R6007|R7005|R7007|R7c|R7t|R8000|R8007|R801|R805|R807|R809T|R8107|R8109|R811|R811W|R813T|R815T|R815W|R817|R819T|R8200|R8205|R8207|R821T|R823T|R827T|R830|R830S|R831S|R831T|R833T|R850|Real|T703|U2S|U521|U525|U529|U539|U701|U701T|U705T|U705W|X9000|X9007|X903|X905|X9070|X9077|X909|Z101|R829T)[\s)])/i,
    ua,
  );
  const isOppoR15 = UA(/pacm00/i, ua);
  const isVivo = UA(
    /(vivo[\s-_](\w*)|\s(E1\w?|E3\w?|E5\w?|V1\w?|V2\w?|S11\w?|S12\w?|S1\w?|S3\w?|S6\w?|S7\w?|S9\w?|X1\w?|X3\w?|X520\w?|X5\w?|X5Max|X5Max+|X5Pro|X5SL|X710F|X710L|Xplay|Xshot|Xpaly3S|Y11\w?|Y11i\w?|Y11i\w?|Y13\w?|Y15\w?|Y17\w?|Y18\w?|Y19\w?|Y1\w?|Y20\w?|Y22\w?|Y22i\w?|Y23\w?|Y27\w?|Y28\w?|Y29\w?|Y33\w?|Y37\w?|Y3\w?|Y613\w?|Y622\w?|Y627\w?|Y913\w?|Y923\w?|Y927\w?|Y928\w?|Y929\w?|Y937\w?)[\s)])/i,
    ua,
  );
  const isXiaomi = UA(/;\s(mi|m1|m2|m3|m4|hm)(\s*\w*)[\s)]/i, ua);
  const isRedmi = UA(/redmi|build\/HM\d{0,7}|redmi\s?(\d+)?/i, ua);
  const isSamsung = UA(
    /[-\s](Galaxy[\s-_]nexus|Galaxy[\s-_]\w*[\s-_]\w*|Galaxy[\s-_]\w*|SM-\w*|GT-\w*|s[cgp]h-\w*|shw-\w*|ATIV|i9070|omnia|s7568|A3000|A3009|A5000|A5009|A7000|A7009|A8000|C101|C1116|C1158|E400|E500F|E7000|E7009|G3139D|G3502|G3502i|G3508|G3508J|G3508i|G3509|G3509i|G3558|G3559|G3568V|G3586V|G3589W|G3606|G3608|G3609|G3812|G388F|G5108|G5108Q|G5109|G5306W|G5308W|G5309W|G550|G600|G7106|G7108|G7108V|G7109|G7200|G720NO|G7508Q|G7509|G8508S|G8509V|G9006V|G9006W|G9008V|G9008W|G9009D|G9009W|G9198|G9200|G9208|G9209|G9250|G9280|I535|I679|I739|I8190N|I8262|I879|I879E|I889|I9000|I9060|I9082|I9082C|I9082i|I9100|I9100G|I9108|I9128|I9128E|I9128i|I9152|I9152P|I9158|I9158P|I9158V|I9168|I9168i|I9190|I9192|I9195|I9195I|I9200|I9208|I9220|I9228|I9260|I9268|I9300|I9300i|I9305|I9308|I9308i|I939|I939D|I939i|I9500|I9502|I9505|I9507V|I9508|I9508V|I959|J100|J110|J5008|J7008|N7100|N7102|N7105|N7108|N7108D|N719|N750|N7505|N7506V|N7508V|N7509V|N900|N9002|N9005|N9006|N9008|N9008S|N9008V|N9009|N9100|N9106W|N9108V|N9109W|N9150|N916|N9200|P709|P709E|P729|S6358|S7278|S7278U|S7562C|S7562i|S7898i|b9388)[\s)]/i,
    ua,
  );
  const isCoolpad = UA(/(Coolpad[\s-_](\w*)|\s(7295C|7298A|7620L|8908|8085|8970L|9190L|Y80D)[\s)])/i, ua);
  const isMeizu = UA(/\s(mx\d*\w*|mz-(\w*))\s(\w*)\s*\w*\s*build|M463C|M35\d/i, ua);
  const isHarmonyOS = /HarmonyOS/i.test(ua);

  if (isApple) {
    return 'iOS';
  } else if (isHarmonyOS) {
    return 'HarmonyOS';
  } else if (isHuawei || isHonor) {
    return 'Huawei';
  } else if (isOppo || isOppoR15) {
    return 'OPPO';
  } else if (isVivo) {
    return 'VIVO';
  } else if (isXiaomi || isRedmi) {
    return 'Xiaomi';
  } else if (isSamsung) {
    return 'Samsung';
  } else if (isCoolpad) {
    return 'Coolpad';
  } else if (isMeizu) {
    return 'Meizu';
  } else {
    return 'Other';
  }
}
export function isStandalone() {
  if (typeof window !== 'undefined' && typeof window.matchMedia === 'function') {
    return (typeof window.navigator !== 'undefined' && window.navigator?.standalone === true)
      || window.matchMedia('(display-mode: standalone)').matches;
  }
  return false;
}

export function is(
  device:
    | keyof typeof brandBrowser
    | keyof typeof nativeBrowser
    | keyof typeof fallbackBrowser
    | keyof typeof deviceModel,
  ua: string,
): boolean {
  let i;
  const browsers = {
    ...brandBrowser,
    ...nativeBrowser,
    ...fallbackBrowser,
  };
  for (i in browsers) {
    if (typeof device === 'string' && i.toLowerCase() === device?.toLowerCase()) {
      return browsers[i]!.test(ua);
    }
  }
  for (i in deviceModel) {
    if (typeof device === 'string' && i.toLowerCase() === device?.toLowerCase()) {
      return deviceModel[i]!.test(ua);
    }
  }
  throw new Error(`Unknown browser value -- ${device}`);
}

export function getBrowserByStaticUA(userAgent: string) {
  const browsers = {
    ...brandBrowser,
    ...nativeBrowser,
    ...fallbackBrowser,
  };
  for (const i in browsers) {
    if (browsers[i]!.test(userAgent)) {
      return i;
    }
  }
  return null;
}

export function getBrowser(
  navigator: typeof window.navigator,
): keyof typeof brandBrowser | keyof typeof nativeBrowser | keyof typeof fallbackBrowser | null {
  const browsers = {
    ...brandBrowser,
    ...nativeBrowser,
    ...fallbackBrowser,
  };
  let browser = null;
  const userAgentData = navigator.userAgentData;
  if (userAgentData) {
    userAgentData.brands.some(({ brand }) => {
      for (const i in brandBrowser) {
        if (browsers[i]!.test(brand)) {
          browser = i;
          return true;
        }
      }
      return false;
    });
  }
  if (!browser) {
    browser = getBrowserByStaticUA(navigator.userAgent);
  }
  return browser;
}

export function getBrowserName(navigator: typeof window.navigator) {
  if (inTapClient()) {
    return 'InApp';
  }
  if (getBrowser(navigator)) {
    return getBrowser(navigator);
  }
  return 'Other';
}

/**
 */
export function isLowPixelDevice() {
  if (typeof window === 'undefined') {
    return false;
  }
  if (typeof window?.screen?.width !== 'number' || window?.screen?.height <= 320) {
    return true;
  }
  if (typeof window?.screen?.height !== 'number' || window?.screen?.height <= 320) {
    return true;
  }
  if (
    (typeof window?.devicePixelRatio !== 'number' || window?.devicePixelRatio < 2)
    && typeof window.navigator !== 'undefined'
    && isMobile(window.navigator.userAgent)
  ) {
    return true;
  }
  return false;
}
