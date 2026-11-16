# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

访问 `https://developer.taptap.cn/` 的游戏开发者。他们在这一页了解 TapTap 的发行服务，并决定是否进入控制台、文档或其他站外页面。已登录时顶栏会显示用户信息；这个状态来自现有接口，不是新的用户类型。

## Product Purpose

这是 TapTap 开发者中心的公开首页，一个独立单页。页面自己的主张是「为全球开发者提供专业的游戏发行服务」。成功标准是开发者能看懂如何上架、有哪些生态和流量，并离开这一页去办理下一步。

本仓库现在不重建信息架构。设计系统跟着这一页的改造按阶段完成。

## Positioning

页面把发行服务、上架路径、生态能力、发行节奏、自然流量和合作案例放在同一页里讲完。具体功能不在本仓库实现，只从这里链出去。

## Operating Context

生产环境是 `https://developer.taptap.cn/`。本地用 `pnpm dev`。构建可以预渲染；预渲染会把当时算出来的 URL 固化进产物，所以链接必须使用 `src/config/links.ts` 里的常量。

## Capabilities and Constraints

- 仓库只有这一页。`src/main.ts` 挂载 `App`，没有站内路由。区块之间用页内锚点。
- 所有跳转都是整页 `<a href>`。地址只从 `src/config/links.ts` 取，不读取 `location` 来拼接。
- 新代码保持 Chrome 71 可运行。不要因为设计工具建议就引入更新的 CSS。
- 现有页面表现是基线。安装 skill、编写 `PRODUCT.md` / `DESIGN.md`、加载 impeccable，都不允许顺手改视觉、文案、交互或构建结果。
- 设计系统尚未成形。后续只按用户点名的区块推进；未点名的区块保持现在的 DOM、样式和资源。
- 尚未决定：第一阶段做哪个区块，以及共享字号、组件是否单独开一阶段。没有决定之前不要假设。

## Brand Commitments

名称是 TapTap 开发者中心。正文语言是中文。标志和图片在 `src/assets/`。没有批准新的视觉方向；在某个阶段被明确要求之前，沿用现在的外观。

## Evidence on Hand

- 页面结构：`src/pages/DeveloperHome/index.vue` 和 `sections/`。区块清单见 `.agents/skills/developer-home-design/references/surfaces.md`。
- 仅有的设计变量：`src/pages/DeveloperHome/styles/tokens.css`。
- 未系统化的样式：`src/pages/DeveloperHome/styles.css`。
- 案例、生态和流量内容已经写在对应 section 里。不要编造下载量、客户或功能。

## Product Principles

- 这一页先讲清楚发行服务，再把人送到控制台、文档或其他产品。
- 设计系统是这一页改造的产物，不单独超前替换整页。
- 没有来源的数据、承诺和视觉方向都不补写。
- 现有行为（登录态顶栏、页内导航、预渲染链接）在对应阶段被点名之前保持原样。

## Accessibility & Inclusion

页面已有跳到主要内容的链接、键盘焦点环，以及 `prefers-reduced-motion` 处理。没有另定无障碍达标等级。后续阶段保留这些行为，不要为了视觉效果拿掉。
