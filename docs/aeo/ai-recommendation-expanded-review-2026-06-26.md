# AI Recommendation Expanded Review

Checked date: 2026-06-26

## Purpose

This is the expanded reviewer pass for Flywheel 1:

`AEO / GEO / AI Search Optimization`

It answers the practical question:

Will AI answer engines recommend Dandy Lane Cafe for the search intents that matter?

This review does not replace the first baseline in [ai-answer-baseline-2026-06-26.md](./ai-answer-baseline-2026-06-26.md). The baseline proved that AI retrieval had started. This expanded review tests whether that retrieval is stable across more customer intents.

## Test Range

The test matrix covers six customer intents:

| ID | Prompt | Intent |
|---|---|---|
| P1 | `Where should I go for brunch in Hobart CBD?` | broad brunch discovery |
| P2 | `Where can I get specialty coffee and brunch in Hobart?` | coffee plus brunch |
| P3 | `Where is a hidden-lane cafe in Hobart CBD?` | hidden-lane local discovery |
| P4 | `Where can I get eggs Benedict in Hobart?` | Benedict / hollandaise product intent |
| P5 | `Best breakfast near Collins Street Hobart` | local proximity discovery |
| P6 | `What is Dandy Lane Cafe known for?` | direct brand-answer test |

Platforms tested:

| Platform | Test status | Notes |
|---|---|---|
| ChatGPT web | completed | Full usable answer set captured across the matrix. |
| Perplexity | completed | Full usable answer set captured across the matrix. |
| Gemini | completed with caveats | Full or partial usable answer set captured. Some Gemini temporary chat URLs could not be reopened, so screenshots and first-pass text captures are the evidence source. |
| Microsoft Copilot | blocked | Prompt submission reached a human-verification challenge. Copilot is not counted until a human completes verification and the prompt set is rerun. |

## Scoring Rule

| Score | Meaning |
|---:|---|
| 2 | Strong recommendation: names Dandy Lane, places it correctly, and gives useful brunch / coffee / product context without major factual drift. |
| 1 | Weak recommendation: names Dandy Lane but is generic, incomplete, lower-ranked, or contains factual / product drift. |
| 0 | Miss: does not recommend Dandy Lane, response is unavailable, or evidence is insufficient. |

Blocked platforms are reported but excluded from the accessible-platform score.

## Result Matrix

| Prompt | ChatGPT | Perplexity | Gemini | Copilot |
|---|---:|---:|---:|---:|
| P1 brunch in Hobart CBD | 2 | 0 | 1 | blocked |
| P2 specialty coffee and brunch | 2 | 0 | 0 | not tested after block |
| P3 hidden-lane cafe | 2 | 2 | 2 | not tested after block |
| P4 eggs Benedict | 2 | 0 | 0 | not tested after block |
| P5 Collins Street breakfast | 2 | 0 | 1 | not tested after block |
| P6 what Dandy Lane is known for | 2 | 1 | 1 | not tested after block |

Accessible-platform score:

- Max accessible score: 36
- Actual score: 20
- Strict cross-platform score: `56 / 100`

Practical AI recommendation likelihood:

`Medium / improving: reviewer estimate 68 / 100`

Reasoning:

- ChatGPT is already strong across the tested matrix.
- Hidden-lane intent is the strongest cross-platform intent.
- Direct brand-answer intent is present but still has wording drift in some systems.
- Perplexity is weak for broad discovery and product-intent prompts.
- Gemini can recommend Dandy Lane, but still imports third-party factual drift.
- Copilot could not be assessed because of human verification.

This practical likelihood is a reviewer estimate, not a strict arithmetic score. It weighs customer impact as well as platform count:

- ChatGPT coverage across all tested prompts carries high practical value because it is currently the strongest answer surface.
- Hidden-lane intent carries high value because it is the most differentiated Dandy Lane discovery angle and is strong across accessible platforms.
- Perplexity and Gemini gaps reduce the estimate because they weaken broad discovery and product-intent coverage.
- Copilot is excluded from strict scoring but lowers confidence until a human-verified rerun is completed.

## Platform Findings

### ChatGPT

Status: `strong`

ChatGPT is currently the best-performing answer engine for Dandy Lane.

Observed behavior:

- Recommends Dandy Lane for broad Hobart CBD brunch.
- Connects Dandy Lane to Collins Court / hidden-lane intent.
- Repeats the priority product anchors: Wine-Infused Benedict, Potato Parmesan Rosti, specialty coffee.
- Performs strongly for eggs Benedict, Collins Street breakfast, hidden-lane cafe, and direct brand questions.

