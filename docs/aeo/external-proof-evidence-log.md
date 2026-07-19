# External Proof Evidence Log

Last updated: 2026-07-19

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
| Google Business Profile / Google Maps | `https://www.google.com/maps/search/?api=1&query=Dandy%20Lane%20Cafe%2C%20Unit%2010%2F138%20Collins%20Street%2C%20Hobart%20TAS%207000` | 2026-06-25 | needs manual live verification | unknown | do not count yet | Browser-login / dynamic result should be captured manually with screenshot or exported profile facts. |
| Tripadvisor | `https://www.tripadvisor.com.au/Restaurant_Review-g255097-d11801652-Reviews-Dandy_Lane_Cafe-Hobart_Greater_Hobart_Tasmania.html` | 2026-06-25 | blocked by anti-bot / JS challenge in command-line check | unknown | do not count yet | Do not rely on cached numeric review claims until manually verified with screenshot or visible excerpt. |
| Discover Tasmania | `https://www.discovertasmania.com.au/eat-and-drink/dandy-lane/` | 2026-06-25 | command-line verification failed | unknown | do not count yet | Needs browser/manual verification. |
| Hobart & Beyond | `https://www.hobartandbeyond.com.au/listing/dandy-lane/` | 2026-06-25 | command-line verification failed due TLS trust issue | unknown | do not count yet | Needs browser/manual verification. |
| Hello Hobart | candidate URLs checked | 2026-06-25 | guessed URLs returned 404 | unknown | do not count yet | Need search/manual confirmation of current listing URL before any claim. |
| Reddit / forums | TBD | 2026-06-25 | not started | unknown | do not count yet | Only transparent, relevant participation can count. |
| AI answer spot checks | TBD | 2026-06-25 | not started | unknown | do not count yet | Must record platform, prompt, date, answer, and cited sources. |

## Campaign-Owned Signal Records

These rows capture official campaign continuity. They are useful for
freshness, identity consistency, and post-campaign verification, but they are
not independent third-party proof and must not be counted as such.

| Campaign / surface | URL | Checked date | Source class | Link behavior | Reviewer decision | Notes |
|---|---|---:|---|---|---|---|
| Luxury Hot Chocolate / Website canonical | `https://dandylanecafe.com/stories-luxury-hot-chocolate-hobart-winter` | 2026-07-19 | owned canonical | Story links naturally to Menu and Location; Article, canonical, sitemap, and official sameAs identities are present on Website surfaces. | record; do not count as external proof | Live HTTP read returned 200. |
| Luxury Hot Chocolate / GBP LocalPost | `https://local.google.com/place?id=953242008535282366&use=posts&lpsid=CIHM0ogKEPG3tvKWvpGm4wE` | 2026-07-19 | affiliated official signal | Approved CTA points to the exact Website canonical. | record; do not count as independent proof | Public URL resolved to Google local-post search state; dynamic rendering limits static caption/CTA extraction. |
| Luxury Hot Chocolate / Facebook post | `https://facebook.com/dandylanespresso/posts/pfbid02he1cQd25U7dspGMFxwg2AYbm2jU9sPFCo8xiUQU9zojPovvnFPZiX3kSSgmojguQl` | 2026-07-19 | affiliated official signal | Approved caption contains the exact Website canonical. | record; do not count as independent proof | Public URL returned 200; the static HTTP response did not expose the caption link for independent extraction. |
| Luxury Hot Chocolate / Instagram post | `https://www.instagram.com/p/Da-MXohE7jL/` | 2026-07-19 | affiliated official signal | Caption directs guests to the Website through the profile; feed URLs are not claimed clickable. | record; do not count as independent proof | Public URL returned 200 and exposed the profile-navigation wording; the stable Website/profile identity remains the relevant navigation edge. |

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
