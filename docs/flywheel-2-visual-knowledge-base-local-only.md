# Flywheel 2 Visual Knowledge Base Local-Only Boundary

Last updated: 2026-06-25

## Purpose

This document records the governance boundary for the Dandy Lane visual knowledge base.

The visual knowledge base supports Flywheel 2 visual work, but it is not a GitHub delivery surface.

## Boundary Rule

`visual-knowledge-base/` is a local-only working knowledge library.

It may contain:

- raw or generated visual source assets
- visual signal notes
- food, drink, interior, exterior, and brand reference cards
- reconstruction tests
- reviewer packages and outputs
- Stitch or image-generation support material

It must not be submitted to GitHub.

## Git Rule

The repository `.gitignore` excludes:

- `visual-knowledge-base/`

This is intentional. Future agents must not force-add this directory unless the owner explicitly changes the governance rule.

## Promotion Rule

If a visual asset becomes production-ready, do not publish it from the local knowledge base directly.

Instead:

1. select the approved asset or derivative
2. optimize it for website delivery
3. place only that selected production file in `src/assets/media`
4. update the relevant frontend, content, or media documentation
5. keep the full local source and reconstruction history inside `visual-knowledge-base/`

## Why This Boundary Exists

The visual knowledge base is expected to grow through real photos, generated tests, reviewer outputs, and future design-agent workflows.

Keeping it local prevents:

- oversized Git history
- accidental publication of draft or source-only assets
- confusion between visual research and production website media
- long-term repository bloat

## Relation To Flywheel 2

The visual knowledge base is a Flywheel 2 subsystem.

It supports:

- appetite-driven visual direction
- Dandy Lane-specific scene reconstruction
- controlled use of real food, drink, and laneway signals
- Stitch and Codex visual implementation work

It does not replace:

- the repository root README
- Flywheel 2 governance
- production media governance in `src/assets/media`

## Related Documents

- [Flywheel 2 Visual Taste / Frontend / Performance](./flywheel-2-visual-taste-frontend-performance.md)
- [Flywheel 2 Visual Refresh Retrospective 2026-06-25](./flywheel-2-visual-refresh-retrospective-2026-06-25.md)
- [Project Module Code Boundary Map](./project-module-code-boundary-map.zh-CN.md)
