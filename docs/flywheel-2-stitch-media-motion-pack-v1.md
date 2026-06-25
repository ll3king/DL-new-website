# Flywheel 2 Stitch Media Motion Pack v1

Last updated: 2026-06-25

## Purpose

This pack defines the first controlled media and motion references for the Stitch draft.

It exists because Dandy Lane's next visual refresh should not be static-only.
The site needs restrained visual craft: motion, appetite, and place memory without becoming heavy or generic.

## Boundary

This pack belongs to:

- `Visual Taste / Frontend / Performance`

It is not a production media implementation plan yet.
It is a design exploration reference for Stitch and later Codex implementation.

## Motion Principle

Use motion to make the site feel alive, not noisy.

Motion should support:

- food appetite
- coffee ritual
- hidden-lane discovery
- CTA clarity
- tactile page rhythm

Motion must not:

- slow the first screen
- require heavy animation libraries
- become scroll-jacking
- distract from booking / menu / directions
- use fake people or fake Dandy Lane signage

Production learning from the accepted homepage refresh:

- motion must be designed with mobile delivery from the start
- every public-facing video needs a poster fallback
- mobile should use a smaller video source when desktop source is heavy
- autoplay should be treated as unreliable unless `muted`, `playsinline`, and JS retry are in place
- if autoplay fails, the page must still look intentionally designed

## Core Static Image References

### Food Hero Direction

- `visual-knowledge-base/exterior/mvp/tests/outputs/TEST-LANE-FOOD-002/test-lane-food-002-output-v01.png`
  - use: strongest current generated direction for food + bench + blurred graffiti
  - role: hero food mood reference
  - caution: generated image; not final production truth

- `visual-knowledge-base/food/assets/food_mushroom_benny.jpg`
  - use: mushroom benny structure truth
  - role: food shape / plating reference
  - caution: background is not homepage-ready

- `visual-knowledge-base/food/assets/food_steak_sandwich.jpg`
  - use: Scotch Steak Sandwich / hearty brunch-to-lunch memory anchor
  - role: product memory reference
  - caution: background is not homepage-ready

- `visual-knowledge-base/food/assets/food_steak_sandwich_close_sign.jpg`
  - use: stronger steak sandwich truth still with Dandy Lane sign context
  - role: steak sandwich height, sauce, toast texture, and place-memory support
  - caution: blurred sign is context only; do not redraw or sharpen the logo

### Coffee Direction

- `visual-knowledge-base/exterior/mvp/tests/outputs/TEST-LANE-COFFEE-001/test-lane-coffee-001-output-v01.png`
  - use: coffee + exterior entrance direction
  - role: coffee product mood reference
  - caution: generated image; use as direction, not source proof

- `visual-knowledge-base/drink/assets/coffee-menu-vibe.jpg`
  - use: real coffee / menu atmosphere reference
  - role: coffee texture and daily ritual support

### Place Direction

- `visual-knowledge-base/exterior/assets/laneway-where.jpg`
  - use: strongest Dandy Lane place proof
  - role: sign, church, cream wall, stone base, entrance relationship
  - caution: wide proof reference, not direct hero layout

- `visual-knowledge-base/exterior/assets/laneway-2.jpg`
  - use: graffiti / sign / laneway depth proof
  - role: spatial identity reference
  - caution: do not copy the green strip into close food hero layouts

- `visual-knowledge-base/interior/assets/interior-1.jpg`
  - use: interior warmth and real service density
  - role: human warmth / real room reference
  - caution: people are visible; use as mood reference only unless permission boundary is settled

## Core Motion References

### Coffee Ritual Motion

- `visual-knowledge-base/drink/assets/coffee-pour-latteart.mp4`
- `visual-knowledge-base/drink/assets/coffee-pour-latteart3.mp4`
- `visual-knowledge-base/drink/assets/coffee-steam-milk.mp4`
- `visual-knowledge-base/drink/assets/coffee-shot-slowmo.mp4`

Use for:

- short loop reference
- coffee-card hover movement
- subtle homepage rhythm
- specialty coffee ritual proof

Do not use as:

- full-screen video hero
- heavy autoplay background
- supplier-logo proof

