/**
 * The first-paint gate declared in `index.html`.
 *
 * It ships in the prerendered artifact as well: the markup *is* the whole homepage, so
 * without a cover a signed-in developer would see the page paint before the redirect.
 *
 * Two places can take it down — the app once it has an answer, and the inline safety net in
 * `index.html` if the bundle never gets that far. Whoever goes first wins: a page that has
 * already been revealed must not be redirected afterwards, otherwise the visitor watches the
 * homepage appear and then disappear again, which is the flash this gate exists to prevent.
 */
const GATE_SELECTOR = '.entry-gate';

/** The inline safety net in `index.html` (see `index.html`), if it is still armed. */
export function disarmEntryGate(): void {
  if (window.__consoleEntryTimer !== undefined) {
    window.clearTimeout(window.__consoleEntryTimer);
    window.__consoleEntryTimer = undefined;
  }
}

/** `true` once the gate has been taken down, by either side. */
export function isGateRevealed(): boolean {
  return window.__consoleEntryRevealed === true;
}

/** Drops the gate. Idempotent. */
export function revealHomepage(): void {
  disarmEntryGate();
  window.__consoleEntryRevealed = true;
  const gate = document.querySelector(GATE_SELECTOR);
  if (gate?.parentNode) gate.parentNode.removeChild(gate);
}
