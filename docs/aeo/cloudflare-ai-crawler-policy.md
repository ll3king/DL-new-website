# Cloudflare AI Crawler Policy

Last updated: 2026-06-25

## Purpose

This note records the current production crawler policy that affects Flywheel 1:

`AEO / GEO / AI Search Optimization`

This is a business-policy decision, not a normal website content edit.

## Current Production Observation

Production `https://dandylanecafe.com/robots.txt` currently appears to be Cloudflare-managed.

Observed on 2026-06-25:

- `Content-Signal: search=yes,ai-train=no`
- general crawling is allowed through `User-agent: *` and `Allow: /`
- sitemap is declared as `https://dandylanecafe.com/sitemap.xml`
- several AI / training crawlers are disallowed, including GPTBot, ClaudeBot, Google-Extended, Applebot-Extended, CCBot, and others

## Interpretation

This policy is not automatically wrong.

It means:

- search indexing is intentionally allowed
- AI training is intentionally restricted
- some AI crawler access is blocked at the robots layer

For Dandy Lane, this creates a tradeoff:

- stricter control may protect content rights and reduce unwanted AI training use
- looser crawler access may increase the chance that AI search systems fetch official facts directly

## Recommended Owner Decision

Keep the current restrictive AI-training posture unless the owner explicitly decides that direct AI crawler access is more important than crawler restriction.

If changing this in Cloudflare:

1. Keep normal search crawling allowed.
2. Keep `ai-train=no` unless the business intentionally allows AI training.
3. Decide separately whether to allow any AI search / grounding crawlers.
4. Record the exact Cloudflare setting, date, and reason in this file.

## Current Execution Boundary

Codex can inspect production `robots.txt`, update repository governance, and read the connected Cloudflare account at a limited level.

Verified through the Cloudflare MCP on 2026-06-25:

- account read works
- `dandylanecafe.com` zone discovery works
- Pages project read works for `dl-new-website`
- production branch is `main`
- production domains are `dandylanecafe.com` and `www.dandylanecafe.com`

Current API limits in this session:

- zone settings read returned unauthorized
- Bot Management read returned authentication error
- Pay Per Crawl read returned authentication error
- zone Rulesets list works
- zone Rulesets entrypoint read returned unauthorized
- zone Rulesets invalid write probe returned authentication error
- account Rulesets invalid write probe returned authentication error

Therefore, Codex must not claim it can directly change Cloudflare AI crawler policy from this session.
Cloudflare AI Crawl Control changes remain an explicit owner decision and may require dashboard access or expanded token permissions.

## Repo-Level Fallback Control

Because the connected Cloudflare MCP cannot currently write AI Crawl Control, WAF, Rulesets, Bot Management, or Pay Per Crawl settings, the repository should carry a stable fallback policy.

Implemented fallback controls:

- `robots.txt` explicitly keeps search crawling open
- `robots.txt` declares `Content-Signal: search=yes,ai-train=no`
- `robots.txt` explicitly allows `OAI-SearchBot` and `ChatGPT-User`
- `robots.txt` explicitly disallows training/control crawlers currently treated as non-answerability crawlers: `Google-Extended`, `GPTBot`, and `ClaudeBot`
- `_headers` applies `X-Robots-Tag: noindex, nofollow` to `/admin`, `/admin.html`, and `/admin/*`
- `_headers` applies `X-Robots-Tag: noindex, follow` to `/facilities/laptop-friendly-seating` and `/facilities/laptop-friendly-seating.html`
- page HTML also carries the matching robots meta tags
- sitemap excludes noindex pages

This fallback does not replace Cloudflare AI Crawl Control metrics, but it gives the public website a governed crawler policy that deploys with the site.

## If Direct Cloudflare Control Is Required

The next direct-control route is:

1. Open Cloudflare dashboard.
2. Select `dandylanecafe.com`.
3. Go to `AI Crawl Control`.
4. Review `Overview`, `Crawlers`, and `Robots.txt`.
5. Keep search access open.
6. Keep AI training restricted unless the owner changes the policy.
7. Use crawler-level actions or WAF custom rules only after recording the exact crawler, reason, and expected effect.

For API control, the connected token must allow at least:

- Zone Settings read/edit
- Rulesets read/edit
- WAF custom rules read/edit
- Bot Management or AI Crawl Control read/edit if Cloudflare exposes those scopes to the connector

## One-Line Rule

For Flywheel 1, Cloudflare crawler policy should be an explicit owner decision, not an accidental default.