### Exterior Identity Motion

- `visual-knowledge-base/exterior/assets/environment-zoomin-sign.mp4`
- `visual-knowledge-base/exterior/assets/environment-laneway-cup.mp4`
- `visual-knowledge-base/exterior/assets/environment-sign-sunlight.jpg`

Use for:

- sign reveal concept
- hidden-lane discovery transition
- small proof moment
- page-scroll rhythm reference

Do not:

- redraw the sign
- create fake readable signage
- overuse wide laneway animation

### Food Motion

- `visual-knowledge-base/food/assets/food-benny-hollandaise.mp4`
- `visual-knowledge-base/food/assets/food-benny-rotate.mp4`
- `visual-knowledge-base/food/assets/food_steak_sandwich_motion.mp4`
- `visual-knowledge-base/food/assets/food-rosti-garnish.mp4`
- `visual-knowledge-base/food/assets/food-egg-yolk.mp4`

Use for:

- appetite micro-motion
- product section animation reference
- dish texture truth support
- steak sandwich product memory motion support

Do not:

- mix process clips into final dish truth without validation
- let motion invent a new dish structure
- turn the steak sandwich into a generic burger or studio sandwich

### Interior / Service Motion

- `visual-knowledge-base/interior/assets/environment-vibe-busyservice.mp4`
- `visual-knowledge-base/interior/assets/environment-greens.mp4`

Use for:

- warm background rhythm
- below-fold atmosphere
- subtle human service memory

Do not:

- use identifiable people as production hero without review
- open interior reconstruction by default

## Recommended Stitch Motion Concepts

### Concept A: Living Food Hero

Desktop:

- static food hero image
- small looping coffee steam / pour chip beside CTA
- subtle bench / mural background parallax simulated by layout, not heavy JS

Mobile:

- food image first
- CTA directly under headline
- coffee motion chip below CTA or in product strip
- use mobile-sized motion source and poster fallback
- never allow a decorative motion chip to render as an empty shape

### Concept B: Product Memory Reel

Use a horizontal product memory strip:

- Benedict
- Steak Sandwich
- Specialty Coffee

Each product tile has one small motion affordance:

- image reveal
- sauce / steam / pour micro-loop
- no autoplay if it harms performance

### Concept C: Hidden-Lane Reveal

Use the place section as a reveal:

- sign / stone / entrance proof image
- short copy about Collins Court
- small motion reference from sign zoom or laneway cup

Avoid making the full laneway the hero.

## Stitch Instruction Summary

The next Stitch draft should not be static-only.

It should propose:

- one striking hero with product image and motion accent
- one product memory strip with lightweight movement
- one hidden-lane proof section with place motion cue
- one mobile CTA pattern that remains practical

Motion should be described as lightweight and implementable:

- opacity
- transform
- short muted loops
- lazy loaded below fold
- reduced-motion fallback
- mobile video source
- poster fallback
- viewport-safe controls

## Production Promotion Rule

Stitch may propose motion, but Codex implementation must decide whether the motion can ship.

Before a motion asset moves into `src/assets/media`, confirm:

1. it improves appetite, place memory, or CTA clarity
2. it has a desktop source
3. it has a mobile source if visible above the fold or used on mobile
4. it has a poster fallback
5. it does not break reduced-motion preference
6. it does not push chat, navigation, or CTA controls outside the mobile viewport

Latest implementation retrospective:

- [Flywheel 2 Visual Refresh Retrospective 2026-06-25](./flywheel-2-visual-refresh-retrospective-2026-06-25.md)

## Related Knowledge

- [Flywheel 2 Stitch Design Brief v1](./flywheel-2-stitch-design-brief-v1.md)
- [Flywheel 2 Stitch DESIGN v1](./flywheel-2-stitch-DESIGN-v1.md)
- [Visual Knowledge Base](../visual-knowledge-base/README.md)
- [Exterior MVP Tests](../visual-knowledge-base/exterior/mvp/tests/README.md)
- [Drink Coffee Injection Index](../visual-knowledge-base/drink/notes/drink-coffee-injection-index.md)
- [Food Motion Injection Index](../visual-knowledge-base/food/notes/food-motion-injection-index.md)
