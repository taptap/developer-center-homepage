import type { BehaviorContext } from './context';

export function useRhythm(ctx: BehaviorContext): void {
  const { root, cleanups, reduceMotion, each, byId, activateButtons } = ctx;
  each('.rhythm-switch button', function (button) {
    button.addEventListener('click', function () {
      const longMode = button.getAttribute('data-rhythm') === 'long';
      activateButtons('.rhythm-switch button', button);
      byId('rhythmLong').hidden = !longMode;
      byId('rhythmQuick').hidden = longMode;
      byId('rhythmLong').classList.toggle('rhythm-panel--active', longMode);
      byId('rhythmQuick').classList.toggle('rhythm-panel--active', !longMode);
      animateNotes(function () {
        byId('longNoteWrap').hidden = !longMode;
        byId('quickNoteWrap').hidden = longMode;
      });
    });
  });

  const longFlow = [
    [
      '预约期',
      '研发阶段接入技术服务，提高研发效率。建立游戏预约页，实现早期宣发，积累关注预约。上线时平台通知推送激活预约玩家，完成高效转化。',
      ['预约宣发页', '预约里程碑', '预约榜', '官方消息推送', '技术服务支持'],
    ],
    [
      '测试期',
      '多阶段、分群体测试，帮助开发者获取核心玩家、验证玩法，进一步提升游戏预约数和热度。',
      ['测试招募', '测试游戏核准', '数据分析', '评价反馈', 'TapTap 登录', '合规认证'],
    ],
    [
      '首发期',
      'TapTap 端内与微信服务号推送首发通知，全量激活预约玩家。配合今日游戏宣发，一举冲高首发数据。进而带动热门榜排名，获得更多曝光。',
      ['编辑推荐位', '上线通知', '今日游戏', '新品榜', '热门榜', '游戏多版本', '正版验证'],
    ],
    [
      '运营期',
      '签到、论坛抽奖等活动工具，保障高活跃留存。新版本专题、新版本上线通知，召回老玩家。创作者内容合作等经营手段，帮助游戏高性价比获客与增长。',
      ['新版本专题', '日常签到', '创作者合作', '资源置换', '推广平台', '广告联盟', '更新唤起'],
    ],
  ];
  const quickFlow = [
    [
      '一个想法 / 热梗',
      '一个热梗、一个玩法点子就能开工。做个 DEMO 就能扫码自测。',
      ['扫码自测', '自动化测试', '游戏服务'],
    ],
    [
      '快速小范围测试',
      '招募一小批玩家试玩，收集玩家的意见与反馈，也可以积攒第一批种子玩家。',
      ['测试招募', '评价反馈收集', '数据分析'],
    ],
    [
      '上架游戏',
      '正式发布游戏，靠平台推荐位和榜单拿到自然曝光。',
      ['编辑推荐位', '上线通知', '今日游戏', '新品榜', '热门榜'],
    ],
    [
      '收集反馈',
      '关注玩家在社区里的讨论和评价，积攒更新/下一款作品的开发经验。',
      ['内嵌社区', '游戏评价', '官方动态', '评论与攻略'],
    ],
    [
      '新一个作品',
      '根据游戏的玩家反馈，持续更新或是制作下一款游戏。',
      ['版本更新', '同厂商多游戏管理', '制作人员认证'],
    ],
  ];

  let notesTimer: number | undefined;
  function animateNotes(update) {
    const notes = root.querySelector('.rhythm-board__notes');
    if (!notes || reduceMotion) {
      if (notes) notes.style.height = 'auto';
      update();
      return;
    }
    notes.style.height = notes.offsetHeight + 'px';
    update();
    const next = notes.scrollHeight;
    window.requestAnimationFrame(function () {
      notes.style.height = next + 'px';
    });
    window.clearTimeout(notesTimer);
    notesTimer = window.setTimeout(function () {
      notes.style.height = 'auto';
    }, 320);
  }

  function fillCaps(container, tags) {
    if (!container) return;
    while (container.firstChild) container.removeChild(container.firstChild);
    tags.forEach(function (tag) {
      const span = document.createElement('span');
      span.textContent = tag;
      container.appendChild(span);
    });
  }

  function paintFlow(kind, index) {
    const steps = kind === 'long' ? longFlow : quickFlow;
    const data = steps[index];
    if (!data) return;
    each((kind === 'long' ? '#rhythmLong' : '#rhythmQuick') + ' .flow-node', function (node) {
      const nodeIndex = parseInt(node.getAttribute('data-index'), 10);
      node.classList.toggle('is-active', nodeIndex === index);
      node.classList.toggle('is-done', nodeIndex < index);
    });
    animateNotes(function () {
      byId(kind + 'Tag').textContent = '第 ' + (index + 1) + ' / ' + steps.length + ' 步';
      byId(kind + 'Title').textContent = data[0];
      byId(kind + 'Desc').textContent = data[1];
      fillCaps(byId(kind + 'Caps'), data[2]);
    });
    if (kind === 'quick') {
      const fill = byId('vibeFill');
      const circ = 2 * Math.PI * 177.382;
      // Circle stroke starts at 3 o'clock. Shift back 90deg so 0 is the top node,
      // then draw clockwise and stop on the current node (not one step past it).
      const visible = (circ * index) / steps.length;
      fill.style.strokeDasharray = visible + ' ' + (circ - visible);
      fill.style.strokeDashoffset = String(circ / 4);
    } else {
      const progress = byId('curveProgress');
      const marker = root.querySelector('#rhythmLong .flow-node[data-index="' + index + '"]');
      let at = marker ? parseFloat(marker.getAttribute('data-at')) : 0;
      if (!at) at = 0;
      progress.style.strokeDashoffset = String(100 - at);
      progress.classList.toggle('is-idle', at <= 0);
    }
  }

  each('.flow-node', function (node) {
    function selectNode() {
      paintFlow(node.getAttribute('data-flow'), parseInt(node.getAttribute('data-index'), 10));
    }
    node.addEventListener('mouseenter', selectNode);
    node.addEventListener('focus', selectNode);
    node.addEventListener('click', selectNode);
  });

  cleanups.push(function () {
    window.clearTimeout(notesTimer);
  });
}
