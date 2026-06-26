# External Proof Consistency Report

Last updated: 2026-06-26

## Purpose

This report tracks whether major third-party listings reinforce the current Dandy Lane search position:

- Hobart CBD breakfast and brunch destination
- Wine-Infused Benedict
- daily hand-whisked hollandaise
- Potato Parmesan Rosti
- Scotch Steak Sandwich
- seasonal brunch specials
- specialty coffee

It is not a replacement for the official site. It is an external consistency checklist.

## Current Findings

Current strict evidence count:

- Formal count: Google Business Profile / Google Maps, Tripadvisor, Discover Tasmania, Hobart & Beyond
- Revise / support only: Hello Hobart
- Do not count yet: Apple Maps, Bing Places, Reddit / forums

External proof is therefore now formally usable for entity/location proof, product reinforcement, and initial review-platform proof.
It is not yet complete for community recognition.
AI-retrieval evidence has an initial baseline pass with caveats, but the expanded AI recommendation matrix is mixed.

### Discover Tasmania

- Product anchors are good when using the public / AEO names: Wine-Infused Benedict, Potato Parmesan Rosti, Scotch Steak Sandwich.
- Current status: count.
- Artifact: [external-proof-artifacts-2026-06-26.md](./external-proof-artifacts-2026-06-26.md).
- Issue: listing language still leans on laptop-friendly atmosphere / remote work.
- Recommended action: request update to product-led brunch wording.

### Hobart & Beyond

- Product anchors are good.
- Current status: count.
- Artifact: [external-proof-artifacts-2026-06-26.md](./external-proof-artifacts-2026-06-26.md).
- Issue: listing language still leans on laptop-friendly atmosphere / remote work.
- Recommended action: request update to product-led brunch wording.

### Hello Hobart

- Current status: revise / support only.
- Issue: Sunday is listed as closed.
- Official site and Tripadvisor show Sunday 9:00 AM - 2:00 PM.
- Product anchors are missing.
- Recommended action: request opening hours and product-description update using [listing-correction-pack-2026-06-26.md](./listing-correction-pack-2026-06-26.md).

### Tripadvisor

- Correct listing exists and supports Dandy Lane Cafe as breakfast / lunch / brunch, Cafe / Australian, 4.6/5, 231 reviews.
- Current status: count.
- Artifact: [external-proof-artifacts-2026-06-26.md](./external-proof-artifacts-2026-06-26.md).
- Note: the screenshot includes business-dashboard context and should be treated as internal evidence, not public marketing material.
- Correct listing URL:
  [Dandy Lane Cafe Tripadvisor](https://www.tripadvisor.com.au/Restaurant_Review-g255097-d11801652-Reviews-Dandy_Lane_Cafe-Hobart_Greater_Hobart_Tasmania.html)

### Google Business Profile / Google Maps

- Current status: count.
- Artifact: [external-proof-artifacts-2026-06-26.md](./external-proof-artifacts-2026-06-26.md).
- Visible screenshot proof confirms Dandy Lane Cafe, 4.6 rating, 978 reviews, Brunch restaurant category, map placement near Collins Street, and business-owner control context.
- DOM capture also returned address, website, menu link, phone, owner update, review summary, and review snippets, but those fields need a scrolled visible screenshot before they count as visual proof.
- Recommended action: refresh if rating, review count, category, address, website, menu link, phone, or hours change; capture scrolled screenshots when those secondary fields are being scored.

### Reddit / Forums

- Current status: opportunity only.
- One relevant r/hobart quiet brunch thread was found.
- A first-pass Google-indexed Reddit watchlist now exists in [community-proof-watchlist-2026-06-26.md](./community-proof-watchlist-2026-06-26.md).
- No Dandy Lane community signal counts until a compliant, transparent participation action is live and reviewed, or an independent user-originated Dandy Lane mention is captured.

### AI Answer Engines

- Current status: conditional / mixed.
- Baseline artifact: [ai-answer-baseline-2026-06-26.md](./ai-answer-baseline-2026-06-26.md).
- Expanded review: [ai-recommendation-expanded-review-2026-06-26.md](./ai-recommendation-expanded-review-2026-06-26.md).
- ChatGPT is strong across the tested prompt matrix.
- Hidden-lane cafe intent is the strongest cross-platform prompt.
- Perplexity is weak for broad brunch, specialty coffee plus brunch, eggs Benedict, and Collins Street breakfast prompts.
- Gemini can recommend Dandy Lane, but still imports product / positioning drift from third-party sources.
- Copilot was blocked by a human-verification challenge and is not counted.
- Recommended action: correct external listing drift, audit AI-cited drift sources, and rerun the exact prompt matrix after propagation.

## Internal Fix Status

- Tripadvisor link target corrected in site-facing proof blocks.
- Year-specific `Travellers' Choice 2024` claim removed from visible homepage proof copy.
- Google Maps numeric review claim softened until a current verified source is stored.
- Workspace / laptop content demoted to a secondary practical-details area instead of the main story collection.

## Production Verification

As of 2026-06-22, the production homepage has been live-checked and matches the current product-led AEO / GEO direction.

Observed production signals:

- homepage identity = Hobart CBD breakfast and brunch destination
- no primary `Remote Work & Focus` section
- FAQ starts with product-led brunch questions
- stories index prioritizes hollandaise, signature dishes, produce, seasonal specials, and coffee

Production verification source:

- https://dandylanecafe.com/

Captured production excerpt on 2026-06-22:

- `Hobart CBD breakfast and brunch destination`
- `Breakfast And Brunch In Hobart CBD`
- `Dandy Lane Cafe is a Hobart CBD breakfast and brunch cafe known for Wine-Infused Benedict, Potato Parmesan Rosti, Scotch Steak Sandwich, seasonal brunch specials, and specialty coffee.`
- `Dandy Lane Cafe is located at Unit 10 / 138 Collins Street, Hobart TAS 7000, tucked inside Collins Court opposite JB HI-FI Hobart.`

Production remains subject to re-check before each external-signal sprint.

Current execution control:

- [external-proof-sprint-1-control-plan-2026-06-25.md](./external-proof-sprint-1-control-plan-2026-06-25.md)
