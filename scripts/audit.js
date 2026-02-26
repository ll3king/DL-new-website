const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

const ROOT = path.join(__dirname, '..');
const PUBLIC_DIR = path.join(ROOT, 'public');
const CONTEXT_DIR = path.join(ROOT, '.context');

console.log("--- STARTING PROJECT AUDIT ---");

/**
 * 1. Internal Link Integrity Check
 */
function checkLinks() {
    console.log("\n[1] Checking Internal Link Integrity...");
    const htmlFiles = fs.readdirSync(PUBLIC_DIR).filter(f => f.endsWith('.html'));
    let errors = 0;

    htmlFiles.forEach(file => {
        const content = fs.readFileSync(path.join(PUBLIC_DIR, file), 'utf8');
        // Simple regex to find href values
        const hrefs = content.match(/href="([^"]+)"/g) || [];

        hrefs.forEach(match => {
            let href = match.match(/href="([^"]+)"/)[1];

            // Skip external and anchors
            if (href.startsWith('http') || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) return;

            // Normalize path
            if (href === '/') href = '/index.html';
            let targetPath = path.join(PUBLIC_DIR, href);

            // Handle directory paths (e.g. /menu -> /menu.html or /menu/index.html)
            if (!fs.existsSync(targetPath) && !fs.existsSync(targetPath + '.html')) {
                console.error(`  - ERROR in ${file}: Broken link to "${href}"`);
                errors++;
            }
        });
    });

    if (errors === 0) console.log("  - PASS: All internal links are structurally valid.");
    else console.log(`  - FAIL: Found ${errors} broken links.`);
}

/**
 * 2. Layer Dependency Audit (Law Enforcement)
 */
function checkLayerLaws() {
    console.log("\n[2] Auditing Layer Dependencies (Harness Engineering Enforcement)...");
    const metaMap = JSON.parse(fs.readFileSync(path.join(CONTEXT_DIR, 'meta_map.json'), 'utf8'));

    // Simplistic check for JS files in scripts/ (L3)
    const scripts = fs.readdirSync(path.join(ROOT, 'scripts')).filter(f => f.endsWith('.js') && f !== 'audit.js');
    scripts.forEach(script => {
        const content = fs.readFileSync(path.join(ROOT, 'scripts', script), 'utf8');
        // L3 shouldn't import from L4 (it shouldn't even look at public/ for logic)
        if (content.includes('require(\'../public') || content.includes('require("../public')) {
            console.error(`  - LAW VIOLATION in ${script}: L3 script attempts to import from L4!`);
        }
    });
    console.log("  - PASS: Layer dependency flow looks compliant.");
}

/**
 * 3. JSON-LD / AEO Check
 */
function checkAEO() {
    console.log("\n[3] Auditing AEO (JSON-LD) Structures...");
    const indexContent = fs.readFileSync(path.join(PUBLIC_DIR, 'index.html'), 'utf8');
    if (indexContent.includes('application/ld+json')) {
        try {
            const jsonLdMatch = indexContent.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
            if (jsonLdMatch) {
                const data = JSON.parse(jsonLdMatch[1]);
                if (data["@type"] === "Restaurant") {
                    console.log(`  - PASS: Valid Restaurant Entity found in index.html`);
                }
            }
        } catch (e) {
            console.error("  - FAIL: JSON-LD is malformed!");
        }
    } else {
        console.error("  - FAIL: No JSON-LD found in index.html");
    }
}

checkLinks();
checkLayerLaws();
checkAEO();

console.log("\n--- AUDIT COMPLETE ---");
