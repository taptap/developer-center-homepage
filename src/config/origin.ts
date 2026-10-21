/**
 * The origin this page is published on.
 *
 * Two consumers need the bare origin rather than a path: the same-origin links while
 * previewing on loopback (`links.ts`), and the user endpoint (`api/me.ts`). Keeping it
 * here means a domain change is a one-line edit.
 */
export const PRODUCTION_ORIGIN = 'https://developer.taptap.cn';
