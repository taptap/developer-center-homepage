# developer-center-homepage

TapTap 开发者中心首页（<https://developer.taptap.cn/>）的源码：一个 Vue 3 + Vite 的静态落地页。

## 开发

需要 Node.js 24+ 与 pnpm 12。

```bash
corepack enable
pnpm install
pnpm dev      # http://localhost:5173
```

| 命令                                | 说明           |
| ----------------------------------- | -------------- |
| `pnpm dev`                          | 本地开发       |
| `pnpm build`                        | 构建到 `dist/` |
| `pnpm build:release`                | 构建 + 预渲染  |
| `pnpm typecheck`                    | 类型检查       |
| `pnpm format` / `pnpm format:check` | 格式化 / 校验  |
| `pnpm audit:dist`                   | 检查构建产物   |
