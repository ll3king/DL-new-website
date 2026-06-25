# Flywheel 1 Review: 2026-06-25

## Scope

Independent reviewer check for:

`AEO / GEO / AI Search Optimization`

This review covered the repository and live production surfaces for the Dandy Lane Cafe website.

It did not modify frontend code, booking logic, AI chat logic, or SMS logic.

## Final Scores

| Area | Score | Status |
|---|---:|---|
| Website-controlled AEO / GEO | 88 / 100 | Strong conditional pass |
| External proof | 34 / 100 | Open / weak |
| Overall Flywheel 1 | 70 / 100 | Conditional pass |

Reviewer verdict:

`Conditional pass`

The website-controlled layer is strong.
The remaining blocker is not more website content.
The remaining blocker is verified external proof and crawl-governance cleanup.

## Production Evidence Checked

Checked on 2026-06-25:

- `https://dandylanecafe.com/`
- `https://dandylanecafe.com/menu`
- `https://dandylanecafe.com/faq`
- `https://dandylanecafe.com/location`
- `https://dandylanecafe.com/booking`
- `https://dandylanecafe.com/stories`
- `https://dandylanecafe.com/robots.txt`
- `https://dandylanecafe.com/sitemap.xml`

Observed:

- production `/menu` title is `Menu Highlights`
- public menu page has JSON-LD
- public menu page does not expose item-level `$` prices
- public menu schema does not expose `price`, `offers`, or `priceRange`
- canonical links are present on checked HTML pages
- sitemap is present
- robots.txt is present

## Pass Areas

### Entity Identity

Pass.

The live homepage and schema identify Dandy Lane Cafe as a Hobart CBD breakfast and brunch cafe.
The address, Collins Court / Collins Street positioning, phone, opening hours, and social links are consistent with current website governance.

### Product Anchors

Pass.

Core anchors appear across homepage, menu, FAQ, story schema, and internal data:

- Wine-Infused Benedict
- Potato Parmesan Rosti
- Scotch Steak Sandwich
- Specialty Coffee
- house hollandaise
- breakfast-to-brunch
- hidden lane / Collins Court / Hobart CBD

### Public Menu Price Rule

Pass.

The owner rule is now:

- internal source keeps prices for governance
- public website presents `Menu Highlights`
- public website does not show item-level prices

Live production currently matches this rule.

### Schema / Visible Content Alignment

Pass with watch.

Menu schema now follows the visible `Menu Highlights` model and does not expose hidden prices.
Homepage schema supports restaurant, local business, address, opening hours, menu URL, booking URL, sameAs, and knowsAbout anchors.

## Conditional / Risk Areas

### P1: Sitemap Promotes Admin

Current issue:

- sitemap includes `/admin`

Why it matters:

- admin is an operational surface, not an answerability surface
- it should not be promoted for public discovery

Recommended action:

- clarify that this does not mean deleting or disabling the admin dashboard
- if approved by the owner, exclude `/admin` from public discovery surfaces such as sitemap or add noindex
- keep admin functionality and staff access untouched

Current owner decision:

- approved on 2026-06-25

Execution update:

- implemented in repo on 2026-06-25 through `include_in_sitemap: false` and `robots: noindex, nofollow`
- admin dashboard functionality and staff access remain untouched

### P1: Workspace / Laptop-Friendly Page Is Too Crawl-Prominent

Current issue:

- facility page exists at `/facilities/laptop-friendly-seating`
- sitemap includes the facility URL
- FAQ still contains a laptop-friendly answer, although correctly framed as secondary

Why it matters:

- workspace has been explicitly demoted as a primary identity
- search systems may still over-learn Dandy Lane as workspace-first if this surface remains prominent

Recommended action:

- keep workspace information tertiary
- remove the facility page from sitemap and mark it noindex
- keep FAQ workspace answer last and facility-framed

Execution update:

- implemented in repo on 2026-06-25 through `include_in_sitemap: false` and `robots: noindex, follow`

### P1: Robots / AI Crawler Policy Needs Owner Decision

Production `robots.txt` is Cloudflare-managed and currently includes:

- `Content-Signal: search=yes,ai-train=no`
- `Allow: /`
- disallow rules for several AI / training crawlers, including GPTBot, ClaudeBot, Google-Extended, Applebot-Extended, CCBot, and others

Why it matters:

- this is not automatically wrong
- it protects against some AI training use
- but it may reduce direct AI crawler access depending on crawler behavior

Recommended action:

- decide the policy intentionally:
  - keep restrictive AI crawler policy for rights/control
  - or selectively allow crawlers if AI search visibility becomes more important than restriction
- document the chosen policy in Flywheel 1 governance

Execution update:

- direct Cloudflare MCP write access was retried on 2026-06-25
- Pages, zone, DNS, and zone Rulesets list access worked
- Bot Management, Pay Per Crawl, Rulesets entrypoint, and Rulesets write probes were not authorized
- repo-level fallback control was implemented through generated `robots.txt`, `_headers`, page robots meta, and sitemap exclusion

### P1: External Proof Is Still Not Countable Enough

Current issue:

- docs identify Tripadvisor, Google Business Profile, Discover Tasmania, Hobart & Beyond, Hello Hobart, Reddit, and AI-answer checks
- but external proof cannot fully count without live evidence logs

Recommended action:

- live-verify external sources
- store date, URL, screenshot or excerpt, factual alignment, and reviewer count decision

## Optimization Backlog

### P0

None found.

### P1

- Keep `/admin` as staff backend functionality while excluding it from public discovery through sitemap / noindex treatment.
- Keep tertiary crawl treatment for `/facilities/laptop-friendly-seating`.
- Keep repo-level AI crawler fallback policy aligned with the owner decision, and only modify Cloudflare AI Crawl Control directly after dashboard/API write access is confirmed.
- Live-verify Google Business Profile, Tripadvisor, Discover Tasmania, Hobart & Beyond, and Hello Hobart.
- Create an external proof evidence log with reviewer count decisions.

### P2

- Keep recurring checks that public menu has no `price`, `offers`, `priceRange`, or visible `$`.
- Keep the workspace FAQ answer last and explicitly secondary.
- Keep `seo` as an internal infrastructure namespace only, or rename it during a future cleanup.
- Run dated AI-answer spot checks for the approved core prompts.

## Repeatable Acceptance Criteria

Future Flywheel 1 checks pass only when:

- public pages preserve the core anchors
- public menu remains `Menu Highlights`
- public pages and JSON-LD expose no item-level prices
- schema matches visible content
- sitemap and noindex policy match owner-approved public-discovery boundaries
- workspace stays tertiary
- external proof has live URL, date, screenshot or excerpt, and reviewer decision
- AI-answer checks are dated, prompt-specific, platform-labeled, and fact-checked

## Final Position

Website-controlled Flywheel 1 is strong and should remain in maintenance mode.

The next meaningful improvement is not more on-site content.
It is:

1. crawl-governance cleanup
2. external proof evidence logging
3. real third-party signal building
4. recurring AI-answer checks
