interface Window {
  /** Set by `scripts/prerender.mjs` before the app scripts run; skips the user request and analytics. */
  __PRERENDER_INJECTED?: boolean;
}
