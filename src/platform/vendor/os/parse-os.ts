// @ts-nocheck -- vendored utility code; upstream type declarations are not available here
import { BLACKBERRY, CHROME, FIREFOX, NAME, OPENHARMONY, SPIDER, VERSION, windowsVersionMap } from './constants';
import { rgxMapper, strMapper } from './map-helper';

const OS_REG = [
  [
    /Spider/i,
    /^[a-zA-Z0-9]+$/,
  ],
  [[NAME, SPIDER]],
  [/OpenHarmony[\/ ]?([\d\.]*)/i],
  [[NAME, OPENHARMONY]],
  [
    // Windows
    /microsoft (windows) (vista|xp)/i, // Windows (iTunes)
  ],
  [NAME, VERSION],
  [
    /(windows) nt 6\.2; (arm)/i, // Windows RT
    /(windows (?:phone(?: os)?|mobile))[\/ ]?([\d\.\w ]*)/i, // Windows Phone
    /(windows)[\/ ]?([ntce\d\. ]+\w)(?!.+xbox)/i,
    /Windows.*MicroMessenger.*WindowsWechat/i,
    /Windows NT (10\.0|6\.[1-3]|5\.[1-2]).*MicroMessenger.*WindowsWechat/i,
  ],
  [NAME, [VERSION, strMapper, windowsVersionMap]],
  [/(win(?=3|9|n)|win 9x )([nt\d\.]+)/i],
  [
    [NAME, 'Windows'],
    [VERSION, strMapper, windowsVersionMap],
  ],
  [
    // iOS/macOS
    /ip[honead]{2,4}\b(?:.*os ([\w]+) like mac|; opera)/i, // iOS
    /cfnetwork\/.+darwin/i,
    /\(iPad\).*MicroMessenger\/(\d+\.\d+)/i,
    /TapSDK-iOS\/?([\d\.]*)/i, // TapSDK-iOS
  ],
  [
    [VERSION, /_/g, '.'],
    [NAME, 'iOS'],
  ],
  [
    /(mac os x) ?([\w\. ]*)/i,
    /(macintosh|mac_powerpc\b)(?!.+haiku)/i, // Mac OS
  ],
  [
    [NAME, 'Mac OS'],
    [VERSION, /_/g, '.'],
  ],
  [
    // Mobile OSes
    /droid ([\w\.]+)\b.+(android[- ]x86)/i, // Android-x86
  ],
  [VERSION, NAME],
  [
    // Android/WebOS/QNX/Bada/RIM/Maemo/MeeGo/Sailfish OS
    /(android|webos|qnx|bada|rim tablet os|maemo|meego|sailfish)[-\/ ]?([\w\.]*)/i,
    /(blackberry)\w*\/([\w\.]*)/i, // Blackberry
    /(tizen|kaios)[\/ ]([\w\.]+)/i, // Tizen/KaiOS
    /\((series40);/i, // Series 40
  ],
  [NAME, VERSION],
  [/(?=.*Windows)(?:.*)HeyTapBrowser\/([\d\.]+)/i],
  [[NAME, 'Android']],
  [
    /\(bb(10);/i, // BlackBerry 10
  ],
  [VERSION, [NAME, BLACKBERRY]],
  [
    /(?:symbian ?os|symbos|s60(?=;)|series60)[-\/ ]?([\w\.]*)/i, // Symbian
  ],
  [VERSION, [NAME, 'Symbian']],
  [
    /mozilla\/[\d\.]+ \((?:mobile|tablet|tv|mobile; [\w ]+); rv:.+ gecko\/([\w\.]+)/i, // Firefox OS
  ],
  [VERSION, [NAME, FIREFOX + ' OS']],
  [
    /web0s;.+rt(tv)/i,
    /\b(?:hp)?wos(?:browser)?\/([\w\.]+)/i, // WebOS
  ],
  [VERSION, [NAME, 'webOS']],
  [
    // Google Chromecast
    /crkey\/([\d\.]+)/i, // Google Chromecast
  ],
  [VERSION, [NAME, CHROME + 'cast']],
  [
    /(cros) [\w]+ ([\w\.]+\w)/i, // Chromium OS
  ],
  [[NAME, 'Chromium OS'], VERSION],
  [
    // Console
    /(nintendo|playstation) ([wids345portablevuch]+)/i, // Nintendo/Playstation
    /(xbox); +xbox ([^\);]+)/i, // Microsoft Xbox (360, One, X, S, Series X, Series S)

    // Other
    /\b(joli|palm)\b ?(?:os)?\/?([\w\.]*)/i, // Joli/Palm
    /(mint)[\/\(\) ]?(\w*)/i, // Mint
    /(mageia|vectorlinux)[; ]/i, // Mageia/VectorLinux
    /([kxln]?ubuntu|debian|suse|opensuse|gentoo|arch(?= linux)|slackware|fedora|mandriva|centos|pclinuxos|red ?hat|zenwalk|linpus|raspbian|plan 9|minix|risc os|contiki|deepin|manjaro|elementary os|sabayon|linspire)(?: gnu\/linux)?(?: enterprise)?(?:[- ]linux)?(?:-gnu)?[-\/ ]?(?!chrom|package)([-\w\.]*)/i,
    // Ubuntu/Debian/SUSE/Gentoo/Arch/Slackware/Fedora/Mandriva/CentOS/PCLinuxOS/RedHat/Zenwalk/Linpus/Raspbian/Plan9/Minix/RISCOS/Contiki/Deepin/Manjaro/elementary/Sabayon/Linspire
    /(hurd|linux) ?([\w\.]*)/i, // Hurd/Linux
    /(gnu) ?([\w\.]*)/i, // GNU
    /\b([-frentopcghs]{0,5}bsd|dragonfly)[\/ ]?(?!amd|[ix346]{1,2}86)([\w\.]*)/i, // FreeBSD/NetBSD/OpenBSD/PC-BSD/GhostBSD/DragonFly
    /(haiku) (\w+)/i, // Haiku
  ],
  [NAME, VERSION],
  [
    /(sunos) ?([\w\.\d]*)/i, // Solaris
  ],
  [[NAME, 'Solaris'], VERSION],
  [
    /((?:open)?solaris)[-\/ ]?([\w\.]*)/i, // Solaris
    /(aix) ((\d)(?=\.|\)| )[\w\.])*/i, // AIX
    /\b(beos|os\/2|amigaos|morphos|openvms|fuchsia|hp-ux)/i, // BeOS/OS2/AmigaOS/MorphOS/OpenVMS/Fuchsia/HP-UX
    /(unix) ?([\w\.]*)/i, // UNIX
  ],
  [NAME, VERSION],
];

interface OS {
  [NAME]: string;
  [VERSION]: string;
}

let asyncOS: null | OS = null;

/**
 * @param {string} userAgent
 */
export function getOS(userAgent: string) {
  const os: Partial<OS> = {
    [NAME]: undefined,
    [VERSION]: undefined,
  };
  rgxMapper.call(os, userAgent, OS_REG);
  return asyncOS || os;
}

/**
 */
export function asyncGetOS() {
  return new Promise((resolve) => {
    if (asyncOS) {
      resolve(asyncOS);
      return;
    }
    if (navigator.userAgentData && navigator.userAgentData.getHighEntropyValues) {
      navigator.userAgentData
        .getHighEntropyValues(['platformVersion'])
        .then(({ platform, platformVersion }) => {
          if (platform && platformVersion) {
            asyncOS = { [NAME]: platform, [VERSION]: platformVersion };
          }
          resolve(asyncOS);
        })
        .catch((_) => resolve(getOS(navigator.userAgent)));
      return;
    }
    resolve(getOS(navigator.userAgent));
  });
}
