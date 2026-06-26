# GEO / AEO Sprint 1 Swarm Brief

Last updated: 2026-06-26

## Sprint Name

`Sprint 1: Reference Capture And External Signal Design`

## Controller Position

The Controller owns the sprint.
Specialist agents execute bounded parts of the work.
The Strict Reviewer decides whether the sprint can move forward.

This sprint does not implement website changes yet.
It executes reference capture design and verifies the evidence system required before a website pilot or external posting cycle begins.

## Sprint Target

Primary question:

`Where should I go for brunch in Hobart CBD?`

Primary business intent:

- local discovery
- visitor discovery
- brunch / breakfast decision
- map direction
- booking
- walk-in

Primary Dandy Lane anchors:

- Hobart CBD
- Collins Court
- hidden-lane breakfast-to-brunch cafe
- Wine-Infused Benedict
- Potato Parmesan Rosti
- Scotch Steak Sandwich
- Specialty Coffee

## Active Agent Assignments

### Reference Scout

Objective:

- build the source-capture protocol for Google, AI answer engines, Reddit / forums, Tripadvisor, Google Business Profile, and local listings

Required output:

- target query cluster
- capture table fields
- minimum source count
- source-quality rules
- evidence required before template extraction
- rejection triggers

Status:

- completed initial packet

### External Signal Architect

Objective:

- turn the external signal playbook into an executable first-sprint action model

Required output:

- zero-to-validated-signal operating model
- platform action backlog
- pre-post review checklist
- tracking fields
- reviewer pass / fail criteria

Status:

- completed initial packet

### Strict Reviewer

Objective:

- review whether the current control docs are sufficient to start Sprint 1

Required output:

- decision: pass / pass with conditions / revise / reject
- blockers
- missing reviewer gates
- missing external signal validation
- required changes before Sprint 1 execution

Historical status:

- returned `revise`; Controller must resolve blockers before Sprint 1 execution

Current status:

- 2026-06-26 Strict Reviewer returned `revise` because Google Business Profile evidence was overclaimed
- Controller narrowed the Google Business Profile claim to scoped screenshot proof
- ready for re-review before community-proof execution
- not ready for template extraction or full external-proof pass

## Controller Deliverables

The Controller has now fixed the required Sprint 0 launch controls:

- finalized Sprint 1 source-capture plan
- finalized external-signal execution plan
- reviewer-approved evidence-pack format
- production-status verification gate
- per-agent reviewer gates
- decision on whether Sprint 1 can begin after reviewer re-check

Related comparison input:

- [operator-chatgpt-answer-comparison-2026-06-24.md](./operator-chatgpt-answer-comparison-2026-06-24.md)

Related current execution plan:

- [external-proof-sprint-1-control-plan-2026-06-25.md](./external-proof-sprint-1-control-plan-2026-06-25.md)

## 2026-06-26 External Proof Scout Status

Initial read-only scout work found a usable but incomplete external proof set.

Formal counted sources:

- Google Business Profile / Google Maps
- Tripadvisor
- Discover Tasmania
- Hobart & Beyond
- AI answer baseline: initial baseline passed with caveats; expanded review is conditional / mixed

Formal count note:

- TripAdvisor is counted from the user-provided logged-in browser screenshot. Treat that screenshot as internal evidence because it includes business-dashboard context.
- Google Business Profile / Google Maps is counted from the public Google Maps screenshots for scoped proof only: entity, category, rating/review count, map placement, and owner-control context. Address, website, menu link, phone, owner update, and review snippets remain DOM-supported until scrolled visual screenshots are captured.
- Current artifact file: [external-proof-artifacts-2026-06-26.md](./external-proof-artifacts-2026-06-26.md)
- Current AI baseline file: [ai-answer-baseline-2026-06-26.md](./ai-answer-baseline-2026-06-26.md)
- Current expanded AI review: [ai-recommendation-expanded-review-2026-06-26.md](./ai-recommendation-expanded-review-2026-06-26.md)
- Current community watchlist: [community-proof-watchlist-2026-06-26.md](./community-proof-watchlist-2026-06-26.md)
- Current listing correction pack: [listing-correction-pack-2026-06-26.md](./listing-correction-pack-2026-06-26.md)

Support / revise sources:

- Hello Hobart: useful local directory evidence, but hours conflict and product-anchor gaps prevent strict count

Opportunity only:

- Reddit / r/hobart quiet brunch thread: relevant participation candidate, but not evidence until a compliant action is live and reviewed
- Google-indexed Reddit results show more candidates, including possible existing Dandy Lane mentions, but direct Reddit access was blocked and thread context needs manual verification

Do not count yet:

- Apple Maps / Bing Places: no stable detail evidence captured

Controller decision:

- proceed with External Proof Sprint 1 execution
- do not start website-page expansion from this source set
- prioritize listing corrections, AI-cited drift-source audit, Reddit/forum compliance review, and recurring AI matrix reruns
- do not publish Reddit/forum replies until Controller approval and Strict Reviewer pre-post approval are both recorded
- treat owner / staff / agent Reddit replies as compliant participation evidence, not independent community proof

