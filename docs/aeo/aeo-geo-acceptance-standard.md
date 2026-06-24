# AEO / GEO Acceptance Standard

Last updated: 2026-06-21

## Purpose

This document defines the strict acceptance standard for Flywheel 1:

`AEO / GEO / AI Search Optimization`

It separates what Dandy Lane can control internally from external proof signals that must be earned or corrected outside the website.

Current project status:

- Initial AEO / GEO optimization has been completed and independently validated.
- Internal website-controlled AEO / GEO is in maintenance mode.
- External proof expansion remains the main open workstream.
- Production homepage re-verified on 2026-06-22 against the product-led direction.

Control model:

- [geo-agent-swarm-control-plan.md](./geo-agent-swarm-control-plan.md)

External signal build model:

- [external-signal-build-playbook.md](./external-signal-build-playbook.md)

## Strategic Language

Use:

- `AEO / GEO / AI Search Optimization`
- answerability
- entity clarity
- external proof consistency
- machine-readable trust

Do not use as the strategic frame:

- `SEO optimization`
- generic SEO project
- content expansion for traffic

`SEO` is allowed only when describing infrastructure such as crawlability, schema, canonical URLs, metadata, internal links, sitemap, robots, redirects, structured data, or performance.

## Business Identity Gate

The site passes only if all primary answer surfaces describe Dandy Lane as:

- a Hobart CBD hidden-lane breakfast-to-brunch cafe
- located in Collins Court / Unit 10 / 138 Collins Street / Hobart CBD
- known for signature brunch dishes and specialty coffee

The site fails if primary surfaces frame Dandy Lane as:

- a wedding business
- an event styling business
- a generic cafe
- a laptop / remote-work venue as the main identity
- an SEO project

## Core Answerability Anchors

The following anchors must remain visible, consistent, and internally linked where relevant:

- Wine-Infused / One-Infused Benedict
- daily hand-whisked hollandaise
- Scotch Steak Sandwich
- Specialty Coffee
- breakfast-to-brunch
- hidden lane / Collins Court / Hobart CBD

Passing standard:

- each priority anchor has a visible page-level mention
- each priority anchor has at least one supporting explanation surface
- each priority menu anchor connects back to either menu, FAQ, story, or homepage evidence
- no priority anchor contradicts `data/site.yaml`

## Controlled Acceptance Scorecard

This scorecard covers only what the website can control directly.
External proof is scored separately.

| Area | Weight | Strict pass condition | Current status |
|---|---:|---|---|
| Entity identity | 15 | Name, address, local markers, cafe category, and core purpose are consistent across site data, visible content, and schema. | Pass |
| Product anchors | 15 | Signature products are stable across homepage, menu, FAQ, stories, and structured data. | Pass |
| Local intent | 10 | Hobart CBD / Collins Court / hidden-lane context appears on key answer surfaces. | Pass |
| Answer structure | 15 | FAQ, homepage, menu, and stories answer likely AI-search questions directly and without generic filler. | Pass |
| Schema / structured data | 15 | JSON-LD exists, uses relevant schema.org types, is aligned with visible content, and avoids hidden or misleading claims. | Pass |
| Crawl and canonical infrastructure | 10 | Canonicals, sitemap, robots, redirects, and public HTML output are present and aligned. | Pass |
| Internal evidence graph | 10 | Homepage, FAQ, menu, and story surfaces reinforce each other through consistent anchors and links. | Pass |
| Deprecated-frame suppression | 10 | Wedding, event styling, generic cafe, workspace-first, and SEO-first narratives are absent from primary framing. | Pass |

Controlled acceptance conclusion:

`High-pass / green` for the self-controlled website layer.

This does not mean the total AEO / GEO system is complete. It means the website itself is no longer the main blocker.

## External Proof Acceptance Scorecard

External proof is the remaining non-green area because it depends on third-party surfaces and real public signals.

| Area | Weight | Strict pass condition | Current status |
|---|---:|---|---|
| Google Business Profile consistency | 20 | Name, address, hours, category, website, and menu / booking references match the official site. | Needs live verification |
| Major travel / local listings | 20 | Tripadvisor, Discover Tasmania, Hobart & Beyond, Hello Hobart, and other high-authority listings reinforce brunch/product identity and correct hours. | Partial |
| Review-platform factual consistency | 15 | Public review snippets support breakfast/brunch, coffee, location, and signature product perception without relying on unverifiable claims. | Partial |
| Reddit signal matrix | 25 | Relevant Reddit discussions provide natural, non-spam references to Dandy Lane as a Hobart brunch / coffee / hidden-lane option. | Open workstream |
| AI-answer spot checks | 20 | ChatGPT, Gemini, Perplexity, Google AI features, and Bing/Copilot answer core questions with correct entity, location, and product anchors. | Needs recurring checks |

