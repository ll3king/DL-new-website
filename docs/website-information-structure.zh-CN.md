# Website Information Structure

Last updated: 2026-06-24

## Purpose

This document defines the controlled information structure for the Dandy Lane Cafe website.

It exists to prevent future agents from scattering business facts across unrelated docs, old automation lanes, or external knowledge-base folders.

## Project Boundary

This file belongs to the Dandy Lane Cafe website repo.

Website-owned factual sources should live inside this repo when they are used to update:

- homepage positioning
- menu pages
- FAQ answers
- location / NAP content
- story content
- schema / structured data
- AEO / GEO / AI Search Optimization answer modules

Do not treat rowboat KB, booking retrospectives, SMS docs, or old AI-chat branches as the default source of truth for website facts unless the task explicitly says so.

## Source-Of-Truth Layers

### 1. Project Identity

Owner:

- project governance

Primary docs:

- [../README.md](../README.md)
- [project-current-overview-and-doc-governance.zh-CN.md](./project-current-overview-and-doc-governance.zh-CN.md)
- [feature-registry.md](./feature-registry.md)

Controlled facts:

- Dandy Lane is a Hobart CBD hidden-lane breakfast-to-brunch cafe.
- The project is governed by `AEO / GEO / AI Search Optimization` and `Visual Taste / Frontend / Performance`.
- The project should not be framed as a generic cafe, wedding business, event-styling business, or SEO-first project.

### 2. Menu Facts

Owner:

- website information structure

Primary doc:

- [menu/current-menu-source-2026-06-24.md](./menu/current-menu-source-2026-06-24.md)

Controlled facts:

- current food menu items
- current drink menu items
- visible prices
- dietary labels and surcharge notes
- source-backed menu anchors for future AEO / GEO updates

Rules:

- Do not duplicate full menu prices in multiple governance docs.
- Public menu, schema, FAQ, and story claims should check against the current menu source before publishing.
- If staff supplies a newer menu, create a new dated menu source and mark the older source as superseded rather than editing history without context.

### 3. Local Entity / NAP Facts

Owner:

- Search Optimization

Primary docs:

- [search-optimization-entry.zh-CN.md](./search-optimization-entry.zh-CN.md)
- [aeo/external-proof-consistency-report.md](./aeo/external-proof-consistency-report.md)

Controlled facts:

- business identity
- Hobart CBD / Collins Court / hidden-lane positioning
- location intent
- visible public contact and direction cues

Rules:

- Keep local intent clear and specific.
- Schema and structured data must match visible content.
- External citation requests must not invent or overstate facts.

### 4. Content / Stories

Owner:

- Content

Primary doc:

- [content-update-quick-entry.zh-CN.md](./content-update-quick-entry.zh-CN.md)

Controlled facts:

- story titles
- story copy
- story media
- publication-style content updates

Rules:

- Stories may support AEO / GEO answerability, but they should not become generic search pages.
- Food or drink mentions in stories should be checked against current menu facts when presented as current offerings.

### 5. Visual / Frontend Presentation

Owner:

- Visual Taste / Frontend / Performance

Primary docs:

- [flywheel-2-visual-taste-frontend-performance.md](./flywheel-2-visual-taste-frontend-performance.md)
- [../visual-knowledge-base/README.md](../visual-knowledge-base/README.md)

Controlled facts:

- page presentation
- visual hierarchy
- menu / FAQ / stories rendering
- mobile usability
- performance-sensitive frontend choices

Rules:

- Frontend may present menu facts, but it does not redefine them.
- Visual refresh should preserve current source-backed facts and avoid adding unsupported claims.

### 6. Booking / AI Chat / SMS

Owner:

- their own subsystem docs and implementation files

Rules:

- These are not the default website information source.
- Booking, AI chat, and SMS may use website facts, but they should not overwrite website-wide menu or identity governance.
- If those systems need menu facts for customer replies, they should refer back to the website menu source or a newer owner-approved source.

## AEO / GEO Use Rules

AEO / GEO / AI Search Optimization can use this information structure to answer questions such as:

- what Dandy Lane is
- where Dandy Lane is
- what kind of breakfast-to-brunch cafe it is
- what signature products or current menu categories are source-backed
- whether menu, FAQ, schema, and visible content are consistent

It should not use this structure to:

- create low-value AI-search pages
- bulk-expand generic content
- use SEO-first wording as the strategic narrative
- invent external proof

## Maintenance Checklist

- Keep business entity facts consistent.
- Keep current menu facts in one dated menu source.
- Keep menu/product anchors consistent across homepage, menu, FAQ, stories, and schema.
- Keep Hobart CBD / Collins Court / hidden-lane local intent clear.
- Keep schema / structured data aligned with visible content.
- Avoid generic content expansion.
- Avoid SEO-first wording.
- Avoid creating low-value AI-search pages.

## One-Line Rule

Website facts used for public content or AEO / GEO answerability must be governed inside the website repo first, with the current menu source as the controlled menu reference.
