# Booking & SEO Architecure Decisions

## 1. Architectural Assessment (架构评估)
- **L0 (Data Layer)**: Introduce `booking` and `seo` configuration in `site.yaml` to serve as the single source of truth. Add new stories to `stories.yaml`. Update `shared/types.ts` to strictly type these new structures. 
- **L2 (Blocks Layer)**: Create a new block `booking-form.html`. This block will handle the visual presentation of the form (Date, Time with 15-min intervals, Name, Email, Mobile, Group Size) and display the capacity warning ("Maximum 16 people per hour").
- **L3 (Logic Layer)**: `generate.js` must be updated to output a `robots.txt` and `sitemap.xml`. `base.html` layout needs advanced AEO handling (e.g., Breadcrumbs, PotentialAction).
- **Compliance**: The data flows unidirectionally from L0 to L3 to L4. No logic resides in the final HTML outputs. `generate.js` relies strictly on `site.yaml` for operating hours and site URLs to generate sitemaps and forms correctly.

## 2. Booking Configuration Details
The booking page will focus on matching the user's "Vibe", capturing:
- **Core Fields**: Name, Email, Mobile, Group Size.
- **Dynamic Fields**: Date, Time (dropdown generated from `site.yaml` opening hours, split into 15-minute intervals).
- **Business Rule Display**: "Capacity Control: Maximum 16 people per hour." Message displayed to user.

## 3. AEO (AI Engine Optimization)
- **sitemap.xml**: Auto-generated during the `L3` build process, iterating over core pages and all individual stories.
- **robots.txt**: Auto-generated via `generate.js`.
- **Schema.org**: Add `ReserveAction` schema to encourage AI summaries to provide direct booking intents. Add `BreadcrumbList` to stories.

## 4. Content Expansion ("Our Stories")
- **The Alchemist of Acids**: Details balancing Tasmanian climate effects on coffee beans.
- **Hand-Whisked Heritage**: Deep dive into the daily preparation of wine-infused hollandaise.