External proof conclusion:

`Amber / open`.

The next improvement should focus on correcting third-party factual drift and earning real public discussion signals, especially Reddit.

## Reddit Signal Matrix

Reddit should be treated as a authenticity and discovery signal, not a posting channel for promotion.

Target communities should be evaluated before any participation:

| Signal lane | Purpose | Good signal | Bad signal |
|---|---|---|---|
| Hobart local recommendations | Confirm Dandy Lane as a real local option | Locals mention Dandy Lane when asked for brunch, breakfast, coffee, or CBD cafe recommendations. | Owner-created posts pretending to be customers. |
| Tasmania travel planning | Connect Dandy Lane with visitor intent | Visitors ask where to eat in Hobart CBD and receive natural Dandy Lane mentions. | Repeated link drops to the official site. |
| Food / brunch discussion | Reinforce product anchors | Users discuss Wine-Infused Benedicts, Scotch Steak Sandwich, coffee, or hidden-lane brunch. | Generic "best cafe" claims with no product detail. |
| Coffee-specific discovery | Support specialty coffee memory | Users mention coffee quality, flat white, brunch pairing, or location convenience. | Over-claiming awards or ratings without proof. |
| Reputation correction | Reduce factual drift | Wrong hours, wrong location, or wrong identity are corrected with source-backed facts. | Argumentative or defensive replies. |

Minimum Reddit acceptance standard:

- at least 3 relevant threads across Hobart / Tasmania / travel / food contexts
- at least 2 independent user-originated mentions
- at least 1 thread that connects Dandy Lane to a core product anchor, not only the brand name
- no vote manipulation, astroturfing, duplicate spam, or fake customer voice
- any owner / staff participation must be transparent and useful

Before any Reddit / forum posting, the signal must pass the validation matrix in:

- [external-signal-build-playbook.md](./external-signal-build-playbook.md)

Reddit operating rule:

- answer questions only when relevant
- disclose owner / staff relationship when applicable
- link the canonical page only when it genuinely helps
- prioritize helpful local detail over promotional wording
- respect each community's rules before posting

## AI Answer Spot-Check Prompts

Use these prompts during recurring acceptance checks:

- "Where should I go for brunch in Hobart CBD?"
- "What is Dandy Lane Cafe known for?"
- "Where can I get eggs Benedict in Hobart?"
- "Best breakfast near Collins Street Hobart"
- "Hidden lane cafe in Hobart CBD"
- "Where can I get specialty coffee and brunch in Hobart?"
- "Is Dandy Lane Cafe a brunch cafe or a workspace cafe?"

Strict pass condition:

- AI answer names Dandy Lane Cafe correctly
- AI answer places it in Hobart CBD / Collins Court / Collins Street
- AI answer mentions brunch / breakfast / coffee
- AI answer includes at least one product anchor when the query implies food
- AI answer does not describe Dandy Lane as wedding, event styling, or workspace-first

## Maintenance Rules

Run a Flywheel 1 acceptance check when:

- `data/site.yaml` changes
- menu anchors change
- opening hours change
- address, phone, booking, or Google Maps links change
- story ordering or answer summaries change
- external listings are corrected
- production deploy changes homepage, FAQ, menu, location, or story pages

Do not expand content only to target AI search.
Every new page or story must have a real customer-facing reason first.

## Source Basis

This standard is based on:

- Google Search Central structured data guidelines: structured data should represent visible page content, use supported formats such as JSON-LD, remain crawlable, and avoid misleading or hidden claims.
- Google Search Central people-first content guidance: content should be useful, reliable, and made for people rather than search engines.
- Google Business Profile guidelines: public business facts should represent the real business accurately and consistently.
- schema.org Restaurant vocabulary: restaurant / local business data should use specific, relevant entity properties.
- Reddit Reddiquette: community participation should be relevant, factual, non-spammy, and respectful of community rules.

Reference URLs:

- https://developers.google.com/search/docs/appearance/structured-data/sd-policies
- https://developers.google.com/search/docs/fundamentals/creating-helpful-content
- https://developers.google.com/search/docs/fundamentals/using-gen-ai-content
- https://support.google.com/business/answer/3038177
- https://schema.org/Restaurant
- https://support.reddithelp.com/hc/en-us/articles/205926439-Reddiquette

## Final Acceptance Position

As of this document:

- Website-controlled AEO / GEO: `High-pass / green`
- External proof consistency: `Amber / open`
- Reddit signal matrix: `Open priority`
- Overall Flywheel 1: `Maintenance mode with external proof expansion`

The practical conclusion is:

The current website has already reached a high standard for self-controlled AEO / GEO. The next meaningful gains should come from external factual consistency and real third-party discussion signals, not from adding more generic website content.
