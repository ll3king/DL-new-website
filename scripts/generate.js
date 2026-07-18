const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const nunjucks = require('nunjucks');
const sharp = require('sharp');

// Law Check: L3 can read L0-L2
const DATA_PATH = path.join(__dirname, '../data/site.yaml');
const LAYOUTS_DIR = path.join(__dirname, '../src/layouts');
const BLOCKS_DIR = path.join(__dirname, '../src/blocks');
const PUBLIC_DIR = path.join(__dirname, '../public');
const SRC_ASSETS_DIR = path.join(__dirname, '../src/assets');

// Asset Pipeline: Copy and Optimize src/assets -> public/assets
async function syncAssets(src, dest) {
    if (!fs.existsSync(src)) return;
    if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });

    const items = fs.readdirSync(src);
    for (const item of items) {
        const srcPath = path.join(src, item);
        const destPath = path.join(dest, item);
        const stat = fs.statSync(srcPath);

        if (stat.isDirectory()) {
            await syncAssets(srcPath, destPath);
        } else {
            const ext = path.extname(item).toLowerCase();
            const isImage = ['.jpg', '.jpeg', '.png'].includes(ext);

            if (isImage && src.includes('media')) {
                // Optimization Pipeline for Media Images
                const webpPath = destPath.replace(ext, '.webp');

                try {
                    const image = sharp(srcPath);
                    const metadata = await image.metadata();

                    // 1. Generate Optimized Original (JPG/PNG)
                    let originalPipe = sharp(srcPath);
                    if (metadata.width > 1920) originalPipe = originalPipe.resize(1920);

                    if (ext === '.jpg' || ext === '.jpeg') {
                        await originalPipe.jpeg({ quality: 80, progressive: true }).toFile(destPath);
                    } else {
                        await originalPipe.png({ quality: 80, palette: true }).toFile(destPath);
                    }

                    // 2. Generate Next-Gen WebP
                    let webpPipe = sharp(srcPath);
                    if (metadata.width > 1920) webpPipe = webpPipe.resize(1920);
                    await webpPipe.webp({ quality: 75 }).toFile(webpPath);
                } catch (err) {
                    console.error(`[L3] Error processing ${item}:`, err.message);
                    fs.copyFileSync(srcPath, destPath);
                }
            } else {
                fs.copyFileSync(srcPath, destPath);
            }
        }
    }
}

// Configure Nunjucks to read from layouts and blocks
const env = nunjucks.configure([LAYOUTS_DIR, BLOCKS_DIR], { autoescape: true });
const WEEKDAY_ORDER = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

// Add custom filter for string operations not native to Nunjucks
env.addFilter('endswith', function (str, suffix) {
    if (typeof str !== 'string') return false;
    return str.endsWith(suffix);
});

env.addFilter('money', function (value) {
    const number = Number(value);
    if (!Number.isFinite(number)) return value;
    return Number.isInteger(number) ? number.toFixed(0) : number.toFixed(2);
});

env.addFilter('hide_price_details', function (value) {
    if (typeof value !== 'string') return value;

    return value
        .replace(/\s*\(\s*\+\s*\$[\d.]+\s*\)/g, '')
        .replace(/\s*;\s*[^.;]*\+\s*\$[\d.]+/g, '')
        .replace(/\s*\+\s*\$[\d.]+/g, '')
        .replace(/\s*\$[\d.]+(?:\s*\/\s*\$[\d.]+)*/g, '')
        .replace(/\s{2,}/g, ' ')
        .trim();
});

function expandDayRange(dayRange) {
    if (typeof dayRange !== 'string') return [];

    const normalizedRange = dayRange.trim();
    if (!normalizedRange.includes('-')) {
        return normalizedRange ? [normalizedRange] : [];
    }

    const [startDayRaw, endDayRaw] = normalizedRange.split('-').map(part => part.trim());
    const startIndex = WEEKDAY_ORDER.indexOf(startDayRaw);
    const endIndex = WEEKDAY_ORDER.indexOf(endDayRaw);

    if (startIndex === -1 || endIndex === -1) {
        return [];
    }

    if (startIndex <= endIndex) {
        return WEEKDAY_ORDER.slice(startIndex, endIndex + 1);
    }

    return [
        ...WEEKDAY_ORDER.slice(startIndex),
        ...WEEKDAY_ORDER.slice(0, endIndex + 1)
    ];
}

