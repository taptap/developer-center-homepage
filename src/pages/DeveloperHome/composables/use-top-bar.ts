import type { BehaviorContext } from './context';

export function useTopBar(ctx: BehaviorContext): void {
  const { root, cleanups, listen, each, scrollTargetIntoView } = ctx;
  const menuButton = root.querySelector('.topbar__menu');
  const topbarNav = root.querySelector('.topbar__nav');
  const dropdowns = root.querySelectorAll('.topbar__drop');
  const hoverNavQuery = window.matchMedia('(min-width: 901px) and (hover: hover) and (pointer: fine)');

  function setDropdownOpen(dropdown, open) {
    dropdown.classList.toggle('is-open', open);
    const toggle = dropdown.querySelector('.topbar__drop-toggle');
    if (toggle) toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  }

  function closeDropdowns() {
    Array.prototype.forEach.call(dropdowns, function (dropdown) {
      setDropdownOpen(dropdown, false);
    });
  }

  function closeMobileNav() {
    if (!menuButton || !topbarNav) return;
    menuButton.setAttribute('aria-expanded', 'false');
    topbarNav.classList.remove('is-open');
  }

  function eventElement(event) {
    let node = event.target;
    if (node && node.nodeType !== 1) node = node.parentElement;
    return node;
  }

  if (menuButton && topbarNav) {
    listen(menuButton, 'click', function () {
      const open = menuButton.getAttribute('aria-expanded') === 'true';
      menuButton.setAttribute('aria-expanded', String(!open));
      topbarNav.classList.toggle('is-open', !open);
      if (open) closeDropdowns();
    });
  }

  Array.prototype.forEach.call(dropdowns, function (dropdown) {
    const toggle = dropdown.querySelector('.topbar__drop-toggle');
    if (!toggle) return;
    listen(toggle, 'click', function (event) {
      if (hoverNavQuery.matches) return;
      event.preventDefault();
      const open = dropdown.classList.contains('is-open');
      closeDropdowns();
      if (!open) setDropdownOpen(dropdown, true);
    });
  });

  if (topbarNav) {
    listen(topbarNav, 'click', function (event) {
      const node = eventElement(event);
      if (!node || !node.closest || !node.closest('.topbar__drop-menu a')) return;
      closeDropdowns();
      closeMobileNav();
    });
  }

  listen(document, 'click', function (event) {
    const node = eventElement(event);
    if (topbarNav && node && topbarNav.contains(node)) return;
    closeDropdowns();
  });

  listen(document, 'keydown', function (event) {
    if (event.key !== 'Escape' && event.keyCode !== 27) return;
    closeDropdowns();
    const active = document.activeElement as HTMLElement | null;
    if (topbarNav && active && topbarNav.contains(active) && active.blur) active.blur();
  });

  function handleNavModeChange() {
    if (hoverNavQuery.matches) closeDropdowns();
  }
  // `addEventListener` on a MediaQueryList is available everywhere this page targets; the
  // deprecated `addListener` fallback was checked first, so it was the only branch taken.
  listen(hoverNavQuery, 'change', handleNavModeChange);

  each('a[href^="#"]', function (link) {
    link.addEventListener('click', function (event) {
      const targetId = link.getAttribute('href');
      const target = targetId && targetId.length > 1 ? root.querySelector(targetId) : null;
      if (!target) return;
      event.preventDefault();
      scrollTargetIntoView(target);
      // Move focus to the target so the next Tab continues from there. Without this the
      // skip link only scrolls, and Tab jumps back to the top of the page — the one thing
      // it exists to prevent. `preventScroll` keeps the scroll position we just set.
      if (typeof target.focus === 'function') target.focus({ preventScroll: true });
      closeDropdowns();
      closeMobileNav();
    });
  });
}
