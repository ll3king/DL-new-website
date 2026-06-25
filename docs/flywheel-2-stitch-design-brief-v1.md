# Flywheel 2 Stitch Design Brief v1

Last updated: 2026-06-24

## Purpose

This brief prepares the first Stitch design draft for Dandy Lane Cafe's Flywheel 2 work.

It is not a website implementation plan.
It is the design input layer for exploring a warmer, more appetising, more specific homepage and visual system before Codex implementation.

## Project Boundary

This work belongs to:

- `Visual Taste / Frontend / Performance`

Allowed scope:

- homepage visual direction
- global frontend taste direction
- menu / story / FAQ presentation direction
- media hierarchy
- mobile CTA clarity
- performance-aware visual motion

Out of scope:

- booking backend
- admin booking system
- AI brain
- SMS gateway
- CRM
- Flywheel 1 expansion

## Dandy Lane Identity

Dandy Lane is a Hobart CBD hidden-lane breakfast-to-brunch cafe.

The site should feel like:

- a real cafe tucked inside Collins Court
- warm, modest, specific, and appetising
- a place people can remember by product and place
- handcrafted, not generic rustic
- clean but not sterile
- local discovery, not tourist brochure

## Core Visual Anchors

Strengthen these anchors in this order:

1. `Wine-Infused Benedict`
2. `Potato Parmesan Rosti`
3. `Scotch Steak Sandwich`
4. `Specialty Coffee`
5. `Hidden lane / Collins Court / Hobart CBD`

## Verified Visual Knowledge To Use

Use the project visual knowledge base as the visual source layer:

- `visual-knowledge-base/exterior`
- `visual-knowledge-base/food`
- `visual-knowledge-base/drink`

Current validated exterior patterns:

- close food hero on real-style outdoor timber bench
- blurred Collins Court graffiti mural as background identity cue
- grey paving stone context
- coffee on exterior bench near entrance
- black-framed entrance, cream wall, stone base, planter barrel as support anchors

Do not make a wide laneway panorama the main hero unless specifically testing it.
The strongest visual pattern is close product focus with one or two real Dandy Lane place signals.

## Visual Direction

The first draft should explore:

- food-first appetite
- warm timber and stone tactility
- hidden-lane discovery
- editorial product confidence
- quiet confidence, not loud campaign clutter
- real Dandy Lane details: bench, stone wall, black-framed entrance, graffiti blur, coffee ritual

The page should feel more like a strong local brunch destination than a generic cafe template.

## Homepage Structure Direction

### 1. Hero

Goal:

- make the guest want to eat or visit within 3 seconds

Hero composition:

- product-led image area
- short identity line
- one primary CTA
- one practical secondary action if needed

Suggested hero message:

`Hidden-lane breakfast and brunch in Hobart CBD.`

Support line:

`Wine-Infused Benedict, Potato Parmesan Rosti, specialty coffee, and warm brunch plates tucked inside Collins Court.`

Primary CTA:

`Book a table`

Secondary action:

`View menu`

Visual:

- close Dandy Lane food or coffee image
- background or supporting layer uses bench / graffiti / entrance signal
- avoid full-page generic cafe hero photo

### 2. Product Memory Strip

Feature three anchors:

- Wine-Infused Benedict
- Potato Parmesan Rosti
- Scotch Steak Sandwich
- Specialty Coffee

Do not use three equal generic cards.
Use asymmetric rhythm: one large feature, two supporting product moments.

### 3. Hidden Lane Proof

Show place specificity:

- Collins Court
- Dandy Lane sign / entrance
- graffiti wall
- outdoor bench

This section should explain where the feeling comes from, not become a location directory.

### 4. Brunch Decision Section

Help users choose:

- first-time order
- hearty brunch-to-lunch option
- coffee stop
- limited-time special if active

### 5. Mobile CTA Band

Mobile should prioritize:

- Book
- Menu
- Directions

These actions should be visible without scrolling too far.

## Typography Direction

Avoid generic SaaS typography.

Recommended direction:

- Display: `Fraunces` or `Instrument Serif` for appetite / editorial warmth
- Body: `Satoshi`, `Outfit`, or `Cabinet Grotesk`
- UI labels: same sans family, tighter and practical

