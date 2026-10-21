import type { BehaviorContext } from './context';

export function useFormats(ctx: BehaviorContext): void {
  const { root, listen, each, byId } = ctx;
  function syncFormatLayout() {
    const row = byId('formatAccordion');
    if (!row) return;
    const panels = row.querySelectorAll('.format-panel');
    const stacked = row.clientWidth > 0 && row.clientWidth < 1100;
    row.classList.toggle('is-stacked', stacked);
    if (stacked) {
      const collapsedHeight = 96;
      const openHeight = 330;
      Array.prototype.forEach.call(panels, function (panel) {
        const stage = panel.querySelector('.format-panel__stage');
        const mark = panel.querySelector('.format-panel__mark');
        if (mark) mark.style.left = '';
        if (!stage) return;
        stage.style.width = '100%';
        stage.style.height = (panel.classList.contains('format-panel--open') ? openHeight : collapsedHeight) + 'px';
      });
      return;
    }
    const collapsedWidth = 180;
    const markSize = 88;
    const markRight = 53;
    const dividerWidth = Math.max(0, panels.length - 1);
    const openWidth = row.clientWidth - collapsedWidth * (panels.length - 1) - dividerWidth;
    Array.prototype.forEach.call(panels, function (panel) {
      const stage = panel.querySelector('.format-panel__stage');
      const mark = panel.querySelector('.format-panel__mark');
      const open = panel.classList.contains('format-panel--open');
      if (!stage) return;
      stage.style.height = '';
      stage.style.width = (open ? openWidth : collapsedWidth) + 'px';
      if (mark) {
        const left = open ? openWidth - markRight - markSize : (collapsedWidth - markSize) / 2;
        mark.style.left = left + 'px';
      }
    });
  }

  function openFormatPanel(targetPanel) {
    each('.format-panel', function (panel) {
      const open = panel === targetPanel;
      panel.classList.toggle('format-panel--open', open);
      panel.querySelector('button').setAttribute('aria-expanded', String(open));
    });
    syncFormatLayout();
  }

  each('.format-panel', function (panel) {
    panel.querySelector('button').addEventListener('click', function () {
      openFormatPanel(panel);
    });
  });

  const defaultFormat = root.querySelector('.format-panel[data-format="web"]');
  if (defaultFormat) openFormatPanel(defaultFormat);
  listen(window, 'resize', syncFormatLayout);
}