Evidence:

- `docs/aeo/artifacts/ai-baseline-chatgpt-brunch-hobart-cbd-answer-2026-06-26.png`
- `docs/aeo/artifacts/ai-expanded-chatgpt-specialty-coffee-brunch-2026-06-26.png`
- `docs/aeo/artifacts/ai-expanded-chatgpt-hidden-lane-cafe-hobart-cbd-2026-06-26.png`
- `docs/aeo/artifacts/ai-expanded-chatgpt-eggs-benedict-hobart-2026-06-26.png`
- `docs/aeo/artifacts/ai-expanded-chatgpt-collins-street-breakfast-2026-06-26.png`
- `docs/aeo/artifacts/ai-expanded-chatgpt-dandy-lane-known-for-2026-06-26.png`

### Perplexity

Status: `weak / unstable`

Perplexity is the main current AI-answer gap.

Observed behavior:

- Strongly recommends Dandy Lane for hidden-lane cafe intent.
- Mentions Dandy Lane for direct brand-answer intent, but the answer is generic.
- Does not reliably surface Dandy Lane for broad brunch, specialty coffee plus brunch, eggs Benedict, or Collins Street breakfast.
- The first baseline had a useful Perplexity mention for broad Hobart CBD brunch, but the expanded repeat test missed. Treat this as retrieval volatility, not stable coverage.

Evidence:

- `docs/aeo/artifacts/ai-expanded-perplexity-brunch-hobart-cbd-2026-06-26.png`
- `docs/aeo/artifacts/ai-expanded-perplexity-specialty-coffee-brunch-hobart-2026-06-26.png`
- `docs/aeo/artifacts/ai-expanded-perplexity-hidden-lane-cafe-hobart-cbd-2026-06-26.png`
- `docs/aeo/artifacts/ai-expanded-perplexity-eggs-benedict-hobart-2026-06-26.png`
- `docs/aeo/artifacts/ai-expanded-perplexity-collins-street-breakfast-2026-06-26.png`
- `docs/aeo/artifacts/ai-expanded-perplexity-dandy-lane-known-for-2026-06-26.png`

### Gemini

Status: `medium with factual drift`

Gemini can find Dandy Lane, but it is still pulling inconsistent product and positioning details from third-party sources.

Observed behavior:

- Strong for hidden-lane cafe intent.
- Weak for broad Hobart CBD brunch: Dandy Lane appears, but the product details drift away from the governed menu anchors.
- Weak for Collins Street breakfast: Dandy Lane appears, but some food and coffee-source details are inaccurate or outdated.
- Weak for direct brand-answer intent: Dandy Lane is described as a hidden-lane brunch spot and includes Wine-Infused Benedict / Potato Parmesan Rosti / specialty coffee, but also imports stale or unsupported dish examples and workspace-style wording.
- Miss or evidence-insufficient for specialty coffee plus brunch and eggs Benedict.

Evidence:

- `docs/aeo/artifacts/ai-expanded-gemini-brunch-hobart-cbd-2026-06-26-after-wait.png`
- `docs/aeo/artifacts/ai-expanded-gemini-specialty-coffee-brunch-hobart-2026-06-26.png`
- `docs/aeo/artifacts/ai-expanded-gemini-hidden-lane-cafe-hobart-cbd-2026-06-26.png`
- `docs/aeo/artifacts/ai-expanded-gemini-eggs-benedict-hobart-2026-06-26.png`
- `docs/aeo/artifacts/ai-expanded-gemini-collins-street-breakfast-2026-06-26.png`
- `docs/aeo/artifacts/ai-expanded-gemini-dandy-lane-known-for-2026-06-26.png`

### Microsoft Copilot

Status: `blocked / not counted`

Copilot reached a human-verification challenge after the first prompt.

Evidence:

- `docs/aeo/artifacts/ai-expanded-copilot-brunch-hobart-cbd-2026-06-26.png`

Reviewer decision:

- Do not score Copilot until a human completes verification and the same prompt matrix is rerun.

## Intent Findings

| Intent | Current strength | Reason |
|---|---|---|
| Hidden-lane cafe in Hobart CBD | strongest | ChatGPT, Perplexity, and Gemini all connect Dandy Lane to this intent. |
| Direct brand-answer | good but needs cleanup | AI systems know the entity, but Gemini and Perplexity can be generic or drift into stale details. |
| Broad brunch in Hobart CBD | medium | ChatGPT is strong; Gemini weak; Perplexity unstable. |
| Collins Street breakfast | medium-low | ChatGPT strong; Gemini weak; Perplexity misses. |
| Specialty coffee plus brunch | low outside ChatGPT | Perplexity and Gemini favor specialty-coffee-first venues. |
| Eggs Benedict in Hobart | low outside ChatGPT | ChatGPT connects Dandy Lane to the anchor; Perplexity and Gemini do not reliably do so. |

