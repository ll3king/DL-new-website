# Feature Registry

Last updated: 2026-06-24

## Purpose

This file is the official feature-area registry for the Dandy Lane Cafe website.

It exists so future agents can distinguish:

- project-level flywheels
- active priority
- execution ownership
- website-owned factual source boundaries
- non-default historical assumptions

## Official Feature Areas

### 1. Flywheel 1: AEO / GEO / AI Search Optimization

Status:

- active
- Initial optimization completed and validated; maintain factual consistency and answerability.
- maintenance mode
- not the main expansion target in this phase

Business role:

- future-facing search answerability
- entity clarity
- machine-readable trust and discovery

Current public / AEO business context anchors:

- Wine-Infused Benedict
- Potato Parmesan Rosti
- Scotch Steak Sandwich
- Specialty Coffee
- breakfast-to-brunch
- hidden lane / Collins Court / Hobart CBD

Menu source-name mapping:

- `Wine-Infused Benedict` maps to current source item `Egg Benedict`.
- `Potato Parmesan Rosti` maps to current source item `Dandy Rosti`.
- Use the public / AEO name for guest-facing copy and answerability.
- Use the source item for price validation and structured-data accuracy.

Maintenance checklist:

- keep business entity facts consistent
- keep menu / product anchors consistent with [menu/current-menu-source-2026-06-24.md](./menu/current-menu-source-2026-06-24.md) unless a newer owner-approved menu source exists
- keep local intent clear
- keep schema / structured data aligned with visible content
- avoid generic content expansion
- avoid SEO-first wording
- avoid creating low-value AI-search pages

Primary execution lane:

- `Search Optimization`

Primary entry:

- [search-optimization-entry.zh-CN.md](./search-optimization-entry.zh-CN.md)

Website factual source boundary:

- [website-information-structure.zh-CN.md](./website-information-structure.zh-CN.md)
- [menu/current-menu-source-2026-06-24.md](./menu/current-menu-source-2026-06-24.md)

Acceptance standard:

- [aeo/aeo-geo-acceptance-standard.md](./aeo/aeo-geo-acceptance-standard.md)

Strict reviewer:

- [aeo/flywheel-1-strict-reviewer-agent.md](./aeo/flywheel-1-strict-reviewer-agent.md)
- [aeo/flywheel-1-review-2026-06-25.md](./aeo/flywheel-1-review-2026-06-25.md)
- [aeo/cloudflare-ai-crawler-policy.md](./aeo/cloudflare-ai-crawler-policy.md)
- [aeo/external-proof-evidence-log.md](./aeo/external-proof-evidence-log.md)

Agent swarm control plan:

- [aeo/geo-agent-swarm-control-plan.md](./aeo/geo-agent-swarm-control-plan.md)

External signal build playbook:

- [aeo/external-signal-build-playbook.md](./aeo/external-signal-build-playbook.md)

### 2. Flywheel 2: Visual Taste / Frontend / Performance

Status:

- active
- official core feature area
- current urgent priority

Business role:

- make the website feel warmer, more appetising, more human, and more specific to Dandy Lane Cafe
- strengthen product memory and local discovery memory
- improve mobile-first decision-making without harming performance

Core implementation boundary:

- global frontend skeleton
- homepage and main narrative modules
- menu / FAQ / stories presentation
- media and performance execution

Primary execution lane:

- `Website`

Supporting execution lanes:

- `Content`
- narrow `Search Optimization` support only when needed for search-facing presentation consistency

Primary entry:

- [flywheel-2-visual-taste-frontend-performance.md](./flywheel-2-visual-taste-frontend-performance.md)

Derived visual-asset and signal entry:

- [../visual-knowledge-base/README.md](../visual-knowledge-base/README.md)

## Project Rule

The website is now governed by a two-flywheel system.

This means:

- Flywheel 1 is the search and answerability driver
- Flywheel 2 is the visual taste, frontend quality, and performance driver

Current urgency belongs to Flywheel 2.

Naming rule:

- use `AEO / GEO / AI Search Optimization` as the strategic language
- replace `SEO optimization` with `AEO / GEO / AI Search Optimization`
- `SEO` may only appear when describing technical infrastructure, not strategic direction

## Related Governance

- [project-current-overview-and-doc-governance.zh-CN.md](./project-current-overview-and-doc-governance.zh-CN.md)
- [website-information-structure.zh-CN.md](./website-information-structure.zh-CN.md)
- [project-module-code-boundary-map.zh-CN.md](./project-module-code-boundary-map.zh-CN.md)
- [deprecated-assumptions.md](./deprecated-assumptions.md)
