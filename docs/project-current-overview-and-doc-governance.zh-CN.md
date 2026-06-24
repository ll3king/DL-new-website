# Project Current Overview And Doc Governance

Last updated: 2026-06-24

## Purpose

This is the current project governance entry for the Dandy Lane Cafe website.

It fixes four things:

- the real current project identity
- the active flywheels
- the official feature areas
- the direct documentation entrypoints
- the website-owned factual source boundaries
- the deprecated default memory that should not guide new work

Repository outer entry:

- [README.md](../README.md)

## Current Project Identity

Dandy Lane is a Hobart CBD hidden-lane breakfast-to-brunch cafe.

This website is not currently governed by a `Booking System`-first narrative.
Booking remains an important subsystem, but it is no longer the default project center.

The project is now governed by two flywheels:

1. `AEO / GEO / AI Search Optimization`
This is the future-facing search and answerability system.
Do not call the project an SEO project.
`SEO` is only infrastructure language for schema, robots, sitemap, redirects, and crawl surfaces.
Initial optimization completed and validated; this flywheel is now in maintenance mode.

2. `Visual Taste / Frontend / Performance`
This is the urgent active priority.
The website needs a major visual taste and frontend refresh.

## Active Workflow

Current design-and-build workflow:

`Stitch -> Codex via MCP -> repo implementation -> Taste / Impeccable visual QA -> performance QA`

This is the live workflow that should guide current frontend refresh work.

## Current Direct Entry Points

Core governance:

- [feature-registry.md](./feature-registry.md)
- [website-information-structure.zh-CN.md](./website-information-structure.zh-CN.md)
- [menu/current-menu-source-2026-06-24.md](./menu/current-menu-source-2026-06-24.md)
- [flywheel-2-visual-taste-frontend-performance.md](./flywheel-2-visual-taste-frontend-performance.md)
- [../visual-knowledge-base/README.md](../visual-knowledge-base/README.md)
- [project-module-code-boundary-map.zh-CN.md](./project-module-code-boundary-map.zh-CN.md)
- [project-governance-branch-and-doc-map.zh-CN.md](./project-governance-branch-and-doc-map.zh-CN.md)
- [project-governance-tree-map.zh-CN.md](./project-governance-tree-map.zh-CN.md)

Direct module entrypoints:

- [search-optimization-entry.zh-CN.md](./search-optimization-entry.zh-CN.md)
- [website-information-structure.zh-CN.md](./website-information-structure.zh-CN.md)
- [menu/current-menu-source-2026-06-24.md](./menu/current-menu-source-2026-06-24.md)
- [content-update-quick-entry.zh-CN.md](./content-update-quick-entry.zh-CN.md)

Historical references that are no longer entrypoints:

- [Knowledge.md](./Knowledge.md)
- [system_blueprint.md](./system_blueprint.md)
- booking retrospective docs
- branch postmortems that describe older execution phases

Deprecated-default assumptions:

- [deprecated-assumptions.md](./deprecated-assumptions.md)

## Deprecated Default Contexts

The following should not be treated as default project logic anymore:

- SEO-first narrative
- n8n workflows
- Google Sheets / Telegram automation as default project logic
- Gemini workflow
- Figma workflow
- wedding / event / styling examples
- release checks as the main project narrative

These can still exist as historical implementation traces, but they are deprecated as the default project memory.

## Current Practical Reading Order

1. Read [README.md](../README.md)
2. Read this file
3. Choose the flywheel or module that matches the task
4. Enter the correct boundary doc before touching code

If the task is search-facing and answerability-facing, go to:

- [search-optimization-entry.zh-CN.md](./search-optimization-entry.zh-CN.md)

If the task changes or validates website facts, especially menu items, prices, dietary notes, product anchors, FAQ claims, story claims, or schema-visible menu facts, go to:

- [website-information-structure.zh-CN.md](./website-information-structure.zh-CN.md)
- [menu/current-menu-source-2026-06-24.md](./menu/current-menu-source-2026-06-24.md)

Flywheel 1 should now be understood as:

- a standalone feature area
- strategic language = `AEO / GEO / AI Search Optimization`
- maintenance goal = factual consistency and answerability
- not a content-expansion lane
- not an SEO-first project frame

If the task is visual refresh, frontend taste, or performance, treat the website shell and frontend blocks as the primary working area and use the current Stitch-to-Codex workflow.

Before visual implementation, read:

1. [feature-registry.md](./feature-registry.md)
2. [flywheel-2-visual-taste-frontend-performance.md](./flywheel-2-visual-taste-frontend-performance.md)
3. [../visual-knowledge-base/README.md](../visual-knowledge-base/README.md)
4. [project-module-code-boundary-map.zh-CN.md](./project-module-code-boundary-map.zh-CN.md)

## One-Line Rule

Treat this project as a Dandy Lane website governed by `AEO / GEO / AI Search Optimization` plus `Visual Taste / Frontend / Performance`, with visual refresh as the current urgent priority.