## Finalized Sprint 1 Capture Protocol

### Required Query Cluster

All six queries are mandatory:

- `best brunch Hobart CBD`
- `best breakfast Hobart CBD`
- `Hobart CBD cafe brunch`
- `hidden lane cafe Hobart`
- `eggs benedict Hobart`
- `specialty coffee brunch Hobart`

Secondary QA prompts:

- `Where should I go for brunch in Hobart CBD?`
- `Is Dandy Lane a brunch cafe or workspace-first?`
- `Where can I get specialty coffee and brunch in Hobart?`

### Minimum Source Counts

Sprint 1 cannot move to Template Extraction unless all minimums are met:

| Source type | Minimum |
|---|---:|
| Target query coverage | 6 / 6 queries |
| Google organic / local SERP evidence | at least 1 high-quality result and 1 local-pack or map candidate per query |
| Recommended Google depth | top 3 organic results per query when available |
| AI answer checks | at least 2 AI systems for the primary prompt set |
| Reddit / forum threads | at least 5 relevant threads captured |
| Independent Reddit / forum user-originated mentions | at least 2 |
| Product-anchor community context | at least 1 thread or source |
| Google Business Profile / Google Maps evidence | at least 1 current capture |
| Tripadvisor evidence | completed for initial proof by user-provided logged-in browser screenshot |
| Local tourism / directory listings | at least 2 current captures |

### Recency And Currentness Rules

- Live business facts must be captured inside the sprint window.
- AI answer checks must include date, platform, prompt, answer, and cited URL when available.
- Google / local SERP captures must include date and query.
- Reddit / forum threads may be older, but currentness must be marked as `active`, `recent`, `older background`, or `stale`.
- Listings with known factual drift must be marked `risk: factual mismatch` until corrected or verified.

### Source Quality Rubric

Use the source quality rubric in:

- [external-signal-build-playbook.md](./external-signal-build-playbook.md)

Template Extraction requires:

- at least three sources scored `4` or higher
- no accepted source scored `1`
- reviewer approval that the source set shows external trust convergence, not only own-site claims

### Hard Stop Conditions

Stop before Template Extraction if:

- any mandatory query is missing
- fewer than two AI systems are checked
- Google Business Profile capture becomes stale or contradictory
- source set is mostly owned media
- source contradictions cannot be explained or isolated
- reviewer returns `reject`

Missing Reddit / forum evidence blocks community-proof scoring.
It does not block Google Business Profile capture, listing corrections, review-platform evidence capture, or AI-answer baseline checks.

## Evidence Pack Format

Every evidence item must include:

- date
- platform
- query or source
- query intent
- URL
- source type
- page type details
- screenshot / excerpt status
- visible answer structure
- cited proof signals
- Dandy Lane relevance
- signal layer
- expected use
- risk note
- source quality score
- platform rule checked
- affiliation status
- live URL verified
- source independence
- duplicate-language check
- reviewer status

## Per-Agent Reviewer Gates

### Reference Scout Gate

Pass requires:

- all mandatory query and source-count minimums met
- evidence table complete
- source quality scores assigned
- source contradictions flagged
- live captures dated

Fail if:

- source pack lacks external trust convergence
- evidence is undated
- AI answers lack prompts
- local facts contradict the official site without a risk note

### Template Analyst Gate

Pass requires:

- every extracted pattern maps to at least one captured source
- gaps are source-backed, not invented
- Dandy Lane opportunity map preserves real business identity

Fail if:

- template is generic
- competitor copy is copied
- recommendation is not supported by the source pack

### External Signal Operator Gate

Pass requires:

- every external action passes the signal validation matrix
- platform rules are checked
- affiliation status is clear
- live URL and screenshot / excerpt are stored

Fail if:

- hidden affiliation exists
- reply is irrelevant
- same wording is reused
- action cannot plausibly affect discovery, trust, or conversion

### Tracker Gate

Pass requires:

- query, platform, date, prompt or source, citation, and result are recorded
- movement or no movement is explicitly documented

Fail if:

- success is claimed without measurable signal evidence
- screenshots / excerpts are missing
- noisy one-off changes are treated as proof

## Sprint 1 Exit Gate

Sprint 1 can move to Template Extraction only if:

- target query cluster is reviewer-approved
- external reference capture is sufficient
- head-of-market source examples are documented
- external signal opportunities are real and non-spammy
- every proposed public action has a pre-post review path
- production homepage remains verified against the product-led direction
- Strict Reviewer returns `pass` or `pass with conditions`

## Stop Conditions

Stop the sprint if:

- source capture cannot verify meaningful search or AI-answer intent
- external signals require hidden affiliation or fake participation
- references do not support a Dandy Lane page pilot
- reviewer returns `reject`

## One-Line Rule

Sprint 1 exists to prove the target and signal system before execution.
No website rewrite or external posting is allowed before the reviewer gate.