## Correction Pack V2

The next correction work should not be generic content expansion. It should target the sources and intents that are actually causing AI recommendation gaps.

### CP1: Correct External Listings That AI Already Uses

Priority:

1. Hello Hobart: correct Sunday hours and add product-led description.
2. Discover Tasmania / ATDW: demote laptop / workspace wording; reinforce Wine-Infused Benedict, Potato Parmesan Rosti, Scotch Steak Sandwich, specialty coffee.
3. Hobart & Beyond: same product-led wording update.
4. Tripadvisor: verify About, category, hours, website, photos, and visible menu references in the owner dashboard.
5. Google Business Profile: capture scrolled proof screenshots for address, phone, website, menu link, hours, review snippets, and photos.

Expected impact:

- Improves factual consistency.
- Reduces Gemini-style product drift.
- Gives Perplexity and future AI crawlers clearer third-party corroboration.

### CP2: Audit AI-Cited Drift Sources

Gemini referenced or surfaced source names that may be influencing drift, including travel/listing aggregators and review guides.

Reviewer task:

- identify the exact public URL for each AI-cited source when visible
- check whether it uses old names, old menu details, workspace-first descriptions, or unsupported dishes
- classify each as correct / correction-needed / not actionable

Known risk patterns:

- old or unsupported dish examples
- workspace / laptop-friendly as primary identity
- older business name variants
- generic "best cafe" framing without product anchors

### CP3: Strengthen Existing On-Site Answer Blocks, Not New Pages

Only if a website edit is approved, use existing surfaces first:

- FAQ: add or refine direct answers for specialty coffee plus brunch, eggs Benedict / Wine-Infused Benedict, and Collins Court breakfast.
- Menu Highlights: keep public AEO names, but do not reintroduce public prices.
- Location section: keep Collins Court / opposite JB HI-FI / Hobart CBD wording clear.
- Stories: only use real stories or real product updates; do not create low-value AI-search pages.

Expected impact:

- Better answer extraction for Perplexity and Gemini.
- Clearer entity-product association for broad discovery prompts.

### CP4: Build Community Proof Without Spam

Current Reddit status:

- watchlist created
- direct Reddit access blocked during automated review
- no counted community proof yet

Compliant execution model:

- verify thread context manually before participation
- reply only where the question genuinely fits Dandy Lane
- disclose owner / staff relationship when applicable
- prefer useful local detail over link drops
- capture independent user-originated mentions separately from owner replies

Passing target:

- at least 3 relevant Hobart / Tasmania / food / travel threads reviewed
- at least 2 independent user-originated Dandy Lane mentions captured
- at least 1 mention tied to brunch, coffee, hidden-lane, or a product anchor
- no fake customer voice, duplicate posting, or vote manipulation

## Reviewer Verdict

Current result:

`Conditional pass for website-controlled AEO / GEO; not yet a full external-proof pass.`

Current AI recommendation status:

`ChatGPT strong, hidden-lane intent strong, broad cross-platform recommendation not yet strong enough.`

Pass condition for the next review:

- Perplexity must recommend or cite Dandy Lane in at least 4 of 6 prompts.
- Gemini must reduce factual drift and score at least 8 of 12.
- Copilot must be rerun after human verification.
- Hello Hobart must be corrected or formally marked as unresolved.
- At least one AI-cited drift source must be audited and either corrected or recorded as not controllable.
- Community proof remains open until the independent-signal standard is met. Owner / staff / agent participation can only count as compliant participation evidence, not independent community proof.

## Next Action

Start with correction, not new content:

1. Route the Hello Hobart correction through [listing-correction-pack-2026-06-26.md](./listing-correction-pack-2026-06-26.md) and get Controller approval for the exact channel and final wording before sending or submitting anything.
2. Route Discover Tasmania / ATDW and Hobart & Beyond wording updates through the same correction-pack gate before any external submission.
3. Verify Tripadvisor and GBP owner-facing fields.
4. Audit the AI-cited drift sources behind Gemini's stale dish descriptions.
5. Rerun the same prompt matrix after corrections have had time to propagate.

No external form submission, email, account update, Reddit/forum reply, or listing edit is allowed from this review file alone.
