import { LINKS } from '@/config/links';

/**
 * Capability cards of the ecosystem section.
 *
 * The grid and the expanded panel both read from this list, so copy and links never drift
 * apart.
 *
 * When swapping content:
 * - `caseName` renders as the badge on the case image; the image itself is a 16:9 asset
 *   resolved in `sections/Ecosystem.vue` (crops anything else)
 * - `accessMode` is one of AI 自动接入 / 接入 SDK / 接入小游戏 API
 * - `casePoints` lists what that game actually uses, one line each
 * - `codeSample` is either the prompt handed to an AI assistant or a minimal snippet
 *   taken from the official docs
 */
export interface EcoCasePoint {
  title: string;
  desc: string;
}

export interface EcoService {
  key: string;
  name: string;
  icon: string;
  glyph: string;
  desc: string;
  introHref: string;
  caseName: string;
  accessMode: string;
  casePoints: EcoCasePoint[];
  codeSample: string;
}

export const ECOSYSTEM_SERVICES: EcoService[] = [
  {
    key: 'cloud-save',
    name: '云存档',
    icon: 'cloud',
    glyph: 'ph-cloud',
    desc: '玩家的进度跟着账号走，换手机、换电脑都能接着玩。',
    introHref: LINKS.docsCloudSave,
    caseName: '心动的公寓',
    accessMode: 'AI 自动接入',
    casePoints: [
      { title: '自动保存', desc: '关键节点自动存档' },
      { title: '手动存档', desc: '支持随时手动存档' },
      { title: '存档管理', desc: '多存档备份切换' },
    ],
    codeSample: [
      '// 提示词示例：直接贴给 AI 助手',
      '在 Unity 项目里接入 TapTap 云存档：',
      '1. 关键节点自动存档',
      '2. 玩家手动存档 / 读档',
      '3. 多存档位切换与备份',
      '参考 TapTap 云存档官方文档',
    ].join('\n'),
  },
  {
    key: 'iap',
    name: '变现能力',
    icon: 'pay',
    glyph: 'ph-credit-card',
    desc: '广告变现与内购支付打包集成，一次接入即可解锁主流变现方式。',
    introHref: LINKS.docsIap,
    caseName: '翡翠经营模拟器',
    accessMode: 'AI 自动接入',
    casePoints: [
      { title: '道具购买', desc: '看广告获取游戏道具' },
      { title: '奖励翻倍', desc: '看广告收益翻倍' },
    ],
    codeSample: [
      '// 提示词示例：直接贴给 AI 助手',
      '在 Unity 项目里接入 TapTap 广告变现：',
      '1. 看广告获取游戏道具',
      '2. 看广告收益翻倍',
      '参考 TapTap 变现能力官方文档',
    ].join('\n'),
  },
  {
    key: 'achievement',
    name: '游戏成就',
    icon: 'award',
    glyph: 'ph-medal',
    desc: '成就数据全托管，无需服务端即可获取全服解锁进度、白金成就等各项能力。',
    introHref: LINKS.docsAchievement,
    caseName: '泰拉瑞亚',
    accessMode: '接入 SDK',
    casePoints: [
      { title: '成就列表', desc: '展示图标与名称' },
      { title: '隐藏成就', desc: '达成前不显示名称' },
      { title: '白金成就', desc: '集齐全部成就解锁' },
    ],
    codeSample: [
      'using TapSDK.Achievement;',
      '',
      '// 隐藏 / 白金成就在后台配置',
      'TapTapAchievement.Unlock("hidden_1");',
      'TapTapAchievement.Unlock("platinum");',
      'TapTapAchievement.ShowAchievements();',
    ].join('\n'),
  },
  {
    key: 'leaderboard',
    name: '排行榜',
    icon: 'rank',
    glyph: 'ph-chart-bar',
    desc: '好友榜、全服榜开箱可用，平台更提供完善的排名规则配置与反作弊能力。',
    introHref: LINKS.docsLeaderboard,
    caseName: '弹弹法师',
    accessMode: '接入小游戏 API',
    casePoints: [
      { title: '多榜单', desc: '总分、伤害、抗伤、波次' },
      { title: '好友榜单', desc: '看好友之间的排名' },
      { title: '周期榜单', desc: '周榜等按周期重置' },
    ],
    codeSample: [
      'const lb = tap.getLeaderboardManager();',
      "const id = 'rank1';",
      '',
      '// 好友榜：collection = friends',
      '// 周榜：后台配置重置周期',
      'lb.openLeaderboard({',
      '  leaderboardId: id,',
      "  collection: 'friends'",
      '});',
    ].join('\n'),
  },
  {
    key: 'tap-login',
    name: 'TapTap 登录',
    icon: 'account',
    glyph: 'ph-user',
    desc: '玩家用 TapTap 账号直接登录，不用重新注册；老玩家的社交关系也能带进游戏。',
    introHref: LINKS.docsTapLogin,
    caseName: '小生活',
    accessMode: '接入 SDK',
    casePoints: [
      { title: '一键登录', desc: '账号直接登录' },
      { title: '资料透传', desc: '昵称与头像' },
      { title: '好友关系', desc: '好友关系带入' },
      { title: '防沉迷', desc: '成年状态校验' },
    ],
    codeSample: [
      'using TapSDK.Login;',
      'using static TapSDK.Login.TapTapLogin;',
      '',
      'var scopes = new[] {',
      '  TAP_LOGIN_SCOPE_PUBLIC_PROFILE',
      '};',
      'var account = await TapTapLogin.Instance',
      '  .LoginWithScopes(scopes);',
    ].join('\n'),
  },
  {
    key: 'embedded-moments',
    name: '内嵌动态',
    icon: 'community',
    glyph: 'ph-chat-circle',
    desc: '把 TapTap 社区嵌进游戏，玩家不用切出去就能查攻略、和其他玩家一同讨论。',
    introHref: LINKS.docsEmbeddedMoments,
    caseName: '派对之星',
    accessMode: '接入 SDK',
    casePoints: [
      { title: '社区板块', desc: '官方、问答、精华、视频' },
      { title: '内容入口', desc: '攻略、公告直达' },
      { title: '帖子互动', desc: '图文视频点赞评论' },
    ],
    codeSample: [
      'using TapSDK.Moment;',
      '',
      'TapTapMoment.open();',
      'TapTapMoment.OpenScene("scene_1");',
      'TapTapMoment.Publish(publishData);',
    ].join('\n'),
  },
];