function normalizePrettyPath(pathValue, fallbackSlug) {
    if (typeof pathValue === 'string' && pathValue.trim()) {
        const normalized = pathValue.trim().replace(/\\/g, '/');
        return normalized.startsWith('/') ? normalized : `/${normalized}`;
    }

    return fallbackSlug.startsWith('/') ? fallbackSlug : `/${fallbackSlug}`;
}

function storyRoute(story) {
    const prettyPath = normalizePrettyPath(story.url_path, `stories-${story.slug}`);
    const htmlPath = `${prettyPath}.html`;

    return {
        prettyPath,
        htmlPath
    };
}

function absoluteSiteUrl(siteData, urlPath) {
    const siteUrl = siteData.seo.site_url.replace(/\/+$/, '');
    if (!urlPath || urlPath === '/') return `${siteUrl}/`;
    if (/^https?:\/\//i.test(urlPath)) return new URL(urlPath).href;
    return new URL(String(urlPath).replace(/^\/+/, ''), `${siteUrl}/`).href;
}

function mediaPathForMetadata(mediaPath) {
    if (!mediaPath) return 'assets/media/home_hero-poster.jpg';
    if (/\.(mp4|mov|webm)$/i.test(mediaPath)) {
        return mediaPath.replace(/\.[^.]+$/, '-poster.jpg');
    }
    return mediaPath;
}

function resolvedMetadataMediaPath(mediaPath) {
    const candidatePath = mediaPathForMetadata(mediaPath);
    const outputPath = path.join(PUBLIC_DIR, candidatePath.replace(/^\/+/, ''));

    return fs.existsSync(outputPath)
        ? candidatePath
        : 'assets/media/home_hero-poster.jpg';
}

function buildPageMetadata(siteData, {
    title,
    description,
    pagePath,
    ogType = 'website',
    image,
    imageAlt
}) {
    const metadataImage = image ? absoluteSiteUrl(siteData, image) : null;

    return {
        og_type: ogType,
        title: title || siteData.identity.name,
        description: description || siteData.identity.description,
        url: absoluteSiteUrl(siteData, pagePath),
        image: metadataImage,
        image_alt: metadataImage ? (imageAlt || title || siteData.identity.name) : null
    };
}

function formatDisplayDate(dateValue) {
    if (typeof dateValue !== 'string') return dateValue;
    const date = new Date(`${dateValue}T00:00:00`);
    if (Number.isNaN(date.getTime())) return dateValue;

    return new Intl.DateTimeFormat('en-AU', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        timeZone: 'Australia/Hobart'
    }).format(date);
}

function prepareStoriesData(rawStoriesData) {
    const stories = Array.isArray(rawStoriesData.stories) ? rawStoriesData.stories : [];

    return {
        ...rawStoriesData,
        stories: stories
            .map(story => ({
                ...story,
                display_date: formatDisplayDate(story.date)
            }))
            .sort((a, b) => new Date(`${b.date}T00:00:00`) - new Date(`${a.date}T00:00:00`))
    };
}

function prepareMenuHighlightsData(rawMenuData) {
    const categories = Array.isArray(rawMenuData.categories) ? rawMenuData.categories : [];
    const highlightOrder = [
        'Smashed Avo',
        'Egg Benedict',
        'Dandy Rosti',
        'Wild Mushroom Benedict',
        'Scotch Steak Sandwich',
        'Stack Me Up'
    ];
    const menuItems = new Map(
        categories.flatMap(category => Array.isArray(category.items) ? category.items : [])
            .map(item => [item.name, item])
    );
    const items = highlightOrder.map(name => menuItems.get(name)).filter(Boolean);

    return {
        ...rawMenuData,
        items,
        categories: [{ name: 'Menu Highlights', items }]
    };
}

function shouldIncludeInSitemap(entry) {
    const robots = typeof entry?.robots === 'string' ? entry.robots.toLowerCase() : '';
    return entry && entry.include_in_sitemap !== false && !robots.includes('noindex');
}

