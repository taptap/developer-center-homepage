# AGENTS.md

## 命令

```bash
pnpm dev            # 本地开发
pnpm typecheck      # 类型检查，覆盖 .ts 与 .vue
pnpm build          # 构建到 dist/
pnpm build:release  # 构建 + 预渲染
pnpm audit:dist     # 产物检查
pnpm check:tracking # 埋点字段契约
```

## 约定

- **没有站内路由**：`main.ts` 只有 `createApp().mount()`，所有跳转都是整页 `<a href>`。
- **链接只从 `src/config/links.ts` 取**，不在模板里硬编码路径。
- **不要读 `location` 拼 URL**：预渲染会把当时的值固化进产物，跨站链接写常量。
- **`typescript` 留在 5.x**：`vue-tsc` 依赖 `typescript/lib/tsc`，7 没有这个入口。
- **`strict: true` 但 `noImplicitAny: false`**：`strictNullChecks` 要开（它抓的是真 bug），而行为代码来自 JS 迁移、`composables/context.ts` 刻意返回 `any`，打开 `noImplicitAny` 只是补注解（实测 99 处、零发现）。和 `apps/tds-dc` 上游一致。
- 跨目录 import 用 `@/`（`@` → `src`），同目录内才用相对路径。

## 检查

- 常规改动：`pnpm typecheck && pnpm build && pnpm audit:dist`
- 影响构建或预渲染：`pnpm build:release && node scripts/audit-dist.mjs --require-prerender`
- 提交前跑 `pnpm format`（CI 会检查 `format:check`）。
