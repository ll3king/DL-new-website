# Project Module Code Boundary Map

Last updated: 2026-06-16

## Purpose

This document fixes three things:

- the current working modules
- the code boundaries each module is allowed to touch
- the layer where current project rules should be interpreted

This file is about boundaries, not project history.

Project governance entry:

- [project-current-overview-and-doc-governance.zh-CN.md](./project-current-overview-and-doc-governance.zh-CN.md)

## Interpretation Order

When updating this website:

1. read the repository and governance entry first
2. identify which flywheel or module owns the task
3. only then enter the allowed code boundary

Important:

- project identity and default narrative belong to `README.md` and `project-current-overview-and-doc-governance`
- active frontend urgency belongs to `Website`
- future-facing search answerability belongs to `Search Optimization`
- historical branch logic belongs to `project-governance-branch-and-doc-map`

## Quick Routing Table

Use this table before touching code.

For any frontend-facing task, read this first:

- [flywheel-2-visual-taste-frontend-performance.md](./flywheel-2-visual-taste-frontend-performance.md)

### 1. Homepage positioning / visual refresh / UX polish / performance feel

Owner:

- `Website`

Required pre-read:

- `flywheel-2-visual-taste-frontend-performance.md`

Typical files:

- `src/layouts/base.html`
- `src/assets/css/style.css`
- `src/assets/js/main.js`
- `src/blocks/identity-hero.html`
- other homepage and shared frontend blocks

Do not expand into by default:

- booking backend
- chat routing
- SMS routing

### 2. Schema / canonical / entity proof / robots / sitemap / answerability

Owner:

- `Search Optimization`

Typical files:

- `data/site.yaml`
- `scripts/generate.js`
- `public/robots.txt`
- `public/sitemap.xml`
- `public/_redirects`
- `public/_headers`

Allowed narrow cross-over:

- FAQ and story answerability reinforcement

### 3. Story copy / image swap / story ordering / post refresh

Owner:

- `Content`

Typical files:

- `data/stories.yaml`
- `src/blocks/story-list.html`
- `src/blocks/story-detail.html`
- `src/assets/media`

Do not expand into by default:

- booking rules
- search infrastructure

### 4. Booking form / booking admin / booking rules / duplicate handling

Owner:

- `Booking System`

Typical files:

- `functions/api/_booking.js`
- `functions/api/bookings.js`
- `functions/api/admin/bookings.js`
- `functions/api/janitor.js`
- `src/blocks/booking-form.html`
- `src/blocks/admin-bookings.html`

Do not expand into by default:

- homepage visual system
- stories positioning
- SMS entry logic

### 5. Website assistant conversation behavior

Owner:

- `AI Chat`

Typical files:

- `functions/api/chat.js`
- `src/blocks/chatbot-widget.html`

Do not expand into by default:

- booking table truth
- website shell redesign

### 6. SMS inbound / gateway / thread continuation

Owner:

- `SMS`

Typical files:

- `functions/api/sms/inbound.js`
- `functions/api/sms/telerivet-inbound.js`
- `functions/api/sms/telerivet-sample.js`

Do not expand into by default:

- website frontend
- search-facing positioning

## Website

### 1. website shell / visual taste / frontend / performance

Responsibility:

- overall page shell
- shared layout and visual system
- homepage / FAQ / Menu / Location structure
- frontend refresh
- visual taste upgrade
- performance-facing page polish

Current priority:

- this is the urgent active lane
- current workflow is `Stitch -> Codex via MCP -> repo implementation -> Taste / Impeccable visual QA -> performance QA`

Main editable files:

- [src/layouts/base.html](C:/Users/61413/Desktop/ai%20jobs/DL%20new%20website/src/layouts/base.html)
- [src/assets/css/style.css](C:/Users/61413/Desktop/ai%20jobs/DL%20new%20website/src/assets/css/style.css)
- [src/assets/js/main.js](C:/Users/61413/Desktop/ai%20jobs/DL%20new%20website/src/assets/js/main.js)
- [src/blocks/identity-hero.html](C:/Users/61413/Desktop/ai%20jobs/DL%20new%20website/src/blocks/identity-hero.html)
- [src/blocks/signature-trio.html](C:/Users/61413/Desktop/ai%20jobs/DL%20new%20website/src/blocks/signature-trio.html)
- [src/blocks/social-proof-reviews.html](C:/Users/61413/Desktop/ai%20jobs/DL%20new%20website/src/blocks/social-proof-reviews.html)
- [src/blocks/menu-grid.html](C:/Users/61413/Desktop/ai%20jobs/DL%20new%20website/src/blocks/menu-grid.html)
- [public/index.html](C:/Users/61413/Desktop/ai%20jobs/DL%20new%20website/public/index.html)
- [public/menu.html](C:/Users/61413/Desktop/ai%20jobs/DL%20new%20website/public/menu.html)
- [public/location.html](C:/Users/61413/Desktop/ai%20jobs/DL%20new%20website/public/location.html)
- [public/faq.html](C:/Users/61413/Desktop/ai%20jobs/DL%20new%20website/public/faq.html)

Do not touch by default:

- [functions/api/_booking.js](C:/Users/61413/Desktop/ai%20jobs/DL%20new%20website/functions/api/_booking.js)
- [functions/api/bookings.js](C:/Users/61413/Desktop/ai%20jobs/DL%20new%20website/functions/api/bookings.js)
- [functions/api/admin/bookings.js](C:/Users/61413/Desktop/ai%20jobs/DL%20new%20website/functions/api/admin/bookings.js)
- [functions/api/chat.js](C:/Users/61413/Desktop/ai%20jobs/DL%20new%20website/functions/api/chat.js)
- [functions/api/sms/inbound.js](C:/Users/61413/Desktop/ai%20jobs/DL%20new%20website/functions/api/sms/inbound.js)

## Booking System

### 1. booking rules / admin / form / CRM / table governance

Responsibility:

- booking rules
- admin bookings dashboard
- booking form
- booking email + CRM
- booking table governance

Important status:

- booking is still an important subsystem
- booking is no longer the default project narrative
- do not enter booking docs unless the task is truly booking-owned

Main editable files:

- [functions/api/_booking.js](C:/Users/61413/Desktop/ai%20jobs/DL%20new%20website/functions/api/_booking.js)
- [functions/api/bookings.js](C:/Users/61413/Desktop/ai%20jobs/DL%20new%20website/functions/api/bookings.js)
- [functions/api/admin/bookings.js](C:/Users/61413/Desktop/ai%20jobs/DL%20new%20website/functions/api/admin/bookings.js)
- [functions/api/janitor.js](C:/Users/61413/Desktop/ai%20jobs/DL%20new%20website/functions/api/janitor.js)
- [src/blocks/booking-form.html](C:/Users/61413/Desktop/ai%20jobs/DL%20new%20website/src/blocks/booking-form.html)
- [src/blocks/admin-bookings.html](C:/Users/61413/Desktop/ai%20jobs/DL%20new%20website/src/blocks/admin-bookings.html)

Do not touch by default:

- [src/blocks/story-list.html](C:/Users/61413/Desktop/ai%20jobs/DL%20new%20website/src/blocks/story-list.html)
- [src/blocks/story-detail.html](C:/Users/61413/Desktop/ai%20jobs/DL%20new%20website/src/blocks/story-detail.html)
- [src/assets/css/style.css](C:/Users/61413/Desktop/ai%20jobs/DL%20new%20website/src/assets/css/style.css)

## Search Optimization

### 1. AEO / GEO / AI Search Optimization

Responsibility:

- search answerability
- entity / NAP alignment
- schema
- canonical surfaces
- redirects
- robots / sitemap
- search-facing structure

Naming rule:

- do not treat this as an SEO-first project lane
- `SEO` is only infrastructure language

Main editable files:

