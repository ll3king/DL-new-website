# GEO / AEO Agent Swarm Control Plan

Last updated: 2026-06-22

## Purpose

This document defines the operating model for Dandy Lane's `AEO / GEO / AI Search Optimization` work.

The model is:

`Controller + specialist agents + strict reviewer`

The goal is not to create more generic content.
The goal is to build a repeatable system that can discover what Google and AI systems already trust, turn that evidence into Dandy Lane answer assets, build external proof signals, and reject weak work before it reaches production.

## Operating Principle

Every GEO / AEO sprint must move through this chain:

1. external reference capture
2. template decomposition
3. gap map
4. Dandy Lane asset plan
5. website implementation or external signal action
6. evidence collection
7. strict review
8. feedback loop
9. scale / revise / stop decision

No sprint can skip the strict review gate.

## Primary Target For First Sprint

Initial target question:

`Where should I go for brunch in Hobart CBD?`

Reason:

- strong local intent
- high visitor and local discovery value
- directly aligned with Dandy Lane's real business
- connects website pages, Google Business Profile, Tripadvisor, Reddit, and AI answer checks
- can lead to booking, walk-in, map direction, phone, or menu actions

Primary page candidates:

- `Location`
- `FAQ`
- `Menu`

First sprint default:

- pilot on `Location + FAQ`
- do not expand to every page until reviewer approves evidence

## Agent Roles

### 1. Controller

Owner:

- primary Codex agent

Responsibilities:

- owns the global plan
- selects sprint target
- writes the context capsule for each role
- assigns bounded work
- prevents scope drift
- collects outputs into a single evidence pack
- decides whether work advances to reviewer
- records final decision and next actions

The Controller must not mark the sprint successful without reviewer approval.

### 2. Reference Scout

Mission:

- find the external reference set that proves what Google and AI systems already trust

Inputs:

- sprint target question
- target query cluster
- known Dandy Lane anchors

Outputs:

- Google top-result capture
- AI answer / citation capture
- Reddit / forum discussion capture
- Tripadvisor / Google Business Profile / local listing capture
- source quality notes

Required capture fields:

- query
- date
- platform
- result URL
- page title
- page type
- visible answer structure
- cited proof signals
- relevance to Dandy Lane
- screenshot or archived evidence when available

Non-goals:

- writing website copy
- deciding final strategy
- posting externally

### 3. Template Analyst

Mission:

- reverse-engineer the structure of pages and sources that already win

Inputs:

- Reference Scout source pack

Outputs:

- competitor decomposition table
- common module map
- missing module map
- AI-citation reason hypothesis
- Dandy Lane opportunity map

Required decomposition fields:

- page URL
- target intent
- first-screen answer
- condition-based recommendation
- comparison table
- FAQ topics
- schema / structured data signals
- local proof
- review proof
- external citation proof
- CTA
- likely reason AI would cite it
- reusable structure
- gap Dandy Lane can exploit

Non-goals:

- writing final public claims
- approving factual accuracy

### 4. Website Asset Builder

Mission:

- turn the approved template map into Dandy Lane website assets

Inputs:

- Template Analyst output
- `data/site.yaml`
- current page content
- approved answerability anchors

Outputs:

- page module plan
- draft copy blocks
- FAQ candidates
- schema candidates
- internal-link plan
- implementation patch only after Controller approval

Required modules:

- one-sentence answer block
- condition conclusion
- comparison table when useful
- FAQ block
- visible evidence links
- clear CTA

Non-goals:

- inventing new claims
- creating low-value AI-search pages
- expanding beyond the approved page set

### 5. External Signal Operator

Mission:

- build real external proof signals and correct factual drift

Inputs:

- source pack
- external proof acceptance standard
- approved public-facing language

Outputs:

- Google Business Profile action list
- Tripadvisor reply / update plan
- local listing correction requests
- Reddit / forum participation plan
- participation log

Operating playbook:

- [external-signal-build-playbook.md](./external-signal-build-playbook.md)

Rules:

- no fake customer voice
- no spam
- no vote manipulation
- no repeated link drops
- disclose owner / staff relationship when applicable
- answer real questions only
- use links only when they are genuinely useful

Non-goals:

- creating artificial backlinks
- posting promotional content into irrelevant communities
- hiding affiliation

### 6. Tracker

Mission:

- turn execution into measurable evidence

Inputs:

- implemented website changes
- external actions
- target query list

Outputs:

- weekly tracking sheet
- AI answer spot-check log
- Google Search Console metric log
- external mention log
- business-signal log

Required tracking fields:

- query
- date
- platform
- page or source tested
- Dandy Lane mentioned: yes / no
- cited URL if available
- answer accuracy
- product anchor present: yes / no
- local anchor present: yes / no
- action signal: impressions / click / direction / booking / phone / mention
- reviewer note

Non-goals:

- declaring success without review
- interpreting weak early noise as proof

### 7. Strict Reviewer

Mission:

- protect quality, evidence integrity, and business truth

The reviewer is independent from execution.
The reviewer must not write the copy, post externally, or perform implementation work for the sprint being reviewed.

The reviewer has veto power.

Reviewer responsibilities:

- check every claim against available evidence
- verify that the chosen target query is commercially and locally relevant
- verify that external references are real and current
- verify that template extraction is supported by the source pack
- reject invented facts, inflated claims, and generic content
- reject artificial external-signal tactics
- verify schema and visible content alignment
- verify that website changes preserve Dandy Lane identity
- verify that tracking evidence is sufficient before success is claimed

Reviewer outputs:

- `pass`
- `pass with conditions`
- `revise`
- `reject`

