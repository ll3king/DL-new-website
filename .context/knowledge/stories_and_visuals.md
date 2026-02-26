# Architectural Decision Record: Stories & Contextual Heros

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
Inspired by `dandylanecafe.com`:
- High contrast typography.
- Lifestyle-focused imagery (The "Benedict" in action, the "Lane" atmosphere).
- Subtle use of auto-playing hero videos for a premium feel.
