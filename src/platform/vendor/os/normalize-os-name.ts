// @ts-nocheck -- vendored utility code; upstream type declarations are not available here
const OS_NAME_MAP = new Map<string, string>([
  ['Android-x86', 'Android'],
  ['Android x86', 'Android'],
  ['android', 'Android'],
  ['Mac+OS', 'MacOS'],
  ['Mac%20OS', 'MacOS'],
  ['Mac OS', 'MacOS'],
  ['macOS', 'MacOS'],
  ['Windows+Phone', 'WindowsPhone'],
  ['Windows Phone', 'WindowsPhone'],
  ['windows', 'Windows'],
  ['Chromium OS', 'ChromeOS'],
  ['Chromium+OS', 'ChromeOS'],
  ['Chrome%20OS', 'ChromeOS'],
  ['Chrome 20OS', 'ChromeOS'],
  ['Chrome%2005', 'ChromeOS'],
  ['Chrome 2005', 'ChromeOS'],
  ['\\N', 'Unknown'],
  ['N', 'Unknown'],
  ['undefined', 'Unknown'],
  ['', 'Unknown'],
]);

export function normalizeOSName(name: string): string {
  if (!name || !name.trim()) {
    return 'Unknown';
  }
  let decoded = name.trim();
  try {
    decoded = decodeURIComponent(decoded);
  } catch {}
  return OS_NAME_MAP.get(decoded) || decoded;
}
