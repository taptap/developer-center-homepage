import case1 from '@/assets/cases/case-1.webp';
import case2 from '@/assets/cases/case-2.webp';
import case3 from '@/assets/cases/case-3.webp';
import case4 from '@/assets/cases/case-4.webp';
import case5 from '@/assets/cases/case-5.webp';
import case6 from '@/assets/cases/case-6.webp';
import caseYihuan from '@/assets/cases/case-yihuan.jpg';
import type { BehaviorContext } from './context';

interface CaseItem {
  name: string;
  label: string;
  desc: string;
  stat?: string;
  unit?: string;
  statLabel?: string;
  image: string;
}

export function useCases(ctx: BehaviorContext): void {
  const { root, reduceMotion, cleanups, listen, each, byId } = ctx;
  const caseData: CaseItem[] = [
    {
      name: '心动小镇',
      label: '全链路深度发行',
      desc: '未走传统分发渠道，选择 TapTap 独家发行。登录、测试招募、更新唤起、礼包与社区互动组合使用，分阶段做曝光和留存。',
      stat: '1438',
      unit: '万+',
      statLabel: 'TapTap 上线两周下载量',
      image: case1,
    },
    {
      name: 'Phigros',
      label: '小团队长期经营',
      desc: '从大学生团队起步，靠 TapTap 的口碑效应持续更新，多年后依然稳定出现在热门榜前列。',
      stat: '37.7',
      unit: '万+',
      statLabel: '上线 5 年后单周试玩用户数',
      image: case2,
    },
    {
      name: '泰拉瑞亚',
      label: '买断制售卖',
      desc: '平台零抽成，收入全部归开发者。定价、限时优惠、数据统计和正版验证都有现成配套。',
      stat: '476',
      unit: '万+',
      statLabel: 'TapTap 累计售出份数',
      image: case3,
    },
    {
      name: '原神',
      label: '版本更新即小首发',
      desc: '新版本配合品牌专题预热，加上更新唤起和上线通知，每一次更新都能拉回一批老玩家。',
      stat: '100',
      unit: '万+',
      statLabel: '新版本单日 TapTap 玩家更新数',
      image: case4,
    },
    {
      name: '异环',
      label: 'PC 端同步发行',
      desc: '首发同步上线 Windows 端，下载链路全打通，多端曝光助力游戏增长。',
      stat: '60',
      unit: '万+',
      statLabel: 'Windows 端下载量',
      image: caseYihuan,
    },
    {
      name: '心动的公寓',
      label: '个人 H5 作品',
      desc: 'AI 制作的游戏作品，接入全套 TapTap 游戏服务，不仅完成了上架变现，还收获了许许多多的真实种子玩家。',
      stat: '160',
      unit: '+',
      statLabel: 'TapTap 上线 2 周获得真实玩家评价',
      image: case5,
    },
    {
      name: '翡翠经营模拟器',
      label: 'TapTap 制造原生作品',
      desc: '个人开发者从零开始，完全通过 TapTap 制造开发制作，一键发布至 TapTap，通过优秀质量持续获量，曾在热门榜第一霸榜数日。',
      stat: '100',
      unit: '万+',
      statLabel: 'TapTap 上线 3 个月累计热度',
      image: case6,
    },
  ];
  let caseIndex = 0;
  let caseTimer;
  let caseFadeToken = 0;
  const caseLabel = byId('caseLabel');
  const caseName = byId('caseName');
  const caseDesc = byId('caseDesc');
  const caseStatBlock = byId('caseStatBlock');
  const caseStat = byId('caseStat');
  const caseUnit = byId('caseUnit');
  const caseStatLabel = byId('caseStatLabel');
  const caseImage = byId('caseImage');
  const caseVeilImage = byId('caseVeilImage');
  const caseCard = byId('caseCard');

  function caseIsMobile() {
    return window.innerWidth <= 767;
  }

  function paintCase(index) {
    const data = caseData[index];
    const buttons = root.querySelectorAll('.case-tabs button');
    caseIndex = index;
    Array.prototype.forEach.call(buttons, function (button, buttonIndex) {
      const on = buttonIndex === index;
      button.classList.toggle('is-active', on);
      if (button.hasAttribute('aria-selected')) button.setAttribute('aria-selected', on ? 'true' : 'false');
    });
    caseCard.setAttribute('aria-labelledby', 'caseTab' + index);
    caseLabel.textContent = data.label;
    caseName.textContent = data.name;
    caseDesc.textContent = data.desc;
    // 数据口径未提供时整块隐藏，不显示空数字
    if (data.stat) {
      caseStat.textContent = data.stat;
      caseUnit.textContent = data.unit;
      caseStatLabel.textContent = data.statLabel;
    }
    caseStatBlock.style.display = data.stat ? '' : 'none';
    caseImage.src = data.image;
    caseImage.alt = data.name + '游戏画面';
    if (caseVeilImage) caseVeilImage.src = caseImage.src;
  }

  function selectCase(index) {
    if (index === caseIndex) return;
    const token = ++caseFadeToken;
    caseCard.classList.remove('is-entering');
    if (reduceMotion) {
      paintCase(index);
      return;
    }
    caseCard.classList.add('is-leaving');
    window.setTimeout(function () {
      if (token !== caseFadeToken) return;
      paintCase(index);
      caseCard.classList.remove('is-leaving');
      caseCard.classList.add('is-entering');
      window.requestAnimationFrame(function () {
        window.requestAnimationFrame(function () {
          if (token !== caseFadeToken) return;
          caseCard.classList.remove('is-entering');
        });
      });
    }, 350);
  }

  function stopCaseTimer() {
    window.clearInterval(caseTimer);
    caseTimer = undefined;
  }

  function startCaseTimer() {
    stopCaseTimer();
    if (reduceMotion || caseIsMobile()) return;
    caseTimer = window.setInterval(function () {
      selectCase((caseIndex + 1) % caseData.length);
    }, 7000);
  }

  each('.case-tabs button', function (button) {
    button.addEventListener('click', function () {
      selectCase(parseInt(button.getAttribute('data-case'), 10));
      stopCaseTimer();
      startCaseTimer();
    });
  });
  let caseResizeTick;
  let caseInView = false;
  listen(window, 'resize', function () {
    window.clearTimeout(caseResizeTick);
    if (!caseInView) return;
    caseResizeTick = window.setTimeout(startCaseTimer, 150);
  });
  const caseSection = root.querySelector('#cases');
  if (caseSection && 'IntersectionObserver' in window) {
    const caseObserver = new IntersectionObserver(
      function (entries) {
        caseInView = !!(entries[0] && entries[0].isIntersecting);
        if (caseInView) startCaseTimer();
        else stopCaseTimer();
      },
      { rootMargin: '160px 0px' },
    );
    caseObserver.observe(caseSection);
    cleanups.push(function () {
      caseObserver.disconnect();
    });
  } else {
    caseInView = true;
    startCaseTimer();
  }

  cleanups.push(function () {
    stopCaseTimer();
    window.clearTimeout(caseResizeTick);
  });
}
