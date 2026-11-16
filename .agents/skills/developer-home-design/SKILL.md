---
name: developer-home-design
description: 约束 TapTap 开发者中心首页的设计系统建设。改这个单页的视觉、维护 DESIGN.md，或使用 impeccable 时加载。只允许按用户点名的阶段改对应区块；禁止因接入 skill 改动现有页面表现。不用于埋点、接口、构建配置等非界面任务。
---

# 开发者中心首页设计系统

这个 skill 管 `developer.taptap.cn` 这一个独立单页的设计系统。impeccable 是评审和打磨引擎，不是品牌，也不是组件库。

权威顺序：用户当前这句话 > `PRODUCT.md` > `DESIGN.md` > 本 skill > `.agents/skills/impeccable`。冲突时不要采用 impeccable 里「重做视觉世界」或「默认做得更大胆」的指令。

## 当前状态

没有完整的设计系统。`src/pages/DeveloperHome/styles/tokens.css` 只有颜色、阴影和容器宽度。字号、间距、圆角和组件都散落在 `src/pages/DeveloperHome/styles.css`。设计系统要随这一个单页的改造按阶段长出来，不能先造一套新外观再套回去。

接入 skill、阅读这些文件、运行 impeccable，本身都不是修改许可。未点名阶段时，不要改 `src/`、`public/`、`index.html`、构建配置、`package.json` 或 `AGENTS.md`。

## 阶段怎么做

用户点名一个区块（或明确说「先做共享基础」）后，那一次才算一个阶段：

1. 读 `PRODUCT.md`、`DESIGN.md` 和 [references/surfaces.md](references/surfaces.md) 里该区块的条目。
2. 只读 `.agents/skills/impeccable/SKILL.md` 和这一步真正要用的那一份 `reference/`。先跑它的 context 脚本；脚本失败就直接读现有的两份 markdown，不要另写一套上下文。
3. 只改该区块的 section、它在 `styles.css` 里的样式，以及为它新增的 token。其他区块的 DOM、文案、资源和样式保持不动。
4. 这一阶段真正定下来的 token 或组件，写回 `tokens.css` 和 `DESIGN.md`。不要平行再开一个 token 文件。
5. 默认只用 `critique`、`audit`、`polish`、`harden`、`clarify`、`adapt`、`typeset`、`layout`。`bolder`、`colorize`、`delight`、`overdrive`、`animate`、`extract` 必须用户在这一阶段点名。不要开 live，不要装 design hook，不要整页 `extract`。

共享基础（字号阶梯、颜色角色、可复用组件）只在用户要求做基础，或某个阶段确实需要时再加。还没开始的区块继续用现在的写法。

## 硬约束

- 全站只有这一页。跳转继续用 `<a href>`，地址只从 `src/config/links.ts` 取。不要读 `location` 拼 URL，不要加站内路由。
- 新代码按 Chrome 71 写。不要新增 `:focus-visible`、`backdrop-filter`、flex `gap`、`dvh`、`aspect-ratio`、`:has()`、`color-mix()`、`oklch()`、container queries、scroll-driven animations、`@layer`。页面里已有的超前写法不要再扩散。
- 中文文案、现有数据和案例数字没有用户明确要求就不能改，也不能补写没有来源的数据。
- 颜色以 `tokens.css` 里已经存在的变量为准。阶段里新出现的颜色先问，再写入 token。
