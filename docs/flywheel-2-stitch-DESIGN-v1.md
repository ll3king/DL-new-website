# Design System: Dandy Lane Cafe Flywheel 2 v1

## 1. Visual Theme & Atmosphere

A warm, appetising, hidden-lane brunch interface for a real Hobart CBD cafe.

The design should feel tactile and specific: timber bench, cream brick, stone base, black-framed entrance, softened Collins Court graffiti, thick brunch plates, and specialty coffee ritual.

The mood is editorial but human: confident food close-ups, modest local place proof, and mobile-first practical decisions.

Density: balanced, not sparse.
Variance: asymmetric and product-led.
Motion: light, restrained, food-focused.

Never make the site feel like a SaaS landing page, luxury event brand, generic cafe template, or beige minimalist placeholder.

## 2. Color Palette & Roles

- **Cream Wall** `#F4EBDD` - primary warm canvas, inspired by the cafe exterior wall.
- **Stone Base** `#C8B899` - secondary surface and section contrast, inspired by sandstone / stone wall details.
- **Timber Bench** `#8A5733` - tactile grounding color for dividers, hover depth, and food-stage accents.
- **Charcoal Sign** `#181614` - primary text and strong UI contrast, never pure black.
- **Muted Coffee** `#6F4A32` - secondary text, small labels, warm supporting details.
- **Hollandaise Gold** `#E6B84E` - single appetite accent for primary CTA, active states, and small product memory highlights.
- **Mural Blue** `#8FB6C8` - restrained secondary support only, for small proof details or soft background accents.
- **Paving Grey** `#D6D2CA` - quiet structural borders and mobile separators.

Accent rule:

Use **Hollandaise Gold** as the only strong accent.
Mural Blue is a support color, not a CTA color.

Avoid:

- purple or neon blue
- pure black
- oversaturated gradients
- sterile white-on-black luxury styling

## 3. Typography Rules

- **Display:** `Fraunces` or `Instrument Serif` - warm editorial appetite, controlled scale, tight but readable.
- **Body:** `Satoshi` or `Outfit` - human, clean, not sterile.
- **UI Labels:** same sans family as body, uppercase only when small and restrained.
- **Fallback:** if these fonts are unavailable, use a similar expressive serif for display and a geometric humanist sans for body.

Rules:

- Display text should feel like a cafe story, not a software headline.
- Body copy max width should stay readable and relaxed.
- Mobile headline must use responsive scaling.
- Do not use `Inter` as the identity font.
- Do not use generic serif defaults like Georgia, Times New Roman, or Garamond.

## 4. Component Stylings

### Buttons

Primary button:

- Hollandaise Gold fill
- Charcoal Sign text
- rounded but not pill-shaped
- tactile press state
- no glow

Secondary actions:

- text or outline style
- low visual noise
- no duplicate CTA hierarchy

### Product Cards

Avoid generic three equal cards.

Use:

- one large product feature
- two smaller supporting product moments
- asymmetric rhythm
- image-first cards with short copy

Cards should feel like menu memory anchors, not blog tiles.

### Proof / Place Blocks

Use Dandy Lane place signals:

- timber bench
- cream wall
- black doorway
- stone base
- blurred graffiti
- Collins Court / Hobart CBD text

Use these as support layers, not clutter.

### Navigation

Keep navigation practical:

- Home
- Menu
- Stories
- FAQ
- Location
- Book

On mobile, primary actions should be obvious:

- Book
- Menu
- Directions

## 5. Layout Principles

Hero:

- product-led
- asymmetric
- image and copy have separate clean zones
- no centered generic hero
- no full-screen filler

Homepage rhythm:

1. appetite / product hero
2. signature product memory
3. hidden-lane place proof
4. brunch decision support
5. practical CTA band

Spacing:

- generous but not empty
- make food images feel close and tactile
- keep text sections compact

Mobile:

- single-column priority
- image first or CTA first depending on section purpose
- no horizontal scroll
- tap targets at least 44px
- CTA should appear early

