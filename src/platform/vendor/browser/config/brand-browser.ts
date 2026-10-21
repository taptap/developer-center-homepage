// @ts-nocheck -- vendored utility code; upstream type declarations are not available here
export const iOSSDK = /TapTapiOSSDK/i;
export const AndroidSDK = /TapTapAndroidSDK/i;
export const TapSDK = /TapSDK[-/]/i;
export const Sogou = /SE\s2\.X|SogouMobileBrowser/i;
export const Explorer2345 = /2345Explorer|2345chrome|Mb2345Browser/i;
export const Liebao = /LBBROWSER|LieBaoFast/i;
export const WindowsWechat = /WindowsWechat/i;
export const Wechat = /MicroMessenger/i;
export const WxWork = /wxwork/i;
export const QQBrowser = /MQQBrowser|QQBrowser/i;
export const Baidu = /BIDUBrowser|baidubrowser|BaiduHD/i;
export const UC = /UBrowser|UCBrowser|UCWEB/i;
export const MobileQQ = /Mobile.*QQ\/\d+(?:\.\d+)+|MQQBrowser.*QQ|QQ.*MQQBrowser/i;
export const Shoujibaidu = /baiduboxapp/i;
export const Kuaishou = /(Kwai|AllowKsCallApp)/i;
// Gear VR
export const OculusBrowser = /OculusBrowser/i;
export const SamsungBrowser = /samsungbrowser|SamsungBrowser/i;
export const Maxthon = /Maxthon/i;
export const Se360 = /360SE/i;
export const Ee360 = /360EE/i;
export const Browser360 = /\bqihu|(qi?ho?o?|360)browser/i;
export const TheWorld = /TheWorld/i;
export const WeiboIntl = /WeiboIntl/i;
export const Weibo = /__weibo__/i;
export const NokiaBrowser = /NokiaBrowser/i;
export const Opera = /Opera|OPR\/(\d+[.\d]+)/i;
export const Edge = /edg(?:e|ios|a)?\/([\w.]+)/i;
export const QQLive = /QQLive(HD)?Browser/i;
export const Letv = /LetvClient/i;
export const Youku = /Youku/i;
export const IE = /Trident|MSIE/i;
export const TouTiao = /NewsArticle/i;
export const mobileLenovoBrowser = /MobileLenovoBrowser/i;
export const emulator = /qmzs$/i;
export const BaiduSpider = /Baiduspider/i;
export const YisouSpider = /YisouSpider/i;
export const Quark = /Quark\//i;
export const CoolMarket = /CoolMarket/i;
export const Tieba = /tieba/i;
export const Zhihu_android = /ZhihuHybrid|zhihu/i;
export const Bytedance = /BytedanceWebview|ByteLocale/i;
export const Vivaldi = /Vivaldi/i;
export const PPhongbao = /PPhongbao/i;
export const Facebook = /(?:FBAN\/|FB_IAB)/i;
export const Instagram = /instagram/i;
export const Tesla = /tesla/i;
export const Kindle = /kindle/i;
export const Line = /line\//i;
export const miHoYoBBS = /miHoYoBBS/i;

export const brandBrowser: Record<string, RegExp> = {
  iOSSDK,
  AndroidSDK,
  TapSDK,
  Sogou,
  Explorer2345,
  Liebao,
  WindowsWechat,
  Wechat,
  WxWork,
  QQBrowser,
  Baidu,
  UC,
  MobileQQ,
  Shoujibaidu,
  Kuaishou,
  // Gear VR
  OculusBrowser,
  SamsungBrowser,
  Maxthon,
  Se360,
  Ee360,
  Browser360,
  TheWorld,
  WeiboIntl,
  Weibo,
  NokiaBrowser,
  Opera,
  Edge,
  QQLive,
  Letv,
  Youku,
  IE,
  TouTiao,
  mobileLenovoBrowser,
  emulator,
  BaiduSpider,
  YisouSpider,
  Quark,
  CoolMarket,
  Tieba,
  Zhihu_android,
  Bytedance,
  Vivaldi,
  PPhongbao,
  Facebook,
  Instagram,
  Tesla,
  Kindle,
  Line,
  miHoYoBBS,
};

export function isBrand(ua: string): boolean {
  return Object.keys(brandBrowser).some((key) => {
    return brandBrowser[key]?.test(ua) || false;
  });
}