async function render() {
    console.log("[L3] Starting Site Generation (Nunjucks Engine)...");

    try {
        // 0. Asset Pipeline: Sync media files -> public/
        if (!fs.existsSync(PUBLIC_DIR)) fs.mkdirSync(PUBLIC_DIR, { recursive: true });
        console.log("[L3] Processing and Optimizing assets...");
        await syncAssets(SRC_ASSETS_DIR, path.join(PUBLIC_DIR, 'assets'));

        // 1. Load All Data (L0)
        const siteData = yaml.load(fs.readFileSync(DATA_PATH, 'utf8'));
        const menuData = yaml.load(fs.readFileSync(path.join(__dirname, '../data/menu.yaml'), 'utf8'));
        const menuHighlightsData = prepareMenuHighlightsData(menuData);
        const faqData = yaml.load(fs.readFileSync(path.join(__dirname, '../data/faq.yaml'), 'utf8'));
        const storiesData = prepareStoriesData(yaml.load(fs.readFileSync(path.join(__dirname, '../data/stories.yaml'), 'utf8')));

        const context = {
            site: siteData,
            menu: menuData,
            menu_highlights: menuHighlightsData,
            faq: faqData,
            stories: storiesData
        };

        // 2. Define Page Compositions (L4 definition in L3 generator)
        const pages = [
            {
                id: 'index',
                slug: 'index.html',
                blocks: ['identity-hero.html', 'signature-trio.html', 'location-nap.html', 'social-proof-reviews.html', 'faq-list.html']
            },
            {
                id: 'menu',
                slug: 'menu.html',
                blocks: ['identity-hero.html', 'menu-grid.html', 'menu-archive.html', 'location-nap.html']
            },
            {
                id: 'faq',
                slug: 'faq.html',
                blocks: ['identity-hero.html', 'faq-list.html']
            },
            {
                id: 'location',
                slug: 'location.html',
                blocks: ['identity-hero.html', 'location-nap.html']
            },
            {
                id: 'stories',
                slug: 'stories.html',
                blocks: ['identity-hero.html', 'story-list.html']
            },
            {
                id: 'booking',
                slug: 'booking.html',
                blocks: ['identity-hero.html', 'booking-form.html']
            },
            {
                id: 'admin',
                slug: 'admin.html',
                blocks: ['identity-hero.html', 'admin-bookings.html']
            }
        ];


        // 3. Schema Generation Helpers (AEO Logic)
        function generateRestaurantData(siteData) {
            return {
                "@type": "Restaurant",
                "name": siteData.identity.name,
                "image": siteData.seo.site_url + "/assets/media/home_hero.jpg",
                "@id": siteData.seo.site_url + "/#restaurant",
                "url": siteData.seo.site_url,
                "telephone": siteData.contact.nap.phone,
                "menu": siteData.seo.site_url + "/menu",
                "servesCuisine": siteData.seo.schema.cuisine,
                "acceptsReservations": siteData.seo.schema.accepts_reservations,
                "address": {
                    "@type": "PostalAddress",
                    "streetAddress": siteData.contact.nap.address.split(',')[0],
                    "addressLocality": "Hobart",
                    "addressRegion": "TAS",
                    "postalCode": "7000",
                    "addressCountry": "AU"
                },
                "geo": {
                    "@type": "GeoCoordinates",
                    "latitude": siteData.contact.nap.geo.latitude,
                    "longitude": siteData.contact.nap.geo.longitude
                },
                "openingHoursSpecification": siteData.operations.opening_hours.map(h => ({
                    "@type": "OpeningHoursSpecification",
                    "dayOfWeek": expandDayRange(h.days),
                    "opens": h.open,
                    "closes": h.close
                })),
                "sameAs": siteData.same_as
            };
        }

        // AEO: Unified Fact-aligned Schema Generator (Minimal Redundancy)
        function generateBaseBusinessSchema(siteData) {
            const decisionAnchors = (siteData.aeo && siteData.aeo.decision_anchors) || [];
            const restaurant = {
                "@type": ["Restaurant", "LocalBusiness"],
                "@id": siteData.seo.site_url + "/#restaurant",
                "name": siteData.identity.name,
                "image": siteData.seo.site_url + "/assets/media/home_hero.jpg",
                "url": siteData.seo.site_url + "/",
                "logo": {
                    "@type": "ImageObject",
                    "url": siteData.seo.site_url + "/assets/media/logo.png",
                    "width": "200",
                    "height": "200"
                },
                "telephone": "+61498061067",
                "servesCuisine": siteData.seo.schema.cuisine_labels || [siteData.seo.schema.cuisine],
                "acceptsReservations": siteData.seo.schema.accepts_reservations,
                "menu": siteData.seo.schema.has_menu_url,
                "potentialAction": {
                    "@type": "ReserveAction",
                    "target": {
                        "@type": "EntryPoint",
                        "urlTemplate": siteData.seo.schema.has_booking_url
                    }
                },
                "address": {
                    "@type": "PostalAddress",
                    "streetAddress": "Unit 10 / 138 Collins Street",
                    "addressLocality": "Hobart",
                    "addressRegion": "TAS",
                    "postalCode": "7000",
                    "addressCountry": "AU"
                },
                "geo": {
                    "@type": "GeoCoordinates",
                    "latitude": siteData.contact.nap.geo.latitude,
                    "longitude": siteData.contact.nap.geo.longitude
                },
                "openingHoursSpecification": [
                    {
                        "@type": "OpeningHoursSpecification",
                        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
                        "opens": "07:00",
                        "closes": "15:00"
                    },
                    {
                        "@type": "OpeningHoursSpecification",
                        "dayOfWeek": ["Saturday", "Sunday"],
                        "opens": "09:00",
                        "closes": "14:00"
                    }
                ],
                "sameAs": siteData.same_as
            };

            if (decisionAnchors.length > 0) {
                restaurant.knowsAbout = decisionAnchors.map(anchor => anchor.display_name);
                restaurant.description = siteData.aeo.brand_entity.canonical_identity;
            }

            return [restaurant];
        }

        function generateWebsiteSchema(siteData) {
            return {
                "@type": "WebSite",
                "@id": siteData.seo.site_url + "/#website",
                "name": siteData.identity.name,
                "alternateName": siteData.identity.alternate_names || [],
                "url": siteData.seo.site_url + "/"
            };
        }

        function generateFaqSchema(faqData, siteUrl) {
            return {
                "@type": "FAQPage",
                "@id": siteUrl + "/faq#faq",
                "mainEntity": faqData.questions.map(q => ({
                    "@type": "Question",
                    "name": q.question,
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": q.answer
                    }
                }))
            };
        }

        function generateMenuSchema(menuData, siteData) {
            return {
                "@type": "Menu",
                "@id": siteData.seo.site_url + "/menu#menu",
                "name": siteData.identity.name + " Menu Highlights",
                "mainEntityOfPage": siteData.seo.site_url + "/menu",
                "hasMenuItem": menuData.categories.flatMap(cat => 
                    cat.items.map(item => {
                        const menuItem = {
                            "@type": "MenuItem",
                            "name": item.display_name || item.name,
                            "alternateName": item.display_name ? item.name : undefined,
                            "description": env.getFilter('hide_price_details')(item.description || "")
                        };
                        if (Array.isArray(item.aliases) && item.aliases.length > 0) {
                            const alternateNames = [
                                ...(Array.isArray(menuItem.alternateName) ? menuItem.alternateName : [menuItem.alternateName].filter(Boolean)),
                                ...item.aliases
                            ];
                            menuItem.alternateName = [...new Set(alternateNames)];
                        }
                        return menuItem;
                    })
                )
            };
        }

        function generateBreadcrumbSchema(siteUrl, pageId, pageTitle, pagePath) {
            const listItems = [
                {
                    "@type": "ListItem",
                    "position": 1,
                    "name": "Home",
                    "item": siteUrl
                }
            ];

            if (pageId !== 'index') {
                listItems.push({
                    "@type": "ListItem",
                    "position": 2,
                    "name": pageTitle,
                    "item": `${siteUrl}${pagePath || `/${pageId}`}`
                });
            }

            return {
                "@type": "BreadcrumbList",
                "@id": `${siteUrl}/${pageId === 'index' ? '' : pageId}#breadcrumb`,
                "itemListElement": listItems
            };
        }

        const generatedPages = [];

        // 4. Render Static Pages
        pages.forEach(page => {
            console.log(`[L3] Rendering: ${page.slug}`);
            const pageConfig = siteData.pages[page.id] || {};
            generatedPages.push(page.slug);

            // Targeted Schema Logic
            let schemas = [];
            
            // 1. Breadcrumbs (Global)
            const pagePath = page.id === 'index' ? '/' : `/${page.id}`;
            const pageMetadata = buildPageMetadata(siteData, {
                title: pageConfig.title,
                description: pageConfig.emphasis,
                pagePath,
                image: mediaPathForMetadata(pageConfig.media),
                imageAlt: pageConfig.title
            });
            schemas.push(generateBreadcrumbSchema(siteData.seo.site_url, page.id, pageConfig.title, pagePath));

            // 2. Primary Page Entities
            if (page.id === 'index') {
                schemas.push(generateWebsiteSchema(siteData));
                schemas.push(...generateBaseBusinessSchema(siteData));
            } else if (page.id === 'faq') {
                schemas.push(generateFaqSchema(faqData, siteData.seo.site_url));
            } else if (page.id === 'menu') {
                schemas.push(generateMenuSchema(menuHighlightsData, siteData));
            }

            const pageSchema = `<!-- AEO: Targeted Page Schema -->\n<script type="application/ld+json">\n${JSON.stringify({
                "@context": "https://schema.org",
                "@graph": schemas
            }, null, 2)}\n</script>`;

            let pageBody = "";
            page.blocks.forEach(blockFile => {
                pageBody += nunjucks.render(blockFile, {
                    ...context,
                    page_context: pageConfig,
                    current_page_id: page.id
                });
            });

            const finalHtml = nunjucks.render('base.html', {
                ...context,
                content: pageBody,
                page_title: pageConfig.title,
                page_description: pageConfig.emphasis,
                current_page_id: page.id,
                page_path: pagePath,
                page_robots: pageConfig.robots,
                page_metadata: pageMetadata,
                global_schema: pageSchema,
                current_year: new Date().getFullYear()
            });

            if (!fs.existsSync(PUBLIC_DIR)) fs.mkdirSync(PUBLIC_DIR);
            fs.writeFileSync(path.join(PUBLIC_DIR, page.slug), finalHtml);
        });

        // 5. Render Dynamic Story Detail Pages
        storiesData.stories.forEach(story => {
            const route = storyRoute(story);
            generatedPages.push(route.prettyPath);
            console.log(`[L3] Rendering Story: ${route.htmlPath}`);

            const pageBody = nunjucks.render('story-detail.html', {
                ...context,
                active_story: story
            });

            // Targeted Schema for Stories
            const storyPath = route.prettyPath;
            const storyMetadataImagePath = resolvedMetadataMediaPath(story.cover);
            const storyImage = absoluteSiteUrl(siteData, storyMetadataImagePath);
            const storyImageAlt = story.cover_alt || story.title;
            const storyMetadata = buildPageMetadata(siteData, {
                title: story.title,
                description: story.summary,
                pagePath: storyPath,
                ogType: 'article',
                image: storyMetadataImagePath,
                imageAlt: storyImageAlt
            });
            const breadcrumbs = generateBreadcrumbSchema(siteData.seo.site_url, 'stories', story.title, storyPath);
            const article = {
                "@type": "Article",
                "headline": story.title,
                "description": story.summary,
                "datePublished": story.date,
                "author": {
                    "@type": "Organization",
                    "name": siteData.identity.name
                },
                "publisher": {
                    "@type": "Organization",
                    "name": siteData.identity.name,
                    "logo": {
                        "@type": "ImageObject",
                        "url": siteData.seo.site_url + "/assets/media/logo.png"
                    }
                },
                "mainEntityOfPage": {
                    "@type": "WebPage",
                    "@id": `${siteData.seo.site_url}${storyPath}`
                }
            };

            if (storyImage) {
                article.image = {
                    "@type": "ImageObject",
                    "url": storyImage,
                    "caption": storyImageAlt
                };
            }
            if (story.updated_at) {
                article.dateModified = story.updated_at;
            }

            if (story.answer_summary) {
                article.abstract = story.answer_summary;
            }
            if (story.related_menu_item) {
                article.about = {
                    "@type": "Thing",
                    "name": story.related_menu_item
                };
            }
            if (story.evidence_points && story.evidence_points.length) {
                article.keywords = story.evidence_points.join(', ');
            }

            const pageSchema = `<!-- AEO: Story Schema -->\n<script type="application/ld+json">\n${JSON.stringify({
                "@context": "https://schema.org",
                "@graph": [breadcrumbs, article]
            }, null, 2)}\n</script>`;

            const finalHtml = nunjucks.render('base.html', {
                ...context,
                content: pageBody,
                page_title: story.title,
                page_description: story.summary,
                current_page_id: 'stories',
                slug: route.htmlPath,
                page_path: storyPath,
                page_robots: story.robots,
                page_metadata: storyMetadata,
                global_schema: pageSchema,
                current_year: new Date().getFullYear()
            });

            const outputPath = path.join(PUBLIC_DIR, route.htmlPath.replace(/^\//, ''));
            fs.mkdirSync(path.dirname(outputPath), { recursive: true });
            fs.writeFileSync(outputPath, finalHtml);
        });

        // 5. Generate AEO Artifacts & Infrastructure (L3 logic to L4 output)
        console.log("[L3] Generating AEO Artifacts: sitemap.xml, robots.txt, _redirects");
        
        // Sitemap - Standardize URLs (Pretty URLs)
        const sitemapEntries = pages.filter(p => shouldIncludeInSitemap(siteData.pages[p.id] || {})).map(p => {
            const path = p.id === 'index' ? '/' : `/${p.id}`;
            return `  <url><loc>${siteData.seo.site_url}${path}</loc></url>`;
        });

        // Add stories to sitemap
        storiesData.stories.forEach(story => {
            if (!shouldIncludeInSitemap(story)) return;
            const route = storyRoute(story);
            sitemapEntries.push(`  <url><loc>${siteData.seo.site_url}${route.prettyPath}</loc></url>`);
        });

        const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapEntries.join('\n')}
</urlset>`;
        fs.writeFileSync(path.join(PUBLIC_DIR, 'sitemap.xml'), sitemap);

        // Robots.txt: keep search/answerability open while preserving AI training control.
        const robots = `User-agent: *
Content-Signal: search=yes,ai-train=no
Allow: /

User-agent: OAI-SearchBot
Allow: /

User-agent: ChatGPT-User
Allow: /

User-agent: Google-Extended
Disallow: /

User-agent: GPTBot
Disallow: /

User-agent: ClaudeBot
Disallow: /

Sitemap: ${siteData.seo.site_url}/sitemap.xml`;
        fs.writeFileSync(path.join(PUBLIC_DIR, 'robots.txt'), robots);

        // Cloudflare Redirects (AEO 301 Consolidation)
        const redirects = `
# Domain Consolidation
https://dl-new-website.pages.dev/*  https://dandylanecafe.com/:splat  301!

# Precise Fact Pathing
/blog            /stories         301
/contact-us      /location        301
/menu.html       /menu            301
/bookings.html   /booking         301
/faq.html        /faq             301
/location.html   /location        301
/stories.html    /stories         301
`;
        const storyRedirects = storiesData.stories.flatMap(story => {
            if (!Array.isArray(story.legacy_paths) || story.legacy_paths.length === 0) {
                return [];
            }

            const route = storyRoute(story);
            return story.legacy_paths.map(legacyPath => `${legacyPath}  ${route.prettyPath}  301`);
        });
        const finalRedirects = `${redirects.trim()}\n${storyRedirects.join('\n')}\n`;
        fs.writeFileSync(path.join(PUBLIC_DIR, '_redirects'), finalRedirects);

        // 6. Generate Cloudflare Headers
        const headers = `/robots.txt
  Cache-Control: public, max-age=300, must-revalidate

/sitemap.xml
  Cache-Control: public, max-age=300, must-revalidate

/admin
  X-Robots-Tag: noindex, nofollow
  Cache-Control: no-store

/admin.html
  X-Robots-Tag: noindex, nofollow
  Cache-Control: no-store

/admin/*
  X-Robots-Tag: noindex, nofollow
  Cache-Control: no-store

/facilities/laptop-friendly-seating
  X-Robots-Tag: noindex, follow
  Cache-Control: public, max-age=300, must-revalidate

/facilities/laptop-friendly-seating.html
  X-Robots-Tag: noindex, follow
  Cache-Control: public, max-age=300, must-revalidate

/assets/*
  Cache-Control: public, max-age=31536000, immutable
`;
        fs.writeFileSync(path.join(PUBLIC_DIR, '_headers'), headers);

        console.log("[L3] Build Successful. Files written to /public.");

    } catch (e) {
        console.error("[L3] Build Failed:", e.stack);
    }
}

render();