## 6. Image And Media Direction

Use real Dandy Lane visual knowledge as the source:

- mushroom benny on outdoor timber bench
- coffee on exterior bench near entrance
- blurred graffiti as place signal
- black-framed entrance and cream wall as proof
- stone base and barrel planter as support anchors

Image rules:

- close product focus beats wide panorama
- one or two place signals per image is better than all signals at once
- do not invent readable signage
- do not redraw the Dandy Lane logo
- do not add fake people
- do not use generic stock cafe imagery

## 7. Motion & Interaction

Motion should be light, appetising, and performance-safe:

- slow image reveal
- product card stagger
- CTA tactile press
- soft opacity / transform only
- respect reduced-motion preferences
- use restrained media motion as visual craft, not decoration

Avoid:

- heavy animation libraries
- scroll-jacking
- parallax that harms mobile performance
- decorative motion that does not improve appetite, memory, or decision clarity
- full-screen autoplay video hero by default
- motion that hides the booking / menu / directions path

### Controlled Motion References

Use these Dandy Lane motion types as design references:

- coffee pour / latte art micro-loop
- coffee steam close-up
- sign / entrance reveal
- laneway cup moment
- benny hollandaise / egg texture
- busy service warmth below the fold

Motion should create a feeling of:

- fresh coffee being made
- brunch plates arriving
- hidden-lane discovery
- warm service rhythm

Motion should never create:

- generic stock cafe reels
- fake staff or guest scenes
- fake signage
- nightlife or bar atmosphere

### Recommended Motion Patterns

Hero:

- static product image remains dominant
- a small muted motion chip can sit beside or below the CTA
- image reveal uses opacity and slight transform only

Product memory strip:

- each product tile can have one subtle motion state
- Benedict can use sauce / egg texture reference
- Coffee can use pour / steam reference
- Steak Sandwich can use the governed steak sandwich motion reference as a restrained product-tile cue, while preserving the tall toasted sandwich shape

Hidden-lane proof:

- use a restrained sign or laneway reveal
- do not animate a full invented laneway panorama

Mobile:

- no motion before the primary CTA is visible
- motion should pause or simplify under reduced-motion
- avoid video-first layouts that delay action

## 8. Performance Guardrails

Design must remain implementable as a fast static website:

- optimized hero image
- no autoplay video hero by default
- lazy-load below-fold media
- avoid layout shifts
- avoid JS-heavy visual effects
- preserve mobile usability

Do not propose visual ideas that require large runtime libraries just to look good.

## 9. Anti-Patterns

Never do:

- generic cafe template
- coffee bean icon clutter
- sticker overload
- fake rustic texture
- beige minimalism with no appetite
- SaaS landing page structure
- purple / neon gradient buttons
- luxury wedding / event styling
- fake Dandy Lane logo or fake sign text
- fake menu prices
- fake review numbers
- fake people
- full-laneway scene that invents spatial details
- three equal feature cards as the main product section
- "Elevate", "seamless", "crafted experience", or similar AI copywriting cliches
- static-only homepage that ignores Dandy Lane's real video assets
- motion-heavy homepage that feels like a template showreel

## 10. First Screen Direction

Use this as the first homepage concept direction:

Headline:

`Hidden-lane breakfast and brunch in Hobart CBD.`

Support:

`Wine-Infused Benedict, Potato Parmesan Rosti, specialty coffee, and warm brunch plates tucked inside Collins Court.`

Primary CTA:

`Book a table`

Secondary CTA:

`View menu`

Visual:

Close food or coffee image on a Dandy Lane bench, with one real place signal behind it.

Motion:

Use one restrained motion accent:

- coffee pour / steam chip
- subtle food image reveal
- sign reveal in the place-proof section

Do not make the whole hero a video background.

The first screen should make a mobile visitor immediately understand:

- what Dandy Lane is
- why the food is memorable
- where it is
- what to do next
