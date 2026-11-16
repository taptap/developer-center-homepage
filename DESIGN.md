---
name: TapTap 开发者中心首页
description: 现有单页的视觉基线。这不是一套完成的设计系统。
colors:
  ink: '#16181d'
  ink-soft: '#4f5663'
  muted: '#747c88'
  paper: '#f5f7fa'
  line: '#e5e9ee'
  line-soft: '#edf0f3'
  frame-line-light: 'rgba(223, 228, 234, 0.72)'
  frame-line-dark: 'rgba(255, 255, 255, 0.09)'
  navy: '#09092f'
  navy-blue: '#222740'
  mark-gray: '#d5dae2'
  purple: '#302594'
  teal: '#00d9c5'
  teal-dark: '#008f84'
---

# Design System: TapTap 开发者中心首页

## Overview

这是 `https://developer.taptap.cn/` 当前外观的基线，不是可以拿去生成新页面的成熟设计系统。

规范的视觉变量只有 `src/pages/DeveloperHome/styles/tokens.css` 里的颜色、三个阴影和 `--container: 1200px`。字号、行高、字重、间距、圆角和组件没有阶梯，也没有共享组件。它们写在 `src/pages/DeveloperHome/styles.css` 以及各个 section 里。

设计系统会跟这一页的改造同步、按阶段补齐。阶段规则在 `.agents/skills/developer-home-design/SKILL.md`。未点名的区块保持现在的表现，不要用这份文件当成重绘整页的许可。

下面 frontmatter 里的颜色是现在就要遵守的变量。正文里提到的字号、圆角和断点是现状盘点，不是新的规范。

## Colors

颜色只使用上面的变量。`styles.css` 里还有大量直接写死的颜色，那些是待收回的债务，不要把出现次数多的值升格成新 token。

`--block-hover-ink` 指向 `--purple`，`--block-hover-veil` 是白色 30% 透明。它们是交互别名，不是另一套主色。

teal 和 purple 都在页面里使用。没有规定谁是唯一主色。阶段里如果要定颜色角色，先改 `tokens.css`，再改这里，不要在区块里新写一个色值。

## Typography

正文栈是 `'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', Arial, sans-serif`，正文 16px，行高 1.6。图标使用 `src/assets/phosphor/` 的 Phosphor 字体。

没有字号阶梯。同一页里同时出现 10px 到 72px 的字号，字重还有 400、500、600、650、700、800。阶段内整理某个区块时，只收这个区块实际用到的级别，不要为了整齐给整页换一套字体或统一所有标题。

## Layout

内容宽度上限是 `--container: 1200px`。页面最小宽度 320px。`.home` 是滚动容器。

断点没有统一刻度，现有样式里同时出现 480、599、767、900、1100、1279 等宽度。新阶段不要再发明一个只服务单条规则的断点；需要响应式时，先沿用该区块已经在用的断点。

## Elevation & Depth

已有变量：

- `--shadow-sm: 0 10px 30px rgba(10, 12, 38, 0.07)`
- `--shadow-md: 0 24px 70px rgba(10, 12, 38, 0.12)`
- `--block-hover-shadow: 0 8px 20px rgba(22, 26, 48, 0.045)`

焦点环现在是白描边加深色外晕，写在 `styles.css`，不是 token。其他阴影仍是硬编码。

## Shapes

没有圆角规范。代码里同时有直角、8px、12px、16px、全圆和胶囊。阶段里不要把某种圆角推广成全页默认。

## Components

没有组件库。每个区块用自己的 class，不能跨区块复用。

| 区块                                                                    | 不要提前抽成组件的原因     |
| ----------------------------------------------------------------------- | -------------------------- |
| TopBar、SectionNav、Footer                                              | 只服务这一页的框架         |
| Hero、Ways、Publish、Ecosystem、Rhythm、Traffic、Cases、Community、Join | 结构和文案都是这一页专有的 |

按钮、输入框、卡片、标签都还不是共享组件。`extract` 只有在用户点名某个区块、并且同样的结构确实重复时才做。不要为了形成「设计系统」把 12 个区块一次抽完。

## Do's and Don'ts

### Do

- 改某个区块之前，先确认用户点了这个阶段。
- 新的颜色、阴影、宽度进入 `tokens.css`，并同步改这份文件的 frontmatter。
- 保留现有中文文案、案例数据和链接目标。
- 新样式按 Chrome 71 写。

### Don't

- 不要因为已经安装 impeccable 就重画未点名的区块。
- 不要新增第二套色板、字体或 token 文件。
- 不要把 `styles.css` 里的硬编码值批量替换成变量，除非那一行属于当前阶段。
- 不要打开 live 模式，不要把设计检查接进构建或 CI。
- 不要编造未出现在代码或文案里的组件、客户和数据。
