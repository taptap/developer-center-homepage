## What changed

<!-- One sentence. Link the issue with "Closes #123". -->

## Scope

- [ ] Visual / copy
- [ ] Interaction / animation
- [ ] Responsive layout (state the viewport widths you checked)
- [ ] Analytics / network call (needs maintainer sign-off)
- [ ] Build / tooling
- [ ] Documentation

## Screenshots

<!-- Required for visual changes: before and after, desktop 1280 + mobile 390 -->

| Before | After |
| ------ | ----- |
|        |       |

## Checklist

- [ ] `pnpm format:check` passes
- [ ] `pnpm typecheck` passes
- [ ] `pnpm build` passes
- [ ] `pnpm build:release` and `node scripts/audit-dist.mjs --require-prerender` pass (when the template or styles changed)
- [ ] Checked on desktop (>= 1280) and mobile (390)
- [ ] No file listed under the README "Conventions" section was changed without prior discussion
- [ ] No `dist/`, `node_modules/` or scratch files in the diff

## Notes for reviewers

<!-- Anything reviewers should look at closely -->
