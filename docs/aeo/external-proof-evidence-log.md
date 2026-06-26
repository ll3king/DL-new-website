# External Proof Evidence Log

Last updated: 2026-06-26

## Purpose

This is the counting log for external Flywheel 1 evidence.

External proof only counts when it has:

- live URL
- date checked
- screenshot or excerpt
- factual alignment status
- source independence status
- reviewer decision

Do not count assumed reputation, old memory, or unverified third-party claims.

## Counting Status

| Platform | URL | Checked date | Evidence status | Alignment | Reviewer decision | Notes |
|---|---|---:|---|---|---|---|
| Google Business Profile / Google Maps | `https://www.google.com/maps/place/Dandy+Lane+Cafe/@-42.8832521,147.328078,17z/` | 2026-06-26 | public Google Maps screenshot captured | strong with scoped proof | count | Formal artifact captured in [external-proof-artifacts-2026-06-26.md](./external-proof-artifacts-2026-06-26.md). Visible screenshots prove Dandy Lane Cafe, 4.6 rating, 978 reviews, Brunch restaurant category, map placement near Collins Street, and business-owner control context. DOM capture also returned address, website, menu link, phone, owner update, review summary, and review snippets, but those fields need a scrolled visible screenshot before they count as visual proof. |
| Tripadvisor | `https://www.tripadvisor.com/Restaurant_Review-g255097-d11801652-Reviews-Dandy_Lane_Cafe-Hobart_Greater_Hobart_Tasmania.html` | 2026-06-26 | user-provided logged-in browser screenshot captured | strong | count | Formal artifact captured in [external-proof-artifacts-2026-06-26.md](./external-proof-artifacts-2026-06-26.md). Screenshot shows TripAdvisor for Business pages and public listing for Dandy Lane Cafe, `locationId=11801652`, 4.6 rating, 231 reviews, address at 138 Collins St / Collins Court, website / phone / email links, hours, About text, features, and traveller contribution cards. Treat screenshot as internal evidence because it includes business-dashboard context. |
| Discover Tasmania | `https://www.discovertasmania.com.au/things-to-do/food-and-drink/dandy-lane-cafe/` | 2026-06-26 | short excerpt captured | strong with wording watch | count | Formal artifact captured in [external-proof-artifacts-2026-06-26.md](./external-proof-artifacts-2026-06-26.md). Confirms hidden-lane brunch cafe, Hobart CBD, Collins Court, specialty coffee, Wine-Infused Benedicts, Potato Parmesan Rosti, Scotch steak sandwich. Risk: includes laptop-friendly / remote-work wording, which should not become the main identity. |
| Hobart & Beyond | `https://hobartandbeyond.com.au/place/dandy-lane-cafe/` | 2026-06-26 | short excerpt captured | strong with wording watch | count | Formal artifact captured in [external-proof-artifacts-2026-06-26.md](./external-proof-artifacts-2026-06-26.md). Confirms hidden-lane brunch cafe, Hobart CBD, Collins Court, specialty coffee, Wine-Infused Benedicts, Potato Parmesan Rosti, Scotch steak sandwich. Risk: includes laptop-friendly / remote-work wording. |
| Hello Hobart | `https://hellohobart.com.au/business/dandy-lane-food-specialty-coffee/` | 2026-06-25 | live browser text verified | partial / needs correction | revise | Supports hidden-gem, Unit 10 / 138 Collins St, brunch, lunch, phone, and website. Do not count for strict acceptance yet because Sunday hours conflict with Tripadvisor and product anchors are missing. |
| Reddit / r/hobart | `https://www.reddit.com/r/hobart/comments/1rvreki/quiet_brunch_place/` | 2026-06-25 | relevant thread found; no Dandy Lane mention or post action yet | opportunity only | do not count yet | Candidate for one transparent, non-promotional reply if owner/staff participation is approved and subreddit rules allow it. |
| Reddit / forums background set | Google-indexed Reddit search results | 2026-06-26 | watchlist created; direct Reddit access blocked | candidate only | do not count yet | See [community-proof-watchlist-2026-06-26.md](./community-proof-watchlist-2026-06-26.md). Google snippets show several r/hobart threads and possible Dandy Lane mentions, but thread bodies and context must be manually verified before any signal counts. |
| Apple Maps / Bing Places | not directly verified | 2026-06-25 | no stable detail page captured | unknown | do not count yet | Needs manual platform verification or owner-console capture. |
| AI answer spot checks | 6-prompt expanded matrix: brunch, specialty coffee, hidden-lane, eggs Benedict, Collins Street breakfast, direct brand query | 2026-06-26 | expanded review captured | conditional / mixed | count with caveat | ChatGPT is strong across the matrix. Perplexity is weak outside hidden-lane and direct brand intent. Gemini is useful but has factual drift. Copilot is blocked by human verification. See [ai-answer-baseline-2026-06-26.md](./ai-answer-baseline-2026-06-26.md) and [ai-recommendation-expanded-review-2026-06-26.md](./ai-recommendation-expanded-review-2026-06-26.md). |

## Current Strict Count

As of 2026-06-26, formal strict external proof count is:

- Counted: Google Business Profile / Google Maps, Tripadvisor, Discover Tasmania, Hobart & Beyond
- Revise / support only: Hello Hobart
- Opportunity only: Reddit / r/hobart quiet brunch thread
- Not counted: Apple Maps, Bing Places
- Community watchlist: created but not counted

Current external proof level:

- Level 1 entity/location consistency: passed for initial proof, because Google Maps and Tripadvisor now both support entity/location
- Level 2 product reinforcement: passed, because Discover Tasmania and Hobart & Beyond now have short-excerpt artifacts
- Level 3 community recognition: not passed, because Reddit/forum evidence has not produced independent Dandy Lane mentions yet. Owner / staff / agent replies can be logged only as compliant participation evidence, not independent community proof.
- Level 4 AI retrieval evidence: conditional, because the first baseline passed with caveats but the expanded matrix shows mixed cross-platform recommendation coverage

Expanded AI recommendation snapshot:

- strict accessible-platform score: `56 / 100`
- practical AI recommendation likelihood: reviewer estimate `68 / 100`
- strongest intent: hidden-lane cafe in Hobart CBD
- weakest intents outside ChatGPT: specialty coffee plus brunch, eggs Benedict, broad Perplexity discovery
- blocked platform: Microsoft Copilot, because a human-verification challenge appeared

## Required Evidence Fields

Every future row should capture:

- date
- platform
- URL
- screenshot path or quoted excerpt
- source type: third-party / owned / affiliated / unclear
- target anchor: entity / local intent / product / coffee / hidden lane
- facts confirmed
- facts contradicted
- owner action needed
- reviewer decision: count / revise / do not count

## Reviewer Rule

No external source counts toward Flywheel 1 unless a strict reviewer can re-check it.
