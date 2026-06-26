# AI Answer Baseline

Checked date: 2026-06-26

## Purpose

This file records the first AI-answer baseline for Flywheel 1:

`AEO / GEO / AI Search Optimization`

It checks whether major AI answer systems already identify Dandy Lane Cafe for a core local-intent query.

Primary prompt:

`Where should I go for brunch in Hobart CBD?`

## Baseline Summary

| Platform | Result | Dandy Lane shown | Accuracy | Screenshot artifact | Decision |
|---|---|---:|---|---|---|
| ChatGPT web | Answer recommends Dandy Lane Cafe as the best overall brunch option and references Collins Court, Wine-Infused Benedict, Potato Parmesan Rosti, and specialty coffee. Source area shows Discover Tasmania plus another source. | yes | strong | `docs/aeo/artifacts/ai-baseline-chatgpt-brunch-hobart-cbd-answer-2026-06-26.png` | count |
| Perplexity | Answer includes Dandy Lane as a hidden CBD brunch option with interesting twists on brunch staples. It uses the older-style name `Dandy Lane Food & Specialty Coffee`. | yes | useful with naming drift | `docs/aeo/artifacts/ai-baseline-perplexity-brunch-hobart-cbd-recapture-2026-06-26.png` | count with caveat |
| Gemini | Answer includes Dandy Lane Cafe on Collins Street as a hidden-gem brunch spot, but describes one dish imprecisely as `fried chicken eggs benedict`. | yes | useful with product-detail drift | `docs/aeo/artifacts/ai-baseline-gemini-brunch-hobart-cbd-answer-2026-06-26.png` | count with caveat |
| Microsoft Copilot | Prompt submitted, but no answer was captured after waiting. | no captured answer | not assessable | `docs/aeo/artifacts/ai-baseline-copilot-brunch-hobart-cbd-final-2026-06-26.png` | do not count |

## Findings

### Passed Signals

- Dandy Lane appears in three AI answer systems for the primary Hobart CBD brunch prompt.
- ChatGPT gives the strongest answer: it names Dandy Lane Cafe, places it in Collins Court, and repeats the priority product anchors.
- Perplexity and Gemini both connect Dandy Lane to hidden / tucked-away brunch intent.
- The AI baseline now supports the claim that the website and external-proof layer are beginning to work as AI-answerable assets.

### Drift / Risk

- Perplexity used `Dandy Lane Food & Specialty Coffee` rather than the preferred current name `Dandy Lane Cafe`.
- Gemini included a product-detail drift around `fried chicken eggs benedict`.
- Copilot did not return an answer in this test, so it cannot be counted.
- The AI systems may change answers over time; this baseline is a dated snapshot, not permanent proof.

## Current AI Retrieval Status

Initial AI retrieval baseline:

`Passed with caveats`

Counted platforms:

- ChatGPT
- Perplexity
- Gemini

Not counted:

- Microsoft Copilot

Next check should repeat the same prompt plus:

- `Where can I get specialty coffee and brunch in Hobart?`
- `Where is a hidden-lane cafe in Hobart CBD?`
- `Where can I get eggs Benedict in Hobart?`

Expanded follow-up:

- [ai-recommendation-expanded-review-2026-06-26.md](./ai-recommendation-expanded-review-2026-06-26.md)

The expanded review found that ChatGPT is strong, hidden-lane intent is strong across accessible platforms, but Perplexity and Gemini are not yet reliable enough for broad cross-platform recommendation coverage.

## Reviewer Rule

AI-answer evidence counts only when it includes:

- platform
- date
- prompt
- screenshot or saved artifact
- whether Dandy Lane appears
- factual accuracy notes
- cited sources when visible
