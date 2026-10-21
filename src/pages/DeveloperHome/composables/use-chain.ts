import type { BehaviorContext } from './context';

export function useChain(ctx: BehaviorContext): void {
  const { root, cleanups, reduceMotion, listen, each, byId, scrollEl, scrollOffset } = ctx;
  const chainData = [
    ['建游戏', '填写最小必填信息，创建游戏。', '控制台里能看到这个游戏，状态是草稿。'],
    ['传包体', '按游戏形态上传包体，平台会自动完成基础校验。', '包体校验通过，能生成一张测试二维码。'],
    [
      '自测',
      '扫码在手机上完整试玩，先解决打不开、卡死和玩法不清的问题。',
      '连续试玩三局，没有明显卡顿、白屏或流程中断。',
    ],
    [
      '补资料',
      '图标、截图和简介会展示在商店里，玩家看到的最终内容就是这一屏。',
      '扫码进去看到的图标和截图就是最终版本。',
    ],
    ['开测试', '创建测试计划，让真实玩家体验几轮，收集反馈后继续调整。', '完成几轮测试，玩法稳定，没有重大 bug。'],
    ['正式上架', '玩法稳定后提交审核，审核通过即可上线。', '游戏对外可见，玩家能够直接下载或游玩。'],
  ];
  let chainIndex = 0;
  let chainScrollTimer = 0;
  function scrollChainStepsIntoView() {
    window.clearTimeout(chainScrollTimer);
    chainScrollTimer = 0;
    const circle = root.querySelector('#chainSteps .chain-step__circle');
    if (!circle) return;
    const rect = circle.getBoundingClientRect();
    const mid = rect.top + rect.height / 2;
    const behavior: ScrollBehavior = reduceMotion ? 'auto' : 'smooth';
    if (scrollEl === window) {
      const desired = window.innerHeight * 0.4;
      const top = scrollOffset() + mid - desired;
      window.scrollTo({ top: top < 0 ? 0 : top, behavior: behavior });
      return;
    }
    const viewRect = scrollEl.getBoundingClientRect();
    const desiredTop = scrollEl.clientHeight * 0.4;
    const next = scrollEl.scrollTop + (mid - viewRect.top) - desiredTop;
    scrollEl.scrollTo({ top: next < 0 ? 0 : next, behavior: behavior });
  }

  const chainToggle = root.querySelector('.publish-chain__toggle');
  const chainBody = root.querySelector('.publish-chain__body');
  const chainSteps = byId('chainSteps');
  const chainFill = byId('chainStepsFill');

  function syncChainRail() {
    if (!chainSteps || !chainFill) return;
    const steps = chainSteps.querySelectorAll('.chain-step');
    Array.prototype.forEach.call(steps, function (step, i) {
      const on = i === chainIndex;
      step.classList.toggle('is-active', on);
      step.classList.toggle('is-done', i < chainIndex);
      step.setAttribute('aria-selected', on ? 'true' : 'false');
      step.setAttribute('tabindex', on ? '0' : '-1');
    });
    let span = chainSteps.getBoundingClientRect().width - 64;
    if (span < 0) span = 0;
    const width = chainIndex === 0 || steps.length < 2 ? 0 : (chainIndex / (steps.length - 1)) * span;
    chainFill.style.width = width + 'px';
    placeChainDetail();
    const scroller = chainSteps.parentNode;
    const active = byId('chainStep' + chainIndex);
    if (scroller && active && scroller.scrollWidth > scroller.clientWidth + 1) {
      const scrollerRect = scroller.getBoundingClientRect();
      const stepRect = active.getBoundingClientRect();
      const delta = stepRect.left + stepRect.width / 2 - (scrollerRect.left + scrollerRect.width / 2);
      scroller.scrollLeft = scroller.scrollLeft + delta;
    }
  }

  function placeChainDetail() {
    const detail = byId('chainDetail');
    const active = byId('chainStep' + chainIndex);
    if (!detail || !active) return;
    const board = detail.parentNode;
    if (!board) return;
    const detailWidth = detail.offsetWidth;
    const boardWidth = board.clientWidth;
    if (!detailWidth || !boardWidth) return;
    const circle = active.querySelector('.chain-step__circle') || active;
    const boardRect = board.getBoundingClientRect();
    const circleRect = circle.getBoundingClientRect();
    const center = circleRect.left + circleRect.width / 2 - boardRect.left;
    let left = center - detailWidth / 2;
    let maxLeft = boardWidth - detailWidth;
    if (maxLeft < 0) maxLeft = 0;
    if (left < 0) left = 0;
    if (left > maxLeft) left = maxLeft;
    detail.style.left = Math.round(left) + 'px';
  }
  function showChain(index) {
    if (index < 0 || index >= chainData.length) return;
    chainIndex = index;
    const data = chainData[index];
    const title = byId('chainTitle');
    const lead = byId('chainLead');
    const result = byId('chainResult');
    const detail = byId('chainDetail');
    if (title) title.textContent = data[0];
    if (lead) lead.textContent = data[1];
    if (result) result.textContent = '做完是这样：' + data[2];
    if (detail) detail.setAttribute('aria-labelledby', 'chainStep' + index);
    syncChainRail();
  }

  function onChainMotionEnd(event) {
    if (event.target !== chainBody || event.propertyName !== 'height') return;
    chainBody.removeEventListener('transitionend', onChainMotionEnd);
    const open = chainToggle.getAttribute('aria-expanded') === 'true';
    chainBody.style.transition = '';
    if (open) {
      chainBody.style.height = 'auto';
      syncChainRail();
      scrollChainStepsIntoView();
    } else {
      chainBody.hidden = true;
      chainBody.style.height = '';
    }
  }

  if (chainToggle && chainBody) {
    chainToggle.addEventListener('click', function () {
      window.clearTimeout(chainScrollTimer);
      chainScrollTimer = 0;
      const open = chainToggle.getAttribute('aria-expanded') !== 'true';
      chainToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      chainBody.removeEventListener('transitionend', onChainMotionEnd);
      if (reduceMotion) {
        chainBody.hidden = !open;
        chainBody.style.height = '';
        chainBody.style.transition = '';
        chainBody.style.overflow = '';
        if (open) {
          window.requestAnimationFrame(function () {
            syncChainRail();
            scrollChainStepsIntoView();
          });
        }
        return;
      }
      const from = chainBody.getBoundingClientRect().height;
      chainBody.style.transition = 'none';
      chainBody.style.overflow = 'hidden';
      chainBody.style.height = from + 'px';
      if (open) chainBody.hidden = false;
      void chainBody.offsetHeight;
      chainBody.style.transition = 'height 0.55s cubic-bezier(0.22, 1, 0.36, 1)';
      chainBody.style.height = open ? chainBody.scrollHeight + 'px' : '0px';
      chainBody.addEventListener('transitionend', onChainMotionEnd);
      if (open) {
        window.clearTimeout(chainScrollTimer);
        chainScrollTimer = window.setTimeout(function () {
          scrollChainStepsIntoView();
        }, 600);
        window.requestAnimationFrame(syncChainRail);
      }
    });
  }

  each('.chain-step', function (button) {
    button.addEventListener('click', function () {
      showChain(parseInt(button.getAttribute('data-chain'), 10));
    });
    button.addEventListener('keydown', function (event) {
      const index = parseInt(button.getAttribute('data-chain'), 10);
      let next = index;
      if (event.key === 'ArrowRight' || event.key === 'ArrowDown') next = Math.min(chainData.length - 1, index + 1);
      else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') next = Math.max(0, index - 1);
      else if (event.key === 'Home') next = 0;
      else if (event.key === 'End') next = chainData.length - 1;
      else return;
      event.preventDefault();
      const target = byId('chainStep' + next);
      if (target) target.focus();
      showChain(next);
    });
  });

  listen(window, 'resize', syncChainRail);

  cleanups.push(function () {
    window.clearTimeout(chainScrollTimer);
  });
}
