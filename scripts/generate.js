const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const nunjucks = require('nunjucks');

// Law Check: L3 can read L0-L2
const DATA_PATH = path.join(__dirname, '../data/site.yaml');
const LAYOUTS_DIR = path.join(__dirname, '../src/layouts');
const BLOCKS_DIR = path.join(__dirname, '../src/blocks');
const PUBLIC_DIR = path.join(__dirname, '../public');
const SRC_ASSETS_DIR = path.join(__dirname, '../src/assets');

// Asset Pipeline: Copy src/assets -> public/assets during build
function copyAssets(src, dest) {
    if (!fs.existsSync(src)) return;
    if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
    fs.readdirSync(src).forEach(item => {
        const srcPath = path.join(src, item);
        const destPath = path.join(dest, item);
        if (fs.statSync(srcPath).isDirectory()) {
            copyAssets(srcPath, destPath);
        } else {
            fs.copyFileSync(srcPath, destPath);
        }
    });
}

// Configure Nunjucks to read from layouts and blocks
const env = nunjucks.configure([LAYOUTS_DIR, BLOCKS_DIR], { autoescape: true });

// Add custom filter for string operations not native to Nunjucks
env.addFilter('endswith', function (str, suffix) {
    if (typeof str !== 'string') return false;
    return str.endsWith(suffix);
});

function render() {
    console.log("[L3] Starting Site Generation (Nunjucks Engine)...");

    try {
        // 0. Asset Pipeline: Sync media files -> public/
        if (!fs.existsSync(PUBLIC_DIR)) fs.mkdirSync(PUBLIC_DIR, { recursive: true });
        console.log("[L3] Copying assets from src/assets -> public/assets...");
        copyAssets(SRC_ASSETS_DIR, path.join(PUBLIC_DIR, 'assets'));

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
                blocks: ['identity-hero.html', 'signature-trio.html', 'intent-match.html', 'faq-list.html', 'location-nap.html']
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
                "mainEntityOfPage": siteData.seo.site_url + "/menu.html",
                "hasMenuItem": menuItems
            }, null, 2);
        }

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
                current_year: new Date().getFullYear()
            });

            fs.writeFileSync(path.join(PUBLIC_DIR, slug), finalHtml);
        });

        // 5. Generate AEO Artifacts (L3 logic to L4 output)
        console.log("[L3] Generating AEO Artifacts: sitemap.xml & robots.txt");
        const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${generatedPages.map(p => `  <url><loc>${siteData.seo.site_url}/${p}</loc></url>`).join('\n')}
</urlset>`;
        fs.writeFileSync(path.join(PUBLIC_DIR, 'sitemap.xml'), sitemap);

        const robots = `User-agent: *
Allow: /
Sitemap: ${siteData.seo.site_url}/sitemap.xml`;
        fs.writeFileSync(path.join(PUBLIC_DIR, 'robots.txt'), robots);

        // 6. Export Knowledge for Cloudflare Functions (L0 -> L4 logic)
        const FUNCTIONS_DATA_DIR = path.join(__dirname, '../functions/api');
        if (!fs.existsSync(path.join(__dirname, '../functions'))) fs.mkdirSync(path.join(__dirname, '../functions'));
        if (!fs.existsSync(FUNCTIONS_DATA_DIR)) fs.mkdirSync(FUNCTIONS_DATA_DIR);

        const chatbotConfig = {
            identity: siteData.identity,
            operations: siteData.operations,
            dishes: siteData.signature_dishes,
            booking_terms: siteData.booking.terms,
            system_prompt: siteData.chatbot.system_prompt
        };
        fs.writeFileSync(path.join(FUNCTIONS_DATA_DIR, 'config.json'), JSON.stringify(chatbotConfig, null, 2));

        console.log("[L3] Build Successful. Files written to /public and /functions/api.");

    } catch (e) {
        console.error("[L3] Build Failed:", e.stack);
    }
}

render();
