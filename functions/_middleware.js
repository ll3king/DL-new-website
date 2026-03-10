// Dandy Lane Cafe - Data Janitor for Cloudflare Pages Cron
// Automatically archives expired bookings in Google Sheets

export async function scheduled(event, env, ctx) {
    ctx.waitUntil(runJanitor(env));
}

async function runJanitor(env) {
    try {
        console.log("JANITOR: Starting Cloudflare Cron Trigger...");

        let sAccountStr = env.GOOGLE_SERVICE_ACCOUNT_JSON;
        const spreadsheetId = env.SPREADSHEET_ID;
        if (!sAccountStr || !spreadsheetId) {
            console.error("JANITOR FAILED: Missing environment variables.");
            return;
        }

        const sAccount = JSON.parse(sAccountStr);
        const access_token = await getGoogleAuthToken(sAccount);

        // 1. Fetch Spreadsheet Metadata
        let metaRes = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}`, {
            headers: { 'Authorization': `Bearer ${access_token}` }
        });
        let meta = await metaRes.json();

        let sheet1Id = 0; // Default assuming first sheet is gid 0
        let archiveSheetExists = false;

        for (let s of meta.sheets || []) {
            if (s.properties.title === 'Sheet1') sheet1Id = s.properties.sheetId;
            if (s.properties.title === 'Archive') archiveSheetExists = true;
        }

        // 2. Create Archive Sheet if missing
        if (!archiveSheetExists) {
            console.log("JANITOR: Archive sheet missing. Creating...");
            const addSheetReq = {
                requests: [{
                    addSheet: {
                        properties: { title: 'Archive' }
                    }
                }]
            };
            await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}:batchUpdate`, {
                method: "POST",
                headers: { 'Authorization': `Bearer ${access_token}`, 'Content-Type': 'application/json' },
                body: JSON.stringify(addSheetReq)
            });

            // Append headers to new Archive sheet
            const headers = [['Name', 'Email', 'Mobile', 'Group_Size', 'Date', 'Time', 'Timestamp', 'Status', 'Source']];
            await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/Archive!A1:append?valueInputOption=USER_ENTERED`, {
                method: "POST",
                headers: { 'Authorization': `Bearer ${access_token}`, 'Content-Type': 'application/json' },
                body: JSON.stringify({ values: headers })
            });
        }

        // 3. Fetch Data from Sheet1
        let valuesRes = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/Sheet1!A:I`, {
            headers: { 'Authorization': `Bearer ${access_token}` }
        });
        let valuesData = await valuesRes.json();
        const allValues = valuesData.values || [];

        if (allValues.length <= 1) {
            console.log("JANITOR: No data to archive.");
            return;
        }

        // Setup Date (Hobart/AEST time)
        const formatter = new Intl.DateTimeFormat('en-CA', { timeZone: 'Australia/Hobart', year: 'numeric', month: '2-digit', day: '2-digit' });
        const todayStr = formatter.format(new Date()); // returns YYYY-MM-DD

        let rowsToArchive = [];
        let rowIndicesToDelete = [];

        for (let i = 1; i < allValues.length; i++) {
            const row = allValues[i];
            if (row.length < 8) continue;

            const rowDate = row[4];
            const rowStatus = row[7];

            if ((rowDate && rowDate < todayStr) || (rowStatus === 'Archived')) {
                // Ensure length is 9 for archive
                const paddedRow = [...row];
                while (paddedRow.length < 9) paddedRow.push("");

                rowsToArchive.push(paddedRow);
                rowIndicesToDelete.push(i); // i is 0-indexed row in array (which is row i+1 in Sheet)
            }
        }

        if (rowsToArchive.length === 0) {
            console.log("JANITOR: Active data is clean. No expired bookings found.");
            return;
        }

        // 4. Append to Archive
        await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/Archive!A:I:append?valueInputOption=USER_ENTERED`, {
            method: "POST",
            headers: { 'Authorization': `Bearer ${access_token}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({ values: rowsToArchive })
        });

        // 5. Delete from Sheet1 (Reverse order)
        rowIndicesToDelete.sort((a, b) => b - a); // high to low
        const deleteRequests = rowIndicesToDelete.map(idx => ({
            deleteDimension: {
                range: {
                    sheetId: sheet1Id,
                    dimension: "ROWS",
                    startIndex: idx,       // 0-bound, inclusive
                    endIndex: idx + 1      // 0-bound, exclusive
                }
            }
        }));

        const batchRes = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}:batchUpdate`, {
            method: "POST",
            headers: { 'Authorization': `Bearer ${access_token}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({ requests: deleteRequests })
        });

        if (batchRes.ok) {
            console.log(`JANITOR SUCCESS: Archived and deleted ${rowsToArchive.length} old bookings.`);
        } else {
            console.error(`JANITOR ERROR: Failed to delete rows.`, await batchRes.text());
        }

    } catch (e) {
        console.error("JANITOR ERROR:", e.message);
    }
}

// Authentication Helper
function b64u(s) { return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, ''); }
async function signRSA(c, p) {
    const pem = p.replace(/\\n/g, '\n').replace(/-----BEGIN PRIVATE KEY-----/g, '').replace(/-----END PRIVATE KEY-----/g, '').replace(/\s/g, '');
    const der = Uint8Array.from(atob(pem), c => c.charCodeAt(0));
    const key = await crypto.subtle.importKey("pkcs8", der.buffer, { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" }, false, ["sign"]);
    const sig = await crypto.subtle.sign("RSASSA-PKCS1-v1_5", key, new TextEncoder().encode(c));
    return b64u(String.fromCharCode(...new Uint8Array(sig)));
}

async function getGoogleAuthToken(sAccount) {
    const now = Math.floor(Date.now() / 1000);
    const header = b64u(JSON.stringify({ alg: "RS256", typ: "JWT" }));
    const claimSet = b64u(JSON.stringify({
        iss: sAccount.client_email,
        scope: "https://www.googleapis.com/auth/spreadsheets",
        aud: "https://oauth2.googleapis.com/token",
        exp: now + 3600,
        iat: now
    }));
    const signature = await signRSA(`${header}.${claimSet}`, sAccount.private_key);
    const jwt = `${header}.${claimSet}.${signature}`;

    const res = await fetch("https://oauth2.googleapis.com/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${jwt}`
    });
    const data = await res.json();
    return data.access_token;
}
