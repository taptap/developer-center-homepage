#!/usr/bin/env node
/**
 * Analytics contract guard.
 *
 * `page_view` is the only event this page reports, and downstream reporting reads its
 * payload by name. Renaming a key or moving `page_name` out of `ctx` breaks reporting
 * silently, so this check fails the build instead of relying on a comment somewhere.
 *
 * Change the list below only together with whoever consumes the data.
 */
import { readFile } from 'node:fs/promises';
import path from 'node:path';

const SOURCE = path.resolve('src/track/page-view.ts');

/** Payload keys the reporting pipeline reads. Presence matters; order does not. */
const REQUIRED_KEYS = [
  'APIVersion',
  'LOG_TYPE',
  'action',
  'XUA',
  'G-URL',
  'G-REFERER',
  'browser_name',
  'UID',
  'event_trigger_ts',
  't_log_id',
  'in_app',
  'page_title',
  'ctx',
  'position',
];

/** Frozen values: the dashboard segments on these. */
const CONSTANTS = [
  ['LOG_TYPE', 'events'],
  ['action', 'page_view'],
  ['PAGE_NAME', 'HomePage'],
];

const source = await readFile(SOURCE, 'utf8');
const failures = [];

for (const key of REQUIRED_KEYS) {
  const pattern = new RegExp(`(?:^|[\\s{,])['"]?${key.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')}['"]?\\s*:`);
  if (!pattern.test(source)) failures.push(`missing payload key: ${key}`);
}

for (const [name, value] of CONSTANTS) {
  const pattern = new RegExp(`${name}\\s*[:=]\\s*['"]${value}['"]`);
  if (!pattern.test(source)) failures.push(`${name} is no longer '${value}'`);
}

// `page_name` identifies the page inside `ctx`; a top-level copy would double-report it.
const pageNameHits = source.match(/\bpage_name\s*:/g) ?? [];
if (pageNameHits.length !== 1) {
  failures.push(`page_name must be set exactly once (inside ctx), found ${pageNameHits.length}`);
} else {
  const ctxStart = source.indexOf('ctx: JSON.stringify({');
  const ctxEnd = ctxStart === -1 ? -1 : source.indexOf('})', ctxStart);
  const ctxSlice = ctxStart === -1 || ctxEnd === -1 ? '' : source.slice(ctxStart, ctxEnd);
  if (!ctxSlice.includes('page_name')) failures.push('page_name is set outside ctx');
}

if (failures.length > 0) {
  console.error('[tracking] page_view payload contract broken:');
  for (const item of failures) console.error(`  - ${item}`);
  console.error('[tracking] see the header of src/track/page-view.ts before changing it');
  process.exit(1);
}

console.log(`[tracking] page_view payload OK | ${REQUIRED_KEYS.length} keys | ${CONSTANTS.length} frozen values`);
