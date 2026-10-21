import type { BehaviorContext } from './context';

export function useReveal(ctx: BehaviorContext): void {
  const { reduceMotion, cleanups, each } = ctx;

  let revealObserver;
  function revealElement(element) {
    const delay = parseInt(element.getAttribute('data-delay') || '0', 10);
    window.setTimeout(
      function () {
        element.classList.add('is-visible');
      },
      reduceMotion ? 0 : delay,
    );
  }

  if ('IntersectionObserver' in window && !reduceMotion) {
    revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          if (entry.target.classList.contains('reveal-group')) {
            const children = entry.target.querySelectorAll('.reveal-item');
            if (entry.target.classList.contains('hero__stats')) {
              Array.prototype.forEach.call(children, function (child) {
                child.classList.add('is-visible');
              });
            } else {
              Array.prototype.forEach.call(children, function (child, index) {
                window.setTimeout(function () {
                  child.classList.add('is-visible');
                }, index * 90);
              });
            }
            entry.target.classList.add('is-visible');
          } else {
            revealElement(entry.target);
          }
          revealObserver.unobserve(entry.target);
        });
      },
      { threshold: 0.16, rootMargin: '0px 0px -40px 0px' },
    );
    each('.reveal, .reveal-group', function (element) {
      revealObserver.observe(element);
    });
  } else {
    each('.reveal, .reveal-group, .reveal-item', function (element) {
      element.classList.add('is-visible');
    });
  }

  cleanups.push(function () {
    if (revealObserver) revealObserver.disconnect();
  });
}
