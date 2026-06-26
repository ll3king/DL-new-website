# External Proof Artifacts

Checked date: 2026-06-26

## Purpose

This file stores reviewer-recheckable evidence artifacts for Flywheel 1 external proof.

It only records short excerpts or capture notes needed for AEO / GEO / AI Search Optimization validation.
It is not a marketing copy source.

## Artifact Table

| Source | URL | Capture method | Artifact status | Short excerpt / capture note | Confirmed anchors | Decision |
|---|---|---|---|---|---|---|
| Discover Tasmania | `https://www.discovertasmania.com.au/things-to-do/food-and-drink/dandy-lane-cafe/` | Live command-line fetch, HTTP 200 | pass | Excerpts include: "hidden-lane brunch cafe in Hobart CBD"; "Wine-Infused Benedicts, Potato Parmesan Rosti"; "Scotch steak sandwich"; "specialty coffee". | Hobart CBD, hidden lane, Collins Court, specialty coffee, Wine-Infused Benedict, Potato Parmesan Rosti, Scotch Steak Sandwich | count |
| Hobart & Beyond | `https://hobartandbeyond.com.au/place/dandy-lane-cafe/` | Live command-line fetch, HTTP 200 | pass | Excerpts include: "hidden-lane brunch cafe in Hobart CBD"; "Wine-Infused Benedicts, Potato Parmesan Rosti"; "Scotch steak sandwich"; "specialty coffee". | Hobart CBD, hidden lane, Collins Court, specialty coffee, Wine-Infused Benedict, Potato Parmesan Rosti, Scotch Steak Sandwich | count |
| Tripadvisor public listing + Business Page | `https://www.tripadvisor.com/Restaurant_Review-g255097-d11801652-Reviews-Dandy_Lane_Cafe-Hobart_Greater_Hobart_Tasmania.html` and `https://www.tripadvisor.com/specialoffers?locationId=11801652` | User-provided logged-in browser screenshot | pass | Screenshot saved at `docs/aeo/artifacts/tripadvisor-account-public-listing-overview-2026-06-26.png`. It shows TripAdvisor for Business pages for Dandy Lane Cafe, `locationId=11801652`, the public listing, 4.6 rating, 231 reviews, address at 138 Collins St / Collins Court, website / phone / email links, hours, About text, features, and traveller contribution cards. | Entity, address, review-platform proof, breakfast/brunch/cafe framing, Hobart CBD, hidden lane, specialty coffee, website, phone, hours | count |
| Tripadvisor automation attempt | `https://www.tripadvisor.com.au/Restaurant_Review-g255097-d11801652-Reviews-Dandy_Lane_Cafe-Hobart_Greater_Hobart_Tasmania.html` | Live command-line and controlled-browser fetch | blocked | Command-line fetch returned an anti-bot / JavaScript challenge. Controlled browser also showed access restriction / robot verification. | Confirms automation capture is blocked; manual screenshot evidence is required for future checks. | do not count |
| Google Business Profile / Google Maps | `https://www.google.com/maps/place/Dandy+Lane+Cafe/@-42.8832521,147.328078,17z/` | In-app browser public Google Maps capture | pass with scoped claim | Screenshots saved at `docs/aeo/artifacts/google-maps-gbp-public-2026-06-26.png` and `docs/aeo/artifacts/google-maps-gbp-public-full-2026-06-26.png`. Visible screenshot evidence supports Dandy Lane Cafe, 4.6 rating, 978 reviews, Brunch restaurant category, map placement near Collins Street, and business-owner control context. DOM capture note also returned address, website, menu link, phone, owner update, review summary, and review snippets, but those are not fully visible in the saved screenshot. | Entity, rating/review proof, category, map placement, business-owner control context | count |
| Reddit / community search results | Google searches for r/hobart brunch, eggs Benedict, and Dandy Lane mentions | In-app browser public Google result captures | watchlist only | Screenshots saved at `docs/aeo/artifacts/reddit-google-search-brunch-hobart-2026-06-26.png`, `docs/aeo/artifacts/reddit-google-search-dandy-lane-2026-06-26.png`, and `docs/aeo/artifacts/reddit-google-search-eggs-benedict-hobart-2026-06-26.png`. Direct Reddit access was blocked and saved at `docs/aeo/artifacts/reddit-direct-blocked-healthy-breakfast-2026-06-26.png`. | Community opportunity, breakfast/brunch intent, Dandy Lane mention candidates, eggs Benedict product intent | do not count yet |
| Listing correction routes | Hello Hobart, Tourism Tasmania / ATDW, Hobart & Beyond | In-app browser public page captures | action-ready | Screenshots saved at `docs/aeo/artifacts/hello-hobart-business-info-2026-06-26.png`, `docs/aeo/artifacts/hello-hobart-submit-business-form-2026-06-26.png`, `docs/aeo/artifacts/tourism-tasmania-atdw-update-path-2026-06-26.png`, and `docs/aeo/artifacts/hobart-and-beyond-contact-us-2026-06-26.png`. | Listing correction channels for hours, description, product-anchor wording, and workspace-drift cleanup | action route only |

## Reviewer Notes

- Discover Tasmania and Hobart & Beyond now satisfy the artifact requirement for formal external proof count.
- Tripadvisor now satisfies the artifact requirement through the user-provided logged-in browser screenshot.
- The TripAdvisor screenshot includes business-dashboard context and should be treated as internal evidence, not public marketing material.
- Google Business Profile / Google Maps now satisfies the initial entity, category, rating/review, map-placement, and owner-control proof requirement.
- Address, website, menu link, phone, owner update, and review snippets were captured in DOM text, but need a scrolled visible screenshot if the reviewer requires visual artifact proof for those fields.
- Reddit/community search artifacts establish a watchlist only; they do not count as independent community proof until thread context is verified.
- Listing correction route artifacts establish where updates can be requested; they do not prove corrections have been submitted or accepted.
- The quoted excerpts above are intentionally short; do not paste long third-party page text into the repo.

## Next Required Artifacts

1. Manually verify Reddit thread bodies and subreddit rules before any participation draft.
2. Send listing correction requests only after Controller approval of the exact channel and wording.
3. Expand recurring AI baseline beyond the primary brunch prompt.
4. Refresh Google Business Profile / Maps if rating, review count, category, address, website, menu link, phone, or hours change.
