interface Window {
  /** Set by `scripts/prerender.mjs` before the app scripts run; skips the user request and analytics. */
  __PRERENDER_INJECTED?: boolean;
}

interface Window {
  /** Set by the inline safety net in `index.html`; `true` once the first-paint gate is gone. */
  __consoleEntryRevealed?: boolean;
  /** Timer id of that safety net, so the app can disarm it when it decides first. */
  __consoleEntryTimer?: number;
}
