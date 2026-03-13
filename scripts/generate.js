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

// Add custom filter for string operations not native to Nunjucks
env.addFilter('endswith', function (str, suffix) {
    if (typeof str !== 'string') return false;
    return str.endsWith(suffix);
});

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
        const faqData = yaml.load(fs.readFileSync(path.join(__dirname, '../data/faq.yaml'), 'utf8'));
        const storiesData = yaml.load(fs.readFileSync(path.join(__dirname, '../data/stories.yaml'), 'utf8'));

        const context = {
            site: siteData,
            menu: menuData,
            faq: faqData,
            stories: storiesData
        };

        // 2. Define Page Compositions (L4 definition in L3 generator)
        const pages = [
            {
                id: 'index',
                slug: 'index.html',
                blocks: ['identity-hero.html', 'social-proof-reviews.html', 'signature-trio.html', 'intent-match.html', 'faq-list.html', 'location-nap.html']
            },
            {
                id: 'menu',
                slug: 'menu.html',
                blocks: ['identity-hero.html', 'menu-grid.html', 'location-nap.html']
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
                "priceRange": siteData.identity.price_range,
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
                    "dayOfWeek": h.days.includes('-') 
                         ? ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"] 
                         : [h.days],
                    "opens": h.open,
                    "closes": h.close
                })),
                "sameAs": siteData.same_as
            };
        }

        function generateOmniSchema(siteData, faqData, menuData) {
            const restaurant = generateRestaurantData(siteData);
            
            // Link FAQ and Menu to the Restaurant entity
            const faq = {
                "@type": "FAQPage",
                "@id": siteData.seo.site_url + "/#faq",
                "mainEntity": faqData.questions.slice(0, 5).map(q => ({
                    "@type": "Question",
                    "name": q.question,
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": q.answer
                    }
                }))
            };

            const menu = {
                "@type": "Menu",
                "@id": siteData.seo.site_url + "/#menu",
                "name": siteData.identity.name + " Signature Menu",
                "mainEntityOfPage": siteData.seo.site_url + "/menu",
                "hasMenuItem": menuData.categories[0].items.slice(0, 3).map(item => ({
                    "@type": "MenuItem",
                    "name": item.name,
                    "description": item.description || "",
                    "offers": {
                        "@type": "Offer",
                        "price": item.price,
                        "priceCurrency": "AUD"
                    }
                }))
            };

            return JSON.stringify({
                "@context": "https://schema.org",
                "@graph": [restaurant, faq, menu]
            }, null, 2);
        }

        function generateFaqSchema(faqs) {
            return JSON.stringify({
                "@context": "https://schema.org",
                "@type": "FAQPage",
                "mainEntity": faqs.questions.map(q => ({
                    "@type": "Question",
                    "name": q.question,
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": q.answer
                    }
                }))
            }, null, 2);
        }

        function generateMenuSchema(menuData, siteData) {
            const menuItems = [];
            menuData.categories.forEach(cat => {
                cat.items.forEach(item => {
                    menuItems.push({
                        "@type": "MenuItem",
                        "name": item.name,
                        "description": item.description || "",
                        "offers": {
                            "@type": "Offer",
                            "price": item.price,
                            "priceCurrency": "AUD"
                        }
                    });
                });
            });

            return JSON.stringify({
                "@context": "https://schema.org",
                "@type": "Menu",
                "name": "Dandy Lane Menu",
                "mainEntityOfPage": siteData.seo.site_url + "/menu",
                "hasMenuItem": menuItems
            }, null, 2);
        }

        const omniSchema = `<script type="application/ld+json">\n${generateOmniSchema(siteData, faqData, menuData)}\n</script>`;
        const restaurantSchema = `<script type="application/ld+json">\n${JSON.stringify({ "@context": "https://schema.org", ...generateRestaurantData(siteData) }, null, 2)}\n</script>`;

        const generatedPages = [];

        // 4. Render Static Pages
        pages.forEach(page => {
            console.log(`[L3] Rendering: ${page.slug}`);
            const pageConfig = siteData.pages[page.id] || {};
            generatedPages.push(page.slug);

            // Generate Page-Specific Schema
            let pageSchema = "";
            if (page.id === 'faq') {
                pageSchema = `<script type="application/ld+json">\n${generateFaqSchema(faqData)}\n</script>`;
            } else if (page.id === 'menu') {
                pageSchema = `<script type="application/ld+json">\n${generateMenuSchema(menuData, siteData)}\n</script>`;
            }

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
                global_schema: page.id === 'index' ? omniSchema : restaurantSchema,
                page_specific_schema: pageSchema,
                current_year: new Date().getFullYear()
            });

            if (!fs.existsSync(PUBLIC_DIR)) fs.mkdirSync(PUBLIC_DIR);
            fs.writeFileSync(path.join(PUBLIC_DIR, page.slug), finalHtml);
        });

        // 5. Render Dynamic Story Detail Pages
        storiesData.stories.forEach(story => {
            const slug = `stories-${story.slug}.html`;
            generatedPages.push(slug);
            console.log(`[L3] Rendering Story: ${slug}`);

            const pageBody = nunjucks.render('story-detail.html', {
                ...context,
                active_story: story
            });

            const finalHtml = nunjucks.render('base.html', {
                ...context,
                content: pageBody,
                page_title: story.title,
                page_description: story.summary,
                current_page_id: 'stories',
                slug: slug,
                story: story,
                story: story,
                global_schema: restaurantSchema,
                current_year: new Date().getFullYear()
            });

            fs.writeFileSync(path.join(PUBLIC_DIR, slug), finalHtml);
        });

        // 5. Generate AEO Artifacts & Infrastructure (L3 logic to L4 output)
        console.log("[L3] Generating AEO Artifacts: sitemap.xml, robots.txt, _redirects");
        
        // Sitemap
        const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${generatedPages.map(p => `  <url><loc>${siteData.seo.site_url}/${p}</loc></url>`).join('\n')}
</urlset>`;
        fs.writeFileSync(path.join(PUBLIC_DIR, 'sitemap.xml'), sitemap);

        // Robots.txt
        const robots = `User-agent: *
Allow: /
Sitemap: ${siteData.seo.site_url}/sitemap.xml`;
        fs.writeFileSync(path.join(PUBLIC_DIR, 'robots.txt'), robots);

        // Cloudflare Redirects (AEO 301 Consolidation)
        const redirects = `
/blog            /stories         301
/contact-us      /location        301
/menu.html       /menu            301
/bookings.html   /booking         301
/faq.html        /faq             301
/location.html   /location        301
/stories.html    /stories         301
`;
        fs.writeFileSync(path.join(PUBLIC_DIR, '_redirects'), redirects);

        // 6. Generate Cloudflare Headers (Caching)
        const headers = `/*
  Cache-Control: public, max-age=31536000, immutable

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
