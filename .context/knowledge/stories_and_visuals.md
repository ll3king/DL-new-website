# Stories And Visual Memory

Status: active supporting reference

Current project governance:

- [README.md](../../README.md)
- [docs/flywheel-2-visual-taste-frontend-performance.md](../../docs/flywheel-2-visual-taste-frontend-performance.md)

This file supports Flywheel 2.
It should not be treated as a separate design strategy.

## Context
1. We need a blog-like system ("Our Stories") for deep AEO content.
2. Each page needs unique identity text while sharing a core message.
3. High-quality media (photos/video) must be integrated without bloating the logic.

## Decision: Collections Pattern (L0/L3)
- **Data (L0)**: Introduce `data/stories.yaml`. Use a YAML list to represent the collection.
- **Routing (L3)**: The SSG script will iterate through the collection to generate:
  - An index page (`/stories.html`)
  - Detail pages (`/stories-{slug}.html`)
- **Visuals**: Use a `MediaAsset` object in L0 to handle both high-res images and short looping MP4s (silent/optimized).

## Decision: Contextual Injection (L2)
- Instead of hardcoding text in `identity-hero.html`, the block will now use:
  - `{{ page.hero.title }}`: Unique emphasis.
  - `{{ site.identity.core_purpose }}`: Shared constant message.
- This maintains "Rule of Logic Separation": L2 defines the slot, L3 passes the specific data, L0 holds the fact.

## Visual Reference

Current visual direction should support:

- appetite
- warmth
- handcrafted food
- specialty coffee ritual
- hidden-lane atmosphere

Avoid treating motion or video as the point.
Media should strengthen memory and appetite first, not create generic premium effects.
