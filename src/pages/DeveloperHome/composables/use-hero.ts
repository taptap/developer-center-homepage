import type { BehaviorContext } from './context';

export function useHero(ctx: BehaviorContext): void {
  const { root, cleanups } = ctx;
  const hero = root.querySelector('.hero');
  const dotHighlight = root.querySelector('.hero__dot-grid-highlight');
  let dotFrame = 0;
  let dotX = -999;
  let dotY = -999;

  function paintDotHighlight() {
    dotFrame = 0;
    if (!hero || !dotHighlight) return;
    dotHighlight.style.setProperty('--mouse-x', dotX + 'px');
    dotHighlight.style.setProperty('--mouse-y', dotY + 'px');
  }

  if (hero && dotHighlight) {
    hero.addEventListener('mouseenter', function () {
      dotHighlight.classList.add('is-active');
    });
    hero.addEventListener('mousemove', function (event) {
      const rect = hero.getBoundingClientRect();
      dotX = event.clientX - rect.left;
      dotY = event.clientY - rect.top;
      if (dotFrame) return;
      dotFrame = window.requestAnimationFrame(paintDotHighlight);
    });
    hero.addEventListener('mouseleave', function () {
      dotX = -999;
      dotY = -999;
      dotHighlight.classList.remove('is-active');
      if (!dotFrame) dotFrame = window.requestAnimationFrame(paintDotHighlight);
    });
  }

  cleanups.push(function () {
    window.cancelAnimationFrame(dotFrame);
  });
}