Do not use `Inter` as the design identity.

## Color Direction

Use warm, grounded cafe colors:

- cream wall
- stone beige
- timber brown
- charcoal sign black
- hollandaise yellow as appetite accent
- muted mural blue as secondary support

Avoid:

- purple / blue AI gradients
- neon accents
- sterile white-on-black luxury
- beige minimalism with no appetite

## Motion Direction

Motion should be light and practical:

- slow image reveal
- subtle CTA press
- gentle product card stagger
- no heavy animation library
- no scroll-jacking

Use only transform / opacity style motion in final implementation.

## Performance Guardrails

The visual direction must protect:

- fast mobile first paint
- hero image optimization
- lazy-loaded below-fold media
- no heavy video background by default
- no decorative media that does not improve appetite, place memory, or CTA clarity

## Banned Patterns

Do not produce:

- generic cafe template
- stock coffee bean icons
- sticker overload
- fake rustic texture
- luxury wedding / event styling
- SaaS landing page layout
- huge abstract gradients
- fake Dandy Lane logo redraws
- fake menu prices
- fake people / staff / guest claims
- full-laneway composition that invents spatial details

## Stitch Draft Goal

The Stitch draft should produce a design system and first homepage concept that can later be implemented in the repo.

The draft is successful if it makes these things visually clear:

- Dandy Lane is a Hobart CBD hidden-lane breakfast-to-brunch cafe
- Benedict is the strongest food memory anchor
- coffee is a daily repeat-visit anchor
- the place feels real through Collins Court / bench / entrance / graffiti cues
- mobile users can quickly book, view menu, or get directions

## First Draft Acceptance Criteria

Approve the Stitch draft only if:

- it does not look like a generic cafe landing page
- product imagery leads the design
- the design has warmth and appetite
- Dandy Lane place signals are visible but not overstuffed
- CTA hierarchy is clearer on mobile
- no fake claims or fake visual identity are introduced
- performance-sensitive visual choices are still possible in code

## Stitch Draft Record

Created: 2026-06-24

Stitch project:

- title: `Dandy Lane Cafe Flywheel 2 Visual Draft v1`
- project id: `5472050057222544120`

Uploaded design system input:

- [Flywheel 2 Stitch DESIGN v1](./flywheel-2-stitch-DESIGN-v1.md)
- [Flywheel 2 Stitch Media Motion Pack v1](./flywheel-2-stitch-media-motion-pack-v1.md)

Stitch output:

- design system asset id: `27934c404a4644c58aa3f079caacd4d7`
- initial mobile screen source: `projects/5472050057222544120/screens/10741777605265421173`

Motion-aware update:

- updated design system asset id: `c78b068d7408459c848fbcc4ba663321`
- updated mobile screen source: `projects/5472050057222544120/screens/8548181668877177337`
- added controlled media / motion reference pack: [Flywheel 2 Stitch Media Motion Pack v1](./flywheel-2-stitch-media-motion-pack-v1.md)

Boundary:

This Stitch output is a draft exploration asset.
It is not approved for repo implementation until it passes Flywheel 2 visual QA and performance feasibility review.

Important limitation:

The current Stitch MCP path accepts `DESIGN.md` design-system instructions.
It does not expose a separate local media upload step in this session.
Therefore, media assets are handed off through the media motion pack and must be referenced during review / implementation rather than assumed to be embedded inside Stitch automatically.

## Related Knowledge

- [Flywheel 2](./flywheel-2-visual-taste-frontend-performance.md)
- [Project Module Code Boundary Map](./project-module-code-boundary-map.zh-CN.md)
- [Visual Knowledge Base](../visual-knowledge-base/README.md)
- [Flywheel 2 Stitch Media Motion Pack v1](./flywheel-2-stitch-media-motion-pack-v1.md)
- [Exterior MVP Tests](../visual-knowledge-base/exterior/mvp/tests/README.md)
- [TEST-LANE-FOOD-002](../visual-knowledge-base/exterior/mvp/tests/TEST-LANE-FOOD-002.md)
- [TEST-LANE-COFFEE-001](../visual-knowledge-base/exterior/mvp/tests/TEST-LANE-COFFEE-001.md)
