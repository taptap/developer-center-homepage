#!/usr/bin/env node
/**
 * 打印本次发布应使用的 tag（CalVer）。
 *
 * 格式：`v{YYYY}.{M}.{D}`（北京时间，月/日不补零，与 taptap/cli 的 tag 风格一致）。
 * 同一天多次发布按 CalVer 的 MICRO 段递增：`v2026.10.20` → `v2026.10.20.1` → `v2026.10.20.2`。
 *
 * 用法：
 *   node scripts/next-tag.mjs            # 只看结果
 *   node scripts/next-tag.mjs --remote upstream
 *
 *   tag="$(node scripts/next-tag.mjs)"
 *   git tag -a "$tag" -m "Release $tag"
 *   git push origin "refs/tags/$tag"
 *
 * 说明：
 * - 日期固定按 Asia/Shanghai 计算，避免晚上发的版本被 UTC 记成第二天
 * - 已有 tag 只增不改：同一天第二次发布只会拿到 `.1`，不会移动旧 tag
 * - 只读远端 tag 列表，不写仓库
 */
import { execFileSync } from 'node:child_process';
import process from 'node:process';

const REMOTE = process.argv.includes('--remote') ? process.argv[process.argv.indexOf('--remote') + 1] : 'origin';
const TIME_ZONE = 'Asia/Shanghai';

if (!REMOTE) {
  console.error('[next-tag] --remote 需要一个远知名，例如 --remote origin');
  process.exit(1);
}

/** 日期按固定时区取，月/日不补零：2026-09-04 → 2026.9.4 */
function today() {
  const parts = execFileSync('date', ['+%Y-%-m-%-d'], {
    env: { ...process.env, TZ: TIME_ZONE },
    encoding: 'utf8',
  }).trim();
  const [year, month, day] = parts.split('-');
  return `${year}.${month}.${day}`;
}

function remoteTags() {
  try {
    const output = execFileSync('git', ['ls-remote', '--tags', REMOTE], { encoding: 'utf8' });
    return output
      .split('\n')
      .map((line) => line.split('refs/tags/')[1] ?? '')
      .filter((name) => name && !name.endsWith('^{}'))
      .map((name) => name.replace(/^v/, ''));
  } catch (error) {
    console.error(`[next-tag] 读取 ${REMOTE} 的 tag 失败：${error.message}`);
    process.exit(1);
  }
}

const base = today();
const sameDay = remoteTags()
  .map((tag) => /^(\d{4}\.\d{1,2}\.\d{1,2})(?:\.(\d+))?$/.exec(tag))
  .filter((match) => match && match[1] === base)
  .map((match) => (match[2] ? Number.parseInt(match[2], 10) : 0));

const next = sameDay.length === 0 ? `v${base}` : `v${base}.${Math.max(...sameDay) + 1}`;
console.log(next);
