# Flywheel 2: Visual Taste / Frontend / Performance

Last updated: 2026-06-25

## Purpose

This document defines Flywheel 2 as an official feature area of the Dandy Lane Cafe website.

Flywheel 2 is not a cosmetic side task.
It is the current urgent project priority.

Latest accepted implementation learning:

- [Flywheel 2 Visual Refresh Retrospective 2026-06-25](./flywheel-2-visual-refresh-retrospective-2026-06-25.md)

## Business Role

Flywheel 2 exists to make the website feel:

- warmer
- more appetising
- more human
- more specific to Dandy Lane Cafe
- more visually tasteful

while protecting:

- speed
- mobile usability
- performance

## Core Product And Memory Anchors

Frontend work should strengthen these public / AEO menu and place anchors:

- `Wine-Infused Benedict`
  - branded hollandaise-led brunch anchor
- `Potato Parmesan Rosti`
  - branded savoury brunch anchor
- `Scotch Steak Sandwich`
  - hearty brunch-to-lunch anchor
- `Specialty Coffee`
  - daily repeat-visit anchor
- `hidden lane / Collins Court / Hobart CBD`
  - local discovery anchor

## Visual Principles

Design direction:

- appetite
- warmth
- handcrafted food
- specialty coffee ritual
- hidden-lane discovery
- breakfast-to-brunch rhythm
- mobile-first decision-making
- clear product memory
- clean but not sterile
- tasteful whitespace
- light intentional motion

Avoid:

- generic cafe template
- coffee bean icon clutter
- sticker overload
- fake rustic textures
- beige minimalism with no appetite
- SaaS landing page structure
- heavy animation
- wedding / event / luxury-service aesthetic
- decorative visuals that do not increase appetite, clarity, or memory

## Frontend Principles

- product-first homepage emphasis
- mobile CTA clarity before decorative flourish
- visuals should help people decide what to order or where to go
- layout should feel intentional, not template-like
- whitespace should improve appetite and reading rhythm
- motion should support emphasis, not distract from food, place, or booking actions

## Performance Guardrails

- protect `LCP`
- protect `INP`
- protect `CLS`
- avoid heavy animation libraries unless clearly justified
- optimize hero imagery
- lazy-load below-the-fold media
- prefer CSS `transform` and `opacity` for motion
- support reduced-motion preferences
- do not add decorative media that harms speed without improving memory or decision-making

Production media rule:

- desktop visuals may keep the richer approved source when performance is acceptable
- mobile visuals need their own delivery check
- autoplay video must have `muted`, `playsinline`, a mobile-sized source, a `poster`, and a playback fallback
- do not ship a video-only visual state that becomes an empty shape if autoplay fails

## Workflow

Official workflow:

`Stitch -> Codex via MCP -> repo implementation -> Taste / Impeccable visual QA -> performance QA`

Tooling rule:

- Stitch is the primary design exploration canvas
- Codex implements inside the repo
- MCP may be used to access Stitch design context
- Taste / Impeccable are critique layers
- Figma is not the default workflow
- Gemini is not part of the current workflow
- n8n / Google Sheets / Telegram workflows are deprecated historical context and should not be introduced here

## Visual Knowledge Base

Flywheel 2 now has a dedicated visual knowledge layer:

- [../visual-knowledge-base/README.md](../visual-knowledge-base/README.md)

This is where:

- real visual assets
- reusable signals
- shot grammar
- theme calling rules
- future visual workflows

should be governed.

Important:

- this is a Flywheel 2 subsystem
- it is not a new project root
- project entry still stays at the website governance layer first

Current Stitch exploration inputs:

- [flywheel-2-stitch-design-brief-v1.md](./flywheel-2-stitch-design-brief-v1.md)
- [flywheel-2-stitch-DESIGN-v1.md](./flywheel-2-stitch-DESIGN-v1.md)
- [flywheel-2-stitch-media-motion-pack-v1.md](./flywheel-2-stitch-media-motion-pack-v1.md)
- [flywheel-2-visual-refresh-retrospective-2026-06-25.md](./flywheel-2-visual-refresh-retrospective-2026-06-25.md)

The media motion pack is required for design exploration that should feel specifically like Dandy Lane.
Do not run Stitch from text-only instructions when the task is about visual taste.

Implementation learning:

- Stitch is useful for exploration, but production direction must be grounded in project-owned visual assets.
- For Dandy Lane, the strongest validated pattern is close appetising product focus plus one or two real place signals.
- Do not ask design tools to invent Dandy Lane from text alone.

## Visual QA Checklist

Before approving frontend work, check:

1. Does the page create appetite?
2. Does it feel like Dandy Lane, not a generic cafe?
3. Are Wine-Infused Benedict, Potato Parmesan Rosti, Steak Sandwich, Specialty Coffee, and hidden-lane location more memorable?
4. Is the mobile CTA clearer?
5. Is there unnecessary icon, sticker, or decorative clutter?
6. Does the page avoid SaaS-template structure?
7. Does motion feel intentional and light?
8. Does the design protect performance?
9. Does mobile show visual appetite before the guest loses attention?
10. Do nav, chat, CTA, and media all stay inside the real phone viewport?
11. If video is used, does it still produce a good visual state when autoplay fails?

## Execution Boundary

Flywheel 2 mainly operates through:

- `Website`

It may also use two narrow supporting lanes:

- `Content`
- small presentation-side support from `Search Optimization` only when needed for brand-positioning consistency

Flywheel 2 does not own:

- booking rules
- booking backend truth
- AI chat logic
- SMS gateway logic
- CRM or admin data systems
- Flywheel 1 expansion work

Typical editable files:

- `src/layouts/base.html`
- `src/assets/css/style.css`
- `src/assets/js/main.js`
- `src/blocks/identity-hero.html`
- `src/blocks/menu-grid.html`
- `src/blocks/faq-list.html`
- `src/blocks/story-list.html`
- `src/blocks/story-detail.html`

Use the formal boundary map before touching code:

- [project-module-code-boundary-map.zh-CN.md](./project-module-code-boundary-map.zh-CN.md)

## Active Implementation Zones

For actual Flywheel 2 implementation, the core movable zones are limited.

### 1. Website shell

Purpose:

- overall page frame
- shared visual system
- global rhythm, spacing, typography, motion feel
- mobile usability and performance feel

Main files:

- `src/layouts/base.html`
- `src/assets/css/style.css`
- `src/assets/js/main.js`

### 2. Homepage and core marketing surface

Purpose:

- first impression
- appetite and warmth
- brand memory
- product-led emphasis
- CTA clarity

Main files:

- `src/blocks/identity-hero.html`
- `src/blocks/signature-trio.html`
- `src/blocks/social-proof-reviews.html`

### 3. Menu / FAQ / Stories presentation layer

Purpose:

- help guests decide what to order
- make key products more memorable
- improve decision clarity without turning pages into generic content templates

Main files:

- `src/blocks/menu-grid.html`
- `src/blocks/faq-list.html`
- `src/blocks/story-list.html`
- `src/blocks/story-detail.html`

### 4. Media and performance layer

Purpose:

- hero image strategy
- media hierarchy
- below-the-fold media handling
- intentional lightweight motion
- mobile-first performance protection
- real visual asset selection and signal reuse through the visual knowledge base

Main files:

- `src/assets/media`
- image and media references used by homepage, menu, stories, and other presentation blocks
- `visual-knowledge-base`

Current production rule:

- every production video used in a visible presentation surface should have a desktop source, mobile source, and poster fallback
- filenames should change when important media changes are made, because long-lived asset caching can hide updates
- mobile media success is part of Flywheel 2 acceptance, not a separate optional performance pass

## Limited Supporting Zones

These are allowed only when they directly support Flywheel 2 presentation goals.

### 1. Content support

Allowed use:

- story ordering
- story framing
- media swaps

Typical files:

- `data/stories.yaml`

### 2. Search-facing presentation support

Allowed use:

- small brand-positioning or page-emphasis sync needed for the visible frontend

Typical files:

- `data/site.yaml`

This is not permission to reopen Flywheel 1.

## Explicit Non-Boundary Zones

Do not enter these zones during Flywheel 2 implementation unless the task scope is explicitly expanded:

- `functions/api/_booking.js`
- `functions/api/bookings.js`
- `functions/api/admin/bookings.js`
- `functions/api/janitor.js`
- `functions/api/chat.js`
- `functions/api/sms/*`

## Practical Priority Groups

To keep implementation focused, Flywheel 2 should be read in four practical groups:

1. `Global frontend skeleton`
2. `Homepage and main narrative modules`
3. `Menu / FAQ / Stories presentation`
4. `Media and performance execution`

These are the real active work surfaces.
Everything else is secondary or out of boundary by default.

## Non-Goals

- do not redesign the whole site inside governance work
- do not expand Flywheel 1 during this phase by default
- do not introduce Figma as the default workflow
- do not introduce Gemini workflows
- do not introduce n8n as website project logic
- do not drift into wedding, event, or luxury-service visual references

## Acceptance Criteria

- Flywheel 2 is treated as an official feature area
- Flywheel 2 is clearly marked as the current urgent priority
- future frontend work has a clear Stitch-to-Codex workflow
- visual QA standards are explicit
- performance guardrails are explicit
- future agents can route frontend work here before implementation
