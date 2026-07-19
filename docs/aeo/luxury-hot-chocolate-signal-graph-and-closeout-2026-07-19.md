# Luxury Hot Chocolate Signal Graph And AEO Closeout

Date: 2026-07-19

Campaign: `luxury-hot-chocolate-winter-2026-07-19`

## Scope And Decision

This is a Website-side AEO / GEO closeout record for the published campaign.
It records the current official signal graph and the follow-up checks required
to evaluate it. It does not change public copy, schema, templates, social
profiles, menu truth, or external platforms.

Decision: do not add campaign-specific GBP, Facebook, or Instagram links back
onto the Website story. The Website already provides the guest-helpful Menu
and Location links. Adding reverse official-post links would create an
artificial reciprocal link ring without adding independent proof or a clear
guest task.

## Current Signal Graph

```text
Website canonical story
  -> Menu
  -> Location
  -> stable official identity sameAs (GBP CID, Facebook Page, Instagram)

GBP LocalPost
  -> Website canonical CTA

Facebook official post
  -> Website canonical in approved caption

Instagram official post
  -> stable Website navigation through profile; no feed-link clickability claim
```

| Surface | URL | Class | Verified state and link role |
|---|---|---|---|
| Website canonical | `https://dandylanecafe.com/stories-luxury-hot-chocolate-hobart-winter` | owned canonical | HTTP 200; self-canonical, Article schema, sitemap inclusion, and natural Menu/Location links verified. |
| Website media | `https://dandylanecafe.com/assets/media/luxury-hot-chocolate-approved-20260717.jpg` | owned campaign media | Published media resource for the canonical story. |
| Google Business Profile LocalPost | `https://local.google.com/place?id=953242008535282366&use=posts&lpsid=CIHM0ogKEPG3tvKWvpGm4wE` | affiliated official signal | Approved CTA targets the exact Website canonical. Public HTTP resolves to dynamic Google local-post search state, so static extraction is not treated as caption proof. |
| Facebook official post | `https://facebook.com/dandylanespresso/posts/pfbid02he1cQd25U7dspGMFxwg2AYbm2jU9sPFCo8xiUQU9zojPovvnFPZiX3kSSgmojguQl` | affiliated official signal | Approved caption contains the canonical URL. Public HTTP returned 200 but static extraction did not expose the caption link, a platform-rendering limitation. |
| Instagram official post | `https://www.instagram.com/p/Da-MXohE7jL/` | affiliated official signal | Approved caption points guests to Website navigation in the profile. This is a profile-navigation edge, not a claim that the feed URL is clickable. |

Stable Website identity edges, already governed separately, are:

- GBP: `https://www.google.com/maps?cid=953242008535282366`
- Facebook Page: `https://www.facebook.com/300819780292779`
- Instagram: `https://www.instagram.com/dandy.lane.cafe/`

## Evidence Classification

The Website canonical is the owned source of truth. GBP, Facebook, and
Instagram posts are affiliated official signals. Together they improve
freshness and entity consistency, but they do not independently prove product
quality, public recognition, or local recommendation. That evidence must come
from independent reviews, listings, and natural community discussion.

## Post-Campaign Checks

1. Within 3-7 days, recheck the canonical, media, GBP CTA, Facebook permalink,
   and Instagram permalink. Record resolution state and any platform-specific
   rendering limitation.
2. Within 14-21 days, rerun exact AI-answer prompts for `Luxury Hot Chocolate`
   and Hobart CBD winter-drink intent. Record platform, prompt, response, and
   sources or citations where available.
3. Where available, compare product movement and GBP/social measurements with
   the pre-campaign period. Do not turn missing or neutral data into a claim.
4. Route the next campaign action toward independent listing/review/community
   proof rather than another owned-post link loop.

## Production Boundary

No public Website content, schema, media, navigation, generated output, or
external platform state changed as part of this closeout record.