- [data/site.yaml](C:/Users/61413/Desktop/ai%20jobs/DL%20new%20website/data/site.yaml)
- [scripts/generate.js](C:/Users/61413/Desktop/ai%20jobs/DL%20new%20website/scripts/generate.js)
- [public/robots.txt](C:/Users/61413/Desktop/ai%20jobs/DL%20new%20website/public/robots.txt)
- [public/sitemap.xml](C:/Users/61413/Desktop/ai%20jobs/DL%20new%20website/public/sitemap.xml)
- [public/_redirects](C:/Users/61413/Desktop/ai%20jobs/DL%20new%20website/public/_redirects)
- [public/_headers](C:/Users/61413/Desktop/ai%20jobs/DL%20new%20website/public/_headers)
- [src/blocks/location-nap.html](C:/Users/61413/Desktop/ai%20jobs/DL%20new%20website/src/blocks/location-nap.html)
- [src/blocks/faq-list.html](C:/Users/61413/Desktop/ai%20jobs/DL%20new%20website/src/blocks/faq-list.html)
- [src/blocks/identity-hero.html](C:/Users/61413/Desktop/ai%20jobs/DL%20new%20website/src/blocks/identity-hero.html)
- [src/blocks/intent-match.html](C:/Users/61413/Desktop/ai%20jobs/DL%20new%20website/src/blocks/intent-match.html)

Allowed cross-boundary exception:

- approved story ordering or answer-summary reinforcement for answerability
- [data/stories.yaml](C:/Users/61413/Desktop/ai%20jobs/DL%20new%20website/data/stories.yaml)
- [src/blocks/story-list.html](C:/Users/61413/Desktop/ai%20jobs/DL%20new%20website/src/blocks/story-list.html)
- [src/blocks/story-detail.html](C:/Users/61413/Desktop/ai%20jobs/DL%20new%20website/src/blocks/story-detail.html)

Do not touch by default:

- [functions/api/_booking.js](C:/Users/61413/Desktop/ai%20jobs/DL%20new%20website/functions/api/_booking.js)
- [functions/api/bookings.js](C:/Users/61413/Desktop/ai%20jobs/DL%20new%20website/functions/api/bookings.js)
- [functions/api/admin/bookings.js](C:/Users/61413/Desktop/ai%20jobs/DL%20new%20website/functions/api/admin/bookings.js)
- [functions/api/chat.js](C:/Users/61413/Desktop/ai%20jobs/DL%20new%20website/functions/api/chat.js)
- [functions/api/sms/inbound.js](C:/Users/61413/Desktop/ai%20jobs/DL%20new%20website/functions/api/sms/inbound.js)

## Content

### 1. stories / posts / media

Responsibility:

- stories updates
- media swaps
- story list / detail presentation

Important status:

- this is a narrow execution lane
- it is not the main project narrative
- it should not override the two-flywheel governance model

Main editable files:

- [data/stories.yaml](C:/Users/61413/Desktop/ai%20jobs/DL%20new%20website/data/stories.yaml)
- [src/blocks/story-list.html](C:/Users/61413/Desktop/ai%20jobs/DL%20new%20website/src/blocks/story-list.html)
- [src/blocks/story-detail.html](C:/Users/61413/Desktop/ai%20jobs/DL%20new%20website/src/blocks/story-detail.html)
- [src/assets/media](C:/Users/61413/Desktop/ai%20jobs/DL%20new%20website/src/assets/media)

## AI Chat

### 1. website chat entry

Responsibility:

- website chat entry
- booking conversation handling
- `general / create / lookup / cancel`

Important status:

- this is no longer a default project entry
- do not route new general project work through old AI-branch assumptions

Main editable files:

- [functions/api/chat.js](C:/Users/61413/Desktop/ai%20jobs/DL%20new%20website/functions/api/chat.js)
- [src/blocks/chatbot-widget.html](C:/Users/61413/Desktop/ai%20jobs/DL%20new%20website/src/blocks/chatbot-widget.html)

## SMS

### 1. sms booking entry

Responsibility:

- SMS inbound / outbound
- thread / gateway / booking bridge

Important status:

- this is no longer a default project entry
- do not let SMS history redefine the website narrative

Main editable files:

- [functions/api/sms/inbound.js](C:/Users/61413/Desktop/ai%20jobs/DL%20new%20website/functions/api/sms/inbound.js)
- [functions/api/sms/telerivet-inbound.js](C:/Users/61413/Desktop/ai%20jobs/DL%20new%20website/functions/api/sms/telerivet-inbound.js)
- [functions/api/sms/telerivet-sample.js](C:/Users/61413/Desktop/ai%20jobs/DL%20new%20website/functions/api/sms/telerivet-sample.js)

## One-Line Rule

Use this file to decide who owns the code boundary, not to decide the project narrative. The project narrative is fixed at the governance-entry layer.
