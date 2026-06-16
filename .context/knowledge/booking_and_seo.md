# Historical Booking And Search Decisions

Status: historical reference only

This file describes an earlier `booking + seo` prototype-era framing.

It is no longer the active project governance model.

Current project governance is defined by:

- [README.md](../../README.md)
- [docs/project-current-overview-and-doc-governance.zh-CN.md](../../docs/project-current-overview-and-doc-governance.zh-CN.md)

Current rules:

- Dandy Lane is a Hobart CBD hidden-lane breakfast-to-brunch cafe.
- The website is governed by two flywheels:
  - `AEO / GEO / AI Search Optimization`
  - `Visual Taste / Frontend / Performance`
- `SEO` is only infrastructure language, not the default project narrative.
- `Booking System` remains an important subsystem, but it is not the default project center.

The notes below should only be read as historical implementation context.

## Earlier Architectural Assessment

- **L0 (Data Layer)**: Introduce `booking` and `seo` configuration in `site.yaml` to serve as the single source of truth. Add new stories to `stories.yaml`. Update `shared/types.ts` to strictly type these new structures.
- **L2 (Blocks Layer)**: Create a new block `booking-form.html`. This block will handle the visual presentation of the form (Date, Time with 15-min intervals, Name, Email, Mobile, Group Size) and display the capacity warning ("Maximum 16 people per hour").
- **L3 (Logic Layer)**: `generate.js` must be updated to output a `robots.txt` and `sitemap.xml`. `base.html` layout needs advanced AEO handling (e.g., Breadcrumbs, PotentialAction).
- **Compliance**: The data flows unidirectionally from L0 to L3 to L4. No logic resides in the final HTML outputs. `generate.js` relies strictly on `site.yaml` for operating hours and site URLs to generate sitemaps and forms correctly.

## Earlier Booking Configuration Details

The booking page originally focused on:

- **Core Fields**: Name, Email, Mobile, Group Size.
- **Dynamic Fields**: Date, Time (dropdown generated from `site.yaml` opening hours, split into 15-minute intervals).
- **Business Rule Display**: "Capacity Control: Maximum 16 people per hour."

## Earlier Search Notes

- **sitemap.xml**: Auto-generated during the `L3` build process, iterating over core pages and all individual stories.
- **robots.txt**: Auto-generated via `generate.js`.
- **Schema.org**: Add `ReserveAction` schema to encourage AI summaries to provide direct booking intents. Add `BreadcrumbList` to stories.

## Earlier Content Expansion Notes

- **The Alchemist of Acids**: Details balancing Tasmanian climate effects on coffee beans.
- **Hand-Whisked Heritage**: Deep dive into the daily preparation of wine-infused hollandaise.