No sprint can be called successful unless the reviewer returns `pass` or `pass with conditions`.

## Strict Reviewer Gate

The reviewer must answer these questions before approval:

1. Is the target query backed by real search or AI-answer evidence?
2. Did the Reference Scout capture enough head-of-market examples?
3. Did the Template Analyst identify patterns that actually appear in the source pack?
4. Does the proposed Dandy Lane asset use real business facts only?
5. Are all claims consistent with `data/site.yaml` and visible service reality?
6. Does the page serve real customers before it serves search systems?
7. Are FAQ questions phrased like real user questions?
8. Are structured data candidates aligned with visible content?
9. Are external actions transparent and non-spammy?
10. Are Reddit or forum actions based on relevant existing questions?
11. Is there any hidden wedding, event-styling, generic cafe, workspace-first, or SEO-first drift?
12. Is there enough evidence to continue, or should the sprint stop?

Automatic rejection triggers:

- fake reviews
- fake customer posts
- hidden affiliation
- copied competitor copy
- invented awards, ratings, dish details, or hours
- pages made only for AI-search capture with no customer value
- external links posted without relevance
- AI answer test screenshots without date / platform / prompt
- schema that says something the page does not visibly say
- success claim based only on implementation, not signal evidence

## Review Evidence Pack

Every sprint must produce a review pack with:

- sprint target
- query list
- Reference Scout source table
- Template Analyst decomposition table
- gap map
- proposed Dandy Lane page modules
- external action plan
- tracking plan
- factual-risk notes
- implementation diff if code changed
- screenshots or source excerpts where available
- reviewer decision
- reviewer feedback items

## Feedback Loop

Reviewer feedback must be classified into one of four types:

- `fact correction`
- `structure correction`
- `external signal correction`
- `tracking correction`

Required response:

- Controller assigns the correction to the right role
- responsible agent fixes only the assigned issue
- Tracker records the correction
- Strict Reviewer re-checks the changed item

Loop states:

- `open`
- `in revision`
- `ready for re-review`
- `accepted`
- `closed without scaling`

Scaling rule:

- if the reviewer returns `pass`, the sprint may scale to the next page or query cluster
- if the reviewer returns `pass with conditions`, only listed conditions may be executed next
- if the reviewer returns `revise`, no scaling is allowed
- if the reviewer returns `reject`, the sprint stops and must be redesigned from the target-query level

## First Global Sprint Plan

### Sprint 0: Control Setup

Goal:

- establish the agent swarm workflow and review rules

Deliverables:

- this control plan
- acceptance standard link
- reviewer gate
- evidence-pack template
- [geo-sprint-1-swarm-brief.md](./geo-sprint-1-swarm-brief.md)

Exit condition:

- Controller can assign Sprint 1 without ambiguity

### Sprint 1: Reference Capture

Goal:

- prove the target query and collect head-of-market references

Target:

- `Where should I go for brunch in Hobart CBD?`

Query cluster:

- `best brunch Hobart CBD`
- `best breakfast Hobart CBD`
- `Hobart CBD cafe brunch`
- `hidden lane cafe Hobart`
- `eggs benedict Hobart`
- `specialty coffee brunch Hobart`

Deliverables:

- Google top-result capture
- AI answer / citation capture
- Reddit / forum discussion capture
- Tripadvisor / GBP / local listing capture

Reviewer exit condition:

- all minimum source counts, recency rules, source-quality scores, and stop conditions in [geo-sprint-1-swarm-brief.md](./geo-sprint-1-swarm-brief.md) are satisfied
- enough external evidence exists to justify a Dandy Lane page pilot

### Sprint 2: Template Extraction

Goal:

- turn source evidence into reusable page and external-signal patterns

Deliverables:

- decomposition table
- common module map
- gap map
- Dandy Lane opportunity map

Reviewer exit condition:

- extracted template is source-backed and not generic

### Sprint 3: Website Pilot

Goal:

- produce a controlled `Location + FAQ` pilot

Deliverables:

- one-sentence answer module
- condition conclusion module
- comparison module if supported by reference patterns
- FAQ module
- schema candidates
- internal-link plan
- implementation patch

Reviewer exit condition:

- website pilot is accurate, useful, and structurally aligned with source-backed template

### Sprint 4: External Signal Build

Goal:

- correct external facts and begin transparent participation

Deliverables:

- external signal action log
- GBP update plan
- Tripadvisor reply / update plan
- listing correction requests
- Reddit / forum participation log
 - pre-post review notes
 - captured URLs, screenshots, or excerpts

Reviewer exit condition:

- external actions are real, transparent, relevant, and documented

### Sprint 5: Tracking

Goal:

- determine whether the sprint creates real search / AI / business movement

Deliverables:

- weekly query checks
- AI answer spot checks
- GSC metrics
- external mention tracking
- business action signals

Reviewer exit condition:

- signal evidence is strong enough to scale, or weak enough to revise / stop

## Final Success Criteria

The global plan succeeds only when all are true:

- target query selection is evidence-backed
- Dandy Lane appears correctly in AI answer checks for at least one core local-intent question
- external listings do not contradict the official site on core facts
- at least one external source supports the same identity as the official site
- Reddit / forum participation is transparent and non-spammy
- website pages remain useful to real customers
- no fabricated facts or inflated claims are present
- tracker records movement or clearly records no movement
- strict reviewer approves the evidence pack

If the reviewer cannot verify the signal, the work is not counted as a successful GEO / AEO win.

## One-Line Rule

GEO / AEO work is not complete when content is published.
It is complete only when a strict reviewer can verify that real external and AI-answer signals support the Dandy Lane answer asset.
