import type { BehaviorContext } from './context';

export function useCounters(ctx: BehaviorContext): void {
  const { root, cleanups, reduceMotion, each } = ctx;

  let countObserver;
  let counted = false;
  const stats = root.querySelector('.hero__stats');
  function runCounts() {
    if (counted) return;
    counted = true;
    each('.count', function (node) {
      const target = parseInt(node.getAttribute('data-value'), 10);
      const start = Date.now();
      const duration = reduceMotion ? 1 : 1100;
      function tick() {
        const progress = Math.min((Date.now() - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        node.textContent = Math.floor(target * eased).toLocaleString('zh-CN');
        if (progress < 1) window.requestAnimationFrame(tick);
      }
      tick();
    });
  }
  if (stats && 'IntersectionObserver' in window) {
    countObserver = new IntersectionObserver(
      function (entries) {
        if (entries[0].isIntersecting) {
          runCounts();
          countObserver.disconnect();
        }
      },
      { threshold: 0.4 },
    );
    countObserver.observe(stats);
  } else {
    runCounts();
  }
  cleanups.push(function () {
    if (countObserver) countObserver.disconnect();
  });
}
