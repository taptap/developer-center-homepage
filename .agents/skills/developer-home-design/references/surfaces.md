# 页面与阶段

线上只有一个页面：`https://developer.taptap.cn/`。`src/main.ts` 把 `src/App.vue` 挂到 `#app`，`App.vue` 只渲染 `src/pages/DeveloperHome/index.vue`。下面的区块是同一页里的锚点，不是路由。

阶段状态：都还没开始。用户点名之前，不要改对应源文件。

| 顺序 | 区块       | 锚点         | 导航名     | 源文件                                            | 阶段   |
| ---- | ---------- | ------------ | ---------- | ------------------------------------------------- | ------ |
| 1    | TopBar     | 无           | 无         | `src/pages/DeveloperHome/sections/TopBar.vue`     | 未开始 |
| 2    | Hero       | `#top`       | 无         | `src/pages/DeveloperHome/sections/Hero.vue`       | 未开始 |
| 3    | SectionNav | 无           | 无         | `src/pages/DeveloperHome/sections/SectionNav.vue` | 未开始 |
| 4    | Ways       | `#ways`      | 游戏类型   | `src/pages/DeveloperHome/sections/Ways.vue`       | 未开始 |
| 5    | Publish    | `#publish`   | 如何上架   | `src/pages/DeveloperHome/sections/Publish.vue`    | 未开始 |
| 6    | Ecosystem  | `#ecosystem` | 生态能力   | `src/pages/DeveloperHome/sections/Ecosystem.vue`  | 未开始 |
| 7    | Rhythm     | `#rhythm`    | 发行节奏   | `src/pages/DeveloperHome/sections/Rhythm.vue`     | 未开始 |
| 8    | Traffic    | `#traffic`   | 流量与曝光 | `src/pages/DeveloperHome/sections/Traffic.vue`    | 未开始 |
| 9    | Cases      | `#cases`     | 合作案例   | `src/pages/DeveloperHome/sections/Cases.vue`      | 未开始 |
| 10   | Community  | `#community` | 无         | `src/pages/DeveloperHome/sections/Community.vue`  | 未开始 |
| 11   | Join       | `#join`      | 无         | `src/pages/DeveloperHome/sections/Join.vue`       | 未开始 |
| 12   | Footer     | 无           | 无         | `src/pages/DeveloperHome/sections/Footer.vue`     | 未开始 |

区块外还有跳过链接，以及 `App.vue` 的 `.home` 滚动容器。样式入口是 `tokens.css`、`base.css`、`styles.css` 和 `src/assets/phosphor/icons.css`。

控制台、文档、CLI、登录等地址都离开这一页，由 `src/config/links.ts` 指向其他应用。那些应用不在本仓库，也不在这套设计系统里。
