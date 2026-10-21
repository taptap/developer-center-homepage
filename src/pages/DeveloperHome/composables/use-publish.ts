import type { BehaviorContext } from './context';

export function usePublish(ctx: BehaviorContext): void {
  const { root, cleanups, listen, each, activateButtons } = ctx;
  function syncConsoleFlowHeight() {
    const terminal = root.querySelector('.terminal-window');
    const flow = root.querySelector('.ship-card--console .console-flow');
    if (!terminal || !flow) return;
    const height = terminal.offsetHeight;
    if (!height) return;
    flow.style.height = height + 'px';
  }
  function mountPublishCardScale() {
    const board = root.querySelector('.publish-cards');
    if (!board) return;
    const orBox = board.querySelector('.publish-cards__or');
    const cliSlot = board.querySelector('.publish-cards__slot--cli');
    const consoleSlot = board.querySelector('.publish-cards__slot--console');
    if (!orBox || !cliSlot || !consoleSlot) return;
    const cliCard = cliSlot.querySelector('.ship-card');
    const consoleCard = consoleSlot.querySelector('.ship-card');
    if (!cliCard || !consoleCard) return;
    const tagsBelowIntroBreakpoint = 450;
    let alive = true;
    cleanups.push(function () {
      alive = false;
    });

    function stacked() {
      return window.matchMedia('(max-width: 900px)').matches;
    }

    function clearInline() {
      board.style.height = '';
      board.style.removeProperty('--publish-cards-height');
      board.style.removeProperty('--publish-large');
      board.style.removeProperty('--publish-small');
      board.style.removeProperty('--publish-scale');
      board.style.removeProperty('--publish-or');
      cliCard.style.width = '';
      consoleCard.style.width = '';
    }

    function syncCardHeading(card, tagsBelowIntro) {
      const head = card.querySelector('.ship-card__head');
      const title = head && head.querySelector('h3');
      const tags = card.querySelector('.ship-card__tags');
      if (!head || !title || !tags) return;

      card.classList.remove('is-tags-below-intro');
      card.classList.remove('is-tags-hidden');
      if (tagsBelowIntro) {
        card.classList.add('is-tags-below-intro');
        return;
      }

      const headStyle = window.getComputedStyle(head);
      const reservedWidth = parseFloat(headStyle.paddingRight) || 0;
      const icon = head.querySelector('.ship-card__icon');
      const iconWidth = icon ? icon.offsetWidth + (parseFloat(window.getComputedStyle(icon).marginRight) || 0) : 0;
      const titleWidth = iconWidth + title.scrollWidth;
      const headWidth = head.clientWidth;

      if (titleWidth <= headWidth - reservedWidth) return;
      card.classList.add('is-tags-hidden');
    }

    function layout() {
      if (!alive) return;
      if (stacked()) {
        board.classList.remove('is-scaled');
        board.classList.remove('is-console');
        clearInline();
        const stackedTagsBelow =
          Math.min(cliCard.getBoundingClientRect().width, consoleCard.getBoundingClientRect().width) <
          tagsBelowIntroBreakpoint;
        syncCardHeading(cliCard, stackedTagsBelow);
        syncCardHeading(consoleCard, stackedTagsBelow);
        syncConsoleFlowHeight();
        return;
      }
      const orWidth = Math.max(80, Math.min(124, 80 + ((board.clientWidth - 720) * 44) / 454));
      const available = board.clientWidth - orWidth;
      if (available <= 0) return;
      const shrink = 0.75;
      const largePx = Math.min(600, available / (1 + shrink));
      if (largePx < 160) return;
      const smallPx = Math.min(available - largePx, largePx * 0.82);
      const scale = smallPx / largePx;
      cliCard.style.width = largePx + 'px';
      consoleCard.style.width = largePx + 'px';
      const scaledTagsBelow = largePx < tagsBelowIntroBreakpoint;
      syncCardHeading(cliCard, scaledTagsBelow);
      syncCardHeading(consoleCard, scaledTagsBelow);
      syncConsoleFlowHeight();
      const height = Math.max(cliCard.offsetHeight, consoleCard.offsetHeight);
      if (!height) return;
      board.style.setProperty('--publish-large', largePx + 'px');
      board.style.setProperty('--publish-small', smallPx + 'px');
      board.style.setProperty('--publish-scale', String(scale));
      board.style.setProperty('--publish-or', orWidth + 'px');
      board.style.setProperty('--publish-cards-height', height + 'px');
      board.classList.add('is-scaled');
    }

    listen(consoleSlot, 'mouseenter', function () {
      if (stacked()) return;
      board.classList.add('is-console');
    });
    listen(consoleSlot, 'mouseleave', function () {
      board.classList.remove('is-console');
    });
    layout();
    window.requestAnimationFrame(function () {
      if (!alive) return;
      board.classList.add('is-ready');
    });
    listen(window, 'resize', layout);
    if (document.fonts && document.fonts.ready && document.fonts.ready.then) {
      document.fonts.ready.then(layout);
    }
  }

  mountPublishCardScale();
  each('.ship-card--console .console-flow__step', function (step) {
    listen(step, 'mouseenter', function () {
      activateButtons('.ship-card--console .console-flow__step', step);
    });
    listen(step, 'click', function (event) {
      event.preventDefault();
    });
  });
}
