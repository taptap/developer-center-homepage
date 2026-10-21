// @ts-nocheck -- vendored utility code; upstream type declarations are not available here
import { asyncGetOS } from './parse-os';
import { overrideUserAgentUsingClientHints } from './uach-retrofill';

export { asyncGetOS, getOS } from './parse-os';

/**
 */
export function initUserAgent() {
  asyncGetOS();
  return new Promise((resolve) => {
    const userAgentData = navigator.userAgentData;
    if (userAgentData && userAgentData.getHighEntropyValues) {
      overrideUserAgentUsingClientHints(['platformVersion', 'model', 'platform']);
      userAgentData
        .getHighEntropyValues(['platformVersion', 'model'])
        .then(({ platformVersion, model }) => {
          userAgentData.platformVersion = platformVersion;
          userAgentData.model = model;
        })
        .catch();
      resolve(userAgentData);
    }
    resolve(null);
  });
}
