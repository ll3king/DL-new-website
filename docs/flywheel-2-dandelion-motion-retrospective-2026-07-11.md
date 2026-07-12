# Flywheel 2 Dandelion Motion Retrospective 2026-07-11

## Purpose

本文记录蒲公英粒子动效从 ChatGPT Sites 第 6 版迁移到 Dandy Lane 正式网站的过程、生产结论和后续治理规则。

它属于 `Flywheel 2: Visual Taste / Frontend / Performance`，不是独立项目，也不改变 Flywheel 1、Booking、AI Chat 或 SMS 的边界。

## Production Status

- owner 已验收 Sites 第 6 版的蒲公英种子方向
- 正式实现已提交 GitHub `main`
- production commit: `e194533` (`Add optimized dandelion particle effect`)
- Cloudflare Pages 已从 `main` 完成生产部署
- production domain: `https://dandylanecafe.com`
- 桌面端和移动端均已验证动效加载、持续运行和视口安全

## Source Of Truth And Tool Roles

本次工作确认以下责任链：

1. ChatGPT Sites / Work 可以用于视觉探索、原型迭代和效果验收。
2. Sites 中的状态不会自动成为正式网站源码，也不能替代 Git 历史。
3. 正式实现必须迁移到本 repo 的 `src` 源码层。
4. GitHub `main` 是正式版本的代码来源。
5. Cloudflare Pages 从 `main` 构建并发布生产网站。

因此，Codex 与 ChatGPT Work / Sites 可以在同一网站目标上接力迭代，但必须通过明确的源码、资源、版本和验证交接来同步，不能假设两个工具共享未提交状态。

## Implementation Boundary

Primary owner:

- `Website`

Files added or changed:

- `src/layouts/base.html`
- `src/assets/css/dandelion-motion.css`
- `src/assets/js/dandelion-motion.js`
- `src/assets/media/dandelion-seed-sharp.webp`
- `src/assets/media/dandelion-seed-soft.webp`

Intentionally not touched:

- booking rules or booking backend
- AI chat behavior
- SMS gateway
- CRM / admin systems
- Flywheel 1 expansion

## Accepted Visual And Performance Pattern

The accepted production behavior is:

- one fixed, pointer-transparent canvas shared through the base layout
- sharp and soft WebP seed sprites instead of an animation library
- slightly denser desktop field with smaller, softer incremental seeds
- bounded mobile density so motion remains present without dominating food or CTA content
- desktop pointer interaction retained
- reduced-motion preference supported
- animation stops for hidden pages and restarts when the page becomes visible

Performance limits in the accepted implementation:

- desktop maximum: 42 seeds
- mobile maximum: 18 seeds
- desktop device-pixel-ratio cap: 1.75
- mobile device-pixel-ratio cap: 1.1
- desktop idle paint target: 50 FPS
- mobile paint target: 30 FPS
- no third-party animation dependency

These values are the current production baseline. Future changes require visual and performance revalidation rather than density increases by intuition alone.

## Verification Evidence

Pre-deploy verification included:

- production generator build
- JavaScript syntax check
- Git diff whitespace check
- desktop viewport review at 1440 x 900
- mobile viewport review at 390 x 844
- no horizontal overflow
- animation continuity confirmed by changing frame hashes

Post-deploy verification included:

- production CSS and JavaScript assets loaded from `dandylanecafe.com`
- `canvas.dandelion-motion` present on the live page
- mobile viewport remained inside 390 x 844
- no browser console warnings or errors
- animation continued between captured frames

QA tooling note:

- rapid automated screenshots can race an actively repainting transparent canvas and capture transient compositor blocks
- a capture artifact is not enough to declare a production visual regression
- when screenshot evidence is required, use a normal single-frame review or pause the animation before capture, then separately verify that animation resumes
- any user-visible black block or flicker reproduced outside capture tooling is still a release blocker

## Governance Decisions

1. The dandelion effect is now an accepted Flywheel 2 production baseline.
2. Its source files belong to the `Website` shell and media/performance boundary.
3. The effect must remain decorative: `pointer-events: none`, no CTA obstruction, no layout ownership.
4. Mobile performance limits are part of the visual specification, not a later optimization task.
5. `prefers-reduced-motion`, hidden-tab suspension and page lifecycle handling are mandatory.
6. Sites remains an exploration and handoff surface; GitHub `main` remains production truth.
7. A formal release is complete only after GitHub push, Cloudflare deployment and live-domain verification.

## Future Change Checklist

Before changing the particle effect:

1. Confirm the task belongs to Flywheel 2 / Website.
2. Start from the current `main` implementation, not a stale Sites draft.
3. Keep particle density, DPR and frame-rate limits explicit.
4. Verify desktop and mobile separately.
5. Check reduced motion, hidden-tab behavior and pointer safety.
6. Run the production build and syntax checks.
7. Verify the Cloudflare production domain after deployment.
8. Update this retrospective only when the accepted baseline actually changes.

## Related Documents

- [Project Current Overview And Doc Governance](./project-current-overview-and-doc-governance.zh-CN.md)
- [Flywheel 2: Visual Taste / Frontend / Performance](./flywheel-2-visual-taste-frontend-performance.md)
- [Flywheel 2 Visual Refresh Retrospective 2026-06-25](./flywheel-2-visual-refresh-retrospective-2026-06-25.md)
- [Feature Registry](./feature-registry.md)
- [Project Module Code Boundary Map](./project-module-code-boundary-map.zh-CN.md)
- [Project Governance Branch And Doc Map](./project-governance-branch-and-doc-map.zh-CN.md)
