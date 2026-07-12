# Project Governance Branch And Doc Map

Last updated: 2026-07-12

## Purpose

This file keeps historical branches and older document families in the correct place.

It does not define the live project narrative.

Live governance entry:

- [project-current-overview-and-doc-governance.zh-CN.md](./project-current-overview-and-doc-governance.zh-CN.md)

## Current Rule

Historical branches may explain where systems came from.
They do not decide what the website is now.

Current project identity is governed by:

- Dandy Lane as a Hobart CBD hidden-lane breakfast-to-brunch cafe
- Flywheel 1: `AEO / GEO / AI Search Optimization`
- Flywheel 2: `Visual Taste / Frontend / Performance`

Official Flywheel 2 governance doc:

- [flywheel-2-visual-taste-frontend-performance.md](./flywheel-2-visual-taste-frontend-performance.md)

Latest accepted motion release record:

- [flywheel-2-dandelion-motion-retrospective-2026-07-11.md](./flywheel-2-dandelion-motion-retrospective-2026-07-11.md)

## Production Source Of Truth And Release Path

Current formal production source:

- GitHub `main`

Current production delivery:

- Cloudflare Pages builds and deploys from `main`

Tool boundary:

- ChatGPT Sites / Work may be used for visual exploration, prototype iteration, and owner review
- Codex may inspect, port, implement, validate, and publish the approved result
- Sites state and repo state are not automatically synchronized
- approved work becomes formal only after it exists in repo source, is committed to `main`, and is verified on the production domain

Current accepted release example:

- `e194533` - optimized dandelion particle effect

This release path is current governance, not a historical branch convention.

## Historical Branch Map

### Booking System historical line

- `feature/booking-rules-admin-upgrade`
- `feature/email-confirmation-verification`

Status:

- still important as booking subsystem history
- not the default project entry anymore

### Historical AI / SMS branch lines

- `feature/ai-brain-upgrade`
- `feature/sms-booking-gateway`

Status:

- retain as historical implementation lines
- do not use them as default project framing
- do not let them redefine the current website governance

### Historical search branch line

- `ai-feature/aeo-geo-optimization`

Status:

- should be understood as part of the modern `Search Optimization` lane
- do not reduce it to an SEO-only branch concept

### Historical experiment and redirection lines

- `ai-feature/booking-redirection-manual-alert`
- older content-only or test branches

Status:

- historical reference only
- not active governance anchors

## Deprecated Default Contexts

Deprecated default memory is governed at the project-entry layer:

- [project-current-overview-and-doc-governance.zh-CN.md](./project-current-overview-and-doc-governance.zh-CN.md)

## Active Workflow Reminder

For current frontend and design work, the active workflow is:

`Stitch -> Codex via MCP -> repo implementation -> Taste / Impeccable visual QA -> performance QA`

This belongs to the current website governance layer, not to historical branch logic.

## One-Line Rule

Use this file to understand history, not to inherit outdated defaults.
