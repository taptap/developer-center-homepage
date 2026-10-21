/**
 * Everything the per-section behaviour modules share: the page root, reduced-motion
 * state, the cleanup list and a few DOM helpers.
 */
/**
 * Shared state for the per-section behaviour modules.
 *
 * `root`/`byId`/`each` stay loosely typed on purpose: this is one large imperative
 * DOM script where every lookup is a known-id element, and typing each site would add
 * casts without catching real bugs. Modules get `any` back, exactly as the original
 * single-file implementation did; individual modules can tighten their own types later.
 */
export interface BehaviorContext {
  root: any;
  reduceMotion: boolean;
  scrollEl: any;
  cleanups: Array<() => void>;
  listen(target: any, type: string, fn: any, options?: any): void;
  each(selector: string, callback: (element: any) => void): void;
  byId(id: string): any;
  scrollOffset(): number;
  distanceFromScrollStart(element: any): number;
  scrollTargetIntoView(target: any): void;
  activateButtons(selector: string, activeButton: any): void;
}

function findScrollParent(node: HTMLElement | null): HTMLElement | Window {
  let el: HTMLElement | null = node ? node.parentElement : null;
  while (el && el !== document.documentElement) {
    const overflowY = window.getComputedStyle(el).overflowY;
    if (overflowY === 'auto' || overflowY === 'scroll' || overflowY === 'overlay') return el;
    el = el.parentElement;
  }
  return window;
}

export function createContext(root: HTMLElement): BehaviorContext {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const scrollEl = findScrollParent(root);
  const cleanups: Array<() => void> = [];

  const ctx: BehaviorContext = {
    root,
    reduceMotion,
    scrollEl,
    cleanups,
    listen(target, type, fn, options?) {
      target.addEventListener(type, fn, options);
      cleanups.push(function () {
        target.removeEventListener(type, fn, options);
      });
    },
    each(selector, callback) {
      root.querySelectorAll(selector).forEach(function (element: Element) {
        callback(element);
      });
    },
    byId(id) {
      return root.querySelector('#' + id);
    },
    scrollOffset() {
      if (scrollEl === window) return window.pageYOffset || document.documentElement.scrollTop || 0;
      return (scrollEl as HTMLElement).scrollTop;
    },
    distanceFromScrollStart(element) {
      if (!element) return 0;
      const rect = element.getBoundingClientRect();
      if (scrollEl === window) return rect.top + ctx.scrollOffset();
      return rect.top - (scrollEl as HTMLElement).getBoundingClientRect().top + (scrollEl as HTMLElement).scrollTop;
    },
    scrollTargetIntoView(target) {
      const behavior: ScrollBehavior = reduceMotion ? 'auto' : 'smooth';
      const offset = 100;
      if (scrollEl === window) {
        window.scrollTo({ top: target.getBoundingClientRect().top + ctx.scrollOffset() - offset, behavior });
        return;
      }
      const top =
        target.getBoundingClientRect().top -
        (scrollEl as HTMLElement).getBoundingClientRect().top +
        (scrollEl as HTMLElement).scrollTop -
        offset;
      (scrollEl as HTMLElement).scrollTo({ top, behavior });
    },
    activateButtons(selector, activeButton) {
      root.querySelectorAll(selector).forEach(function (button) {
        const on = button === activeButton;
        button.classList.toggle('is-active', on);
        if (button.hasAttribute('aria-selected')) button.setAttribute('aria-selected', on ? 'true' : 'false');
      });
    },
  };
  return ctx;
}
