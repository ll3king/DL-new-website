# Flywheel 2: Visual Taste / Frontend / Performance

Last updated: 2026-06-16

## Purpose

This document defines Flywheel 2 as an official feature area of the Dandy Lane Cafe website.

Flywheel 2 is not a cosmetic side task.
It is the current urgent project priority.

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

Frontend work should strengthen these anchors:

- `Wine-Infused Benedict`
  - primary brunch memory anchor
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

## Visual QA Checklist

Before approving frontend work, check:

1. Does the page create appetite?
2. Does it feel like Dandy Lane, not a generic cafe?
3. Are Benedict, Steak Sandwich, Specialty Coffee, and hidden-lane location more memorable?
4. Is the mobile CTA clearer?
5. Is there unnecessary icon, sticker, or decorative clutter?
6. Does the page avoid SaaS-template structure?
7. Does motion feel intentional and light?
8. Does the design protect performance?

## Execution Boundary

Flywheel 2 mainly operates through:

- `Website`

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
