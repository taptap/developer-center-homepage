import type { BehaviorContext } from './context';

export function useSectionNav(ctx: BehaviorContext): void {
  const { root, listen, each, byId, scrollEl, scrollOffset, distanceFromScrollStart } = ctx;

  function readNavyBlueChannels() {
    let hex = window.getComputedStyle(root).getPropertyValue('--navy-blue').replace('#', '').replace(/\s/g, '');
    if (hex.length === 3) {
      hex = hex.charAt(0) + hex.charAt(0) + hex.charAt(1) + hex.charAt(1) + hex.charAt(2) + hex.charAt(2);
    }
    const num = parseInt(hex, 16);
    if (!hex || hex.length !== 6 || isNaN(num)) return '34, 39, 64';
    return ((num >> 16) & 255) + ', ' + ((num >> 8) & 255) + ', ' + (num & 255);
  }

  const navyBlueChannels = readNavyBlueChannels();
  const sections = ['ways', 'publish', 'ecosystem', 'rhythm', 'traffic', 'cases'];
  function syncSectionNav() {
    let active = '';
    sections.forEach(function (id) {
      const element = byId(id);
      if (element && element.getBoundingClientRect().top <= 170) active = id;
    });
    each('.section-nav a[data-section]', function (link) {
      link.classList.toggle('is-active', link.getAttribute('data-section') === active);
    });
    const topbar = byId('topbar');
    const sectionNav = byId('sectionNav');
    const topbarHeight = topbar ? topbar.offsetHeight : 72;
    const fillDistance = Math.max(1, distanceFromScrollStart(sectionNav) - topbarHeight);
    const fillProgress = Math.max(0, Math.min(1, scrollOffset() / fillDistance));
    if (topbar) {
      topbar.style.backgroundColor = 'rgba(' + navyBlueChannels + ', ' + fillProgress + ')';
      topbar.classList.toggle('is-scrolled', fillProgress >= 1);
    }
  }
  let scrollPending = false;
  listen(
    scrollEl,
    'scroll',
    function () {
      if (scrollPending) return;
      scrollPending = true;
      window.requestAnimationFrame(function () {
        syncSectionNav();
        scrollPending = false;
      });
    },
    { passive: true },
  );
  syncSectionNav();
}
