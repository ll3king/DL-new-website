# Flywheel 2 Visual Refresh Retrospective 2026-06-25

## Purpose

This document records the first production-accepted Flywheel 2 visual refresh pass.

It exists so future agents can reuse the practical project learning instead of restarting from abstract taste direction.

## Status

Result:

- accepted by owner on mobile and desktop
- merged to `main`
- production deployment expected through Cloudflare Pages from `main`

Validated commits:

- `7f1938e` Create Flywheel 2 visual test homepage
- `b0d8f8f` Refine Flywheel 2 mobile controls
- `376b763` Improve mobile video playback fallbacks

## Project Boundary

This work belonged to:

- `Flywheel 2: Visual Taste / Frontend / Performance`

Primary execution module:

- `Website`

Allowed code surfaces used:

- `src/layouts/base.html`
- `src/blocks/identity-hero.html`
- `src/blocks/signature-trio.html`
- `src/blocks/chatbot-widget.html`
- `src/assets/media`

Non-boundary areas intentionally not touched:

- booking backend
- booking rules
- SMS gateway
- AI brain / chat behavior logic
- CRM
- admin booking system
- Flywheel 1 expansion

Important nuance:

- `src/blocks/chatbot-widget.html` was touched only for mobile positioning of the visible widget.
- The conversation behavior, routing, and API logic were not changed.

## What Worked

### 1. Product-first visual hierarchy

The accepted homepage direction used food and place as the first impression:

- large brunch visual
- steak sandwich support image
- small motion chip
- direct booking CTA
- hidden-lane / Collins Court positioning

This performed better than text-only or generic cafe layout direction.

### 2. Real Dandy Lane signals matter

The visual direction became stronger only after using project-owned visual knowledge:

- timber bench / outdoor table
- blurred graffiti mural
- grey paving stone context
- Dandy Lane food anchors
- real Scotch Steak Sandwich asset
- mushroom benny motion reference

Stitch or design exploration without these assets drifted too generic.

### 3. Mobile cannot be a collapsed desktop

The first desktop-approved layout failed mobile because:

- the visual stack moved below the first screen
- chat control placement was outside the usable phone viewport
- navigation used an off-canvas pattern that could appear outside the phone frame

Accepted mobile behavior required:

- image-first hero on mobile
- primary CTA still visible and usable
- navigation inside the viewport
- chat button and chat window inside the viewport
- no dependency on desktop spatial composition

### 4. Motion needs mobile-specific delivery

Desktop video and media behavior was not enough.

Mobile acceptance required:

- `muted`
- `playsinline`
- explicit autoplay retry script
- mobile-sized video source
- poster fallback
- no empty visual placeholder when autoplay fails

Large original videos may work on desktop but fail or stall on mobile WebView / in-app browsers.

### 5. Performance and taste are the same problem here

For this site, performance is not a separate afterthought.

If media is too heavy, the page loses appetite and trust because:

- motion does not start
- the hero shows empty shapes
- the page feels broken
- mobile CTA confidence drops

Flywheel 2 must treat performance as part of visual taste.

## What Failed Or Needed Correction

### 1. Pure Stitch draft without real assets is insufficient

Stitch can explore layout and rhythm, but Dandy Lane needs controlled source assets.

Future Stitch inputs should include:

- selected food assets
- selected drink assets
- exterior place signals
- motion references
- negative constraints

Do not ask Stitch to invent Dandy Lane from text alone.

### 2. Full scene generation is too risky for production visual identity

Earlier generation attempts failed when they tried to reconstruct too much of the laneway at once.

The more reliable pattern is:

- close product focus
- one or two Dandy Lane place signals
- shallow depth of field
- real bench / table logic
- blurred graffiti or entrance cue as supporting identity

This should remain the preferred commercial image pattern until more source-backed scene tests pass.

### 3. Off-screen mobile UI patterns are fragile

The old navigation pattern used an off-canvas panel.

This caused viewport problems in the mobile review context.

Future mobile navigation should prefer:

- screen-contained panels
- fixed `left` and `right` bounds
- `max-height: calc(100dvh - ...)`
- transform / opacity reveal rather than `right: -100%`

### 4. Unversioned long-cache media can hide real fixes

The project currently uses long-lived cache headers for assets.

When media filenames do not change, mobile browsers or CDN caches may continue using stale assets.

For important visual media updates, prefer:

- new filenames
- versioned filenames
- mobile-specific derived filenames

Do not rely only on replacing the same file.

## Accepted Patterns

### Homepage hero pattern

Use:

- product-led visual first
- hidden-lane identity as supporting proof
- concise headline
- primary booking CTA
- menu and directions as secondary actions

Avoid:

- generic cafe interior hero only
- wide laneway panorama as the main hero
- text-first mobile first screen
- decorative motion that does not improve appetite or memory

### Mobile hero pattern

Use:

- visual first
- content second
- CTA within early scroll
- compact supporting imagery
- no out-of-viewport controls

Do not:

- simply stack desktop columns and accept whatever appears first
- let the chat widget or nav sit outside the device frame
- hide all visual appetite below the fold

### Video and motion pattern

For autoplay visual media:

- desktop may use original source where performance is acceptable
- mobile should use a smaller `-mobile.mp4`
- every video needs a `poster`
- every autoplay video needs `muted` and `playsinline`
- use a small JS retry only for visible media reliability
- support reduced-motion preference

If autoplay fails:

- the poster must still create an acceptable visual state
- the page must never show an empty decorative shape

## Current Media Implementation Rule

When adding a production-facing video to this site, create or confirm:

1. desktop source
2. mobile source
3. poster image
4. template wiring
5. mobile playback verification
6. build verification

Example naming:

- `name.mp4`
- `name-mobile.mp4`
- `name-poster.jpg`

## Visual Knowledge Base Learning

This production pass confirms that the visual knowledge base is not optional for Flywheel 2.

Use it to choose:

- product truth
- place signals
- shot grammar
- motion references

Do not use it as permission to over-generate full fake scenes.

The strongest proven commercial pattern is:

- close appetising product
- real or source-backed table / bench
- one Dandy Lane exterior identity cue
- shallow depth of field
- mobile-safe media delivery

## Future Agent Checklist

Before the next Flywheel 2 implementation:

- read the Flywheel 2 document
- read this retrospective
- check the visual knowledge base
- identify the exact frontend boundary
- define desktop and mobile behavior separately
- define media delivery and fallback before implementation
- verify on mobile before calling the work complete

## Next Work Direction

The next Flywheel 2 work should continue from the accepted production pattern:

- refine homepage sections below the hero
- improve menu / product memory presentation
- strengthen coffee and hidden-lane proof sections
- keep mobile CTA and media performance central
- continue using visual knowledge base assets rather than generic design references

Do not reopen Flywheel 1 or booking logic as part of this visual refresh unless the owner explicitly expands scope.

## Related Documents

- [Flywheel 2: Visual Taste / Frontend / Performance](./flywheel-2-visual-taste-frontend-performance.md)
- [Feature Registry](./feature-registry.md)
- [Project Module Code Boundary Map](./project-module-code-boundary-map.zh-CN.md)
- [Visual Knowledge Base](../visual-knowledge-base/README.md)
- [Flywheel 2 Stitch Design Brief v1](./flywheel-2-stitch-design-brief-v1.md)
- [Flywheel 2 Stitch Media Motion Pack v1](./flywheel-2-stitch-media-motion-pack-v1.md)
