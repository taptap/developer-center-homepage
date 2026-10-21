import { getUUID, uuidv4 } from '@/platform/vendor/uuid-browser';
import { inTapClient } from '@/platform/vendor/in-tap-client';
import { getXua } from '@/platform/xua';

/**
 * Page view — the only analytics event this page reports.
 *
 * Transport and payload follow the frozen analytics contract (field names are consumed by
 * downstream reporting — do not rename them):
 * - 1x1 gif with a query string, same endpoint as the rest of the developer site
 * - `ctx` and `position` are objects serialized to JSON strings
 * - The page identity lives in `ctx.page_name`; do not add a top-level `page_name`
 * - `page_title` is kept as a top-level field for this page
 * - `browser_name` is intentionally left empty
 */
const SLS_ENDPOINT = 'https://tap-snow.cn-beijing.log.aliyuncs.com/logstores/web-logs/track_ua.gif';
const PAGE_NAME = 'HomePage';

export function trackPageView(pageTitle: string): void {
  // Skip automated browsers (prerendering, CI screenshots) so they never pollute reporting.
  if (typeof navigator !== 'undefined' && navigator.webdriver) return;

  const params: Record<string, string> = {
    APIVersion: '0.6.0',
    LOG_TYPE: 'events',
    action: 'page_view',
    XUA: getXua(),
    'G-URL': window.location.origin + window.location.pathname + window.location.search,
    'G-REFERER': document.referrer,
    browser_name: '',
    UID: getUUID(),
    event_trigger_ts: String(Date.now()),
    t_log_id: uuidv4(),
    in_app: String(inTapClient()),
    page_title: (pageTitle || document.title).split('|')[0].trim(),
    ctx: JSON.stringify({
      uri: window.location.origin + window.location.pathname,
      page_name: PAGE_NAME,
      developer_id: '',
      game_id: '',
    }),
    position: JSON.stringify({ x: 0, y: 0 }),
  };

  const query = Object.keys(params)
    .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    .join('&');

  const img = new Image(1, 1);
  img.src = `${SLS_ENDPOINT}?${query}`;
}
