# Listing Correction Pack

Checked date: 2026-06-26

## Purpose

This file controls third-party listing correction work for Flywheel 1:

`AEO / GEO / AI Search Optimization`

The goal is not to create new generic pages.
The goal is to make independent public sources accurately repeat Dandy Lane's real identity.

## Official Facts To Use

Source of truth:

- `data/site.yaml`
- `docs/website-information-structure.zh-CN.md`
- `docs/menu/current-menu-source-2026-06-24.md`

Official listing facts:

- Business name: `Dandy Lane Cafe`
- Identity: Hobart CBD hidden-lane breakfast-to-brunch cafe
- Address: `Unit 10 / 138 Collins Street, Hobart TAS 7000`
- Local marker: Collins Court, opposite JB HI-FI Hobart
- Phone: `0498 061 067`
- Email: `dandylane-hobart@dandylanecafe.com`
- Website: `https://dandylanecafe.com`
- Hours: Monday-Friday 7:00 am-3:00 pm; Saturday-Sunday 9:00 am-2:00 pm
- Core anchors: Wine-Infused Benedict, Potato Parmesan Rosti, Scotch Steak Sandwich, specialty coffee

## Correction Targets

| Source | Current status | Correction route | Required action | Decision |
|---|---|---|---|---|
| Hello Hobart | Revise / support only because hours conflict and product anchors are missing. | `https://hellohobart.com.au/information-for-businesses/`, `https://hellohobart.com.au/submit-your-business/`, `hello@hellohobart.com.au` | Request Sunday hours correction and product-led description update. | priority |
| Discover Tasmania | Counted, but wording still leans toward laptop-friendly / remote-work framing. | ATDW path: `https://www.tourismtasmania.com.au/resources-for-industry/growing-your-business/building-foundations/get-listed-on-atdw/` | Update ATDW / Discover Tasmania wording if owner access exists. | maintenance |
| Hobart & Beyond | Counted, but wording still leans toward laptop-friendly / remote-work framing. | `https://hobartandbeyond.com.au/contact-us/` | Request product-led wording if platform accepts listing edits. | maintenance |
| Tripadvisor | Counted from user-provided business-page screenshot. | TripAdvisor for Business owner dashboard | Verify hours, About, website, category, and photos manually from owner account. | maintain |
| Google Business Profile / Google Maps | Counted for scoped proof only. | Google Business Profile owner console | Capture scrolled screenshots for address, website, menu link, phone, owner update, and review snippets if those fields need to be scored as visual proof. | maintain |

## AI Impact Priority

This correction pack now supports the expanded AI recommendation review:

- [ai-recommendation-expanded-review-2026-06-26.md](./ai-recommendation-expanded-review-2026-06-26.md)

Current AI gap:

- ChatGPT is strong.
- Perplexity is weak for broad discovery outside hidden-lane intent.
- Gemini finds Dandy Lane but imports stale or unsupported product / positioning details.
- Copilot is blocked by human verification and must be rerun later.

Execution order:

| Priority | Target | Why it matters for AI recommendation | Pass condition |
|---:|---|---|---|
| 1 | Hello Hobart | Fixes a live hours contradiction and adds missing product anchors. | Sunday hours match official site and description includes hidden-lane brunch, Wine-Infused Benedict, Potato Parmesan Rosti, Scotch Steak Sandwich, and specialty coffee. |
| 2 | Discover Tasmania / ATDW | High-authority travel source already cited by AI; current wording can over-amplify workspace identity. | Description is product-led; workspace / laptop wording is secondary or absent. |
| 3 | Hobart & Beyond | High-authority local travel source with good anchors but workspace drift. | Description is product-led and matches official site facts. |
| 4 | TripAdvisor | Review-platform proof is strong, but owner-facing fields must stay aligned. | About, category, hours, website, photos, and visible menu references are verified from owner account. |
| 5 | Google Business Profile | Strongest entity proof source; secondary visual evidence needs capture. | Scrolled screenshots capture address, phone, website, menu link, hours, photos, and review snippets. |
| 6 | AI-cited drift sources | Gemini appears to use third-party source names that may contain stale dishes or positioning. | Exact source URL is identified, then classified as correct / correction-needed / not actionable. |

Do not send or submit any correction until the Controller approves the exact channel and final wording.

## Evidence Artifacts

| Artifact | What it supports |
|---|---|
| `docs/aeo/artifacts/hello-hobart-business-info-2026-06-26.png` | Hello Hobart accepts business listings and asks businesses to keep details current. |
| `docs/aeo/artifacts/hello-hobart-submit-business-form-2026-06-26.png` | Hello Hobart form fields include business description, address, opening hours, email, phone, and website. |
| `docs/aeo/artifacts/tourism-tasmania-atdw-update-path-2026-06-26.png` | Discover Tasmania updates flow through ATDW / Tourism Tasmania listing management. |
| `docs/aeo/artifacts/hobart-and-beyond-contact-us-2026-06-26.png` | Hobart & Beyond has a contact route for listing / destination website follow-up. |

## Hello Hobart Draft

Subject:

`Dandy Lane Cafe listing update request`

Draft:

```text
Hello,

I am writing to request a factual update for the Dandy Lane Cafe listing on Hello Hobart.

Official business details:
Dandy Lane Cafe
Unit 10 / 138 Collins Street, Collins Court, Hobart TAS 7000
Phone: 0498 061 067
Website: https://dandylanecafe.com

Current opening hours:
Monday-Friday: 7:00 am-3:00 pm
Saturday-Sunday: 9:00 am-2:00 pm

Preferred short description:
Dandy Lane Cafe is a Hobart CBD breakfast-to-brunch cafe tucked inside Collins Court, known for Wine-Infused Benedict, Potato Parmesan Rosti, Scotch Steak Sandwich, seasonal brunch specials, and specialty coffee.

Please update any outdated hours or description fields so the listing matches the official website.

Thank you.
```

## Discover Tasmania / ATDW Draft

Subject:

`Dandy Lane Cafe ATDW / Discover Tasmania listing update`

Draft:

```text
Hello,

I am writing to update the Dandy Lane Cafe listing details.

Preferred description:
Dandy Lane Cafe is a Hobart CBD breakfast-to-brunch cafe tucked inside Collins Court at Unit 10 / 138 Collins Street, known for Wine-Infused Benedict, Potato Parmesan Rosti, Scotch Steak Sandwich, seasonal brunch specials, and specialty coffee.

Please keep the listing focused on breakfast, brunch, specialty coffee, Collins Court, and the current signature dishes.
Workspace or laptop-friendly details are fine as secondary practical information, but they should not be the main identity of the listing.

Official website:
https://dandylanecafe.com
```

## Hobart & Beyond Draft

Subject:

`Dandy Lane Cafe listing wording update`

Draft:

```text
Hello,

Could you please update the Dandy Lane Cafe listing wording so it matches our current public positioning?

Preferred description:
Dandy Lane Cafe is a Hobart CBD breakfast-to-brunch cafe tucked inside Collins Court at Unit 10 / 138 Collins Street, known for Wine-Infused Benedict, Potato Parmesan Rosti, Scotch Steak Sandwich, seasonal brunch specials, and specialty coffee.

Please keep laptop-friendly / workspace details secondary, not the main description.

Official website:
https://dandylanecafe.com
```

## Sending Gate

Do not submit forms, send emails, or change external accounts from this file without explicit Controller approval.

Before sending:

- confirm the exact channel
- confirm the owner account or sender email
- confirm the final wording
- attach or reference official website facts only
- log sent date, channel, and response status in the external proof evidence log
