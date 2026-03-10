export async function onRequest(context) {
    const { request, env } = context;

    // Secure the API using the existing ADMIN_PASSWORD
    const authHeader = request.headers.get("Authorization");
    if (authHeader !== `Bearer ${env.ADMIN_PASSWORD}`) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), {
            status: 401,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    try {
        const result = await runJanitor(env);
        return new Response(JSON.stringify(result), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}

async function runJanitor(env) {
    console.log("JANITOR: Starting Cloudflare Pages Maintenance...");

    let sAccountStr = env.GOOGLE_SERVICE_ACCOUNT_JSON;
    const spreadsheetId = env.SPREADSHEET_ID;
    if (!sAccountStr || !spreadsheetId) {
        throw new Error("Missing environment variables.");
    }

    const sAccount = JSON.parse(sAccountStr);
    const access_token = await getGoogleAuthToken(sAccount);

    // 1. Fetch Spreadsheet Metadata
    let metaRes = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}`, {
        headers: { 'Authorization': `Bearer ${access_token}` }
    });
    let meta = await metaRes.json();

    let sheet1Id = 0;
    let archiveSheetExists = false;

    for (let s of meta.sheets || []) {
        if (s.properties.title === 'Sheet1') sheet1Id = s.properties.sheetId;
        if (s.properties.title === 'Archive') archiveSheetExists = true;
    }

    // 2. Create Archive Sheet if missing
    if (!archiveSheetExists) {
        const addSheetReq = { requests: [{ addSheet: { properties: { title: 'Archive' } } }] };
        await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}:batchUpdate`, {
            method: "POST",
            headers: { 'Authorization': `Bearer ${access_token}`, 'Content-Type': 'application/json' },
            body: JSON.stringify(addSheetReq)
        });

        // Append 9-column headers
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
        return { message: "Active data is clean. No expired bookings found.", archived_count: 0 };
    }

    // Convert today's date using Hobart/AEST
    const formatter = new Intl.DateTimeFormat('en-CA', { timeZone: 'Australia/Hobart', year: 'numeric', month: '2-digit', day: '2-digit' });
    const todayStr = formatter.format(new Date());

    let rowsToArchive = [];
    let rowIndicesToDelete = [];

    for (let i = 1; i < allValues.length; i++) {
        const row = allValues[i];
        if (row.length < 8) continue;

        const rowDate = row[4];
        const rowStatus = row[7];

        if ((rowDate && rowDate < todayStr) || (rowStatus === 'Archived')) {
            const paddedRow = [...row];
            while (paddedRow.length < 9) paddedRow.push("");
            rowsToArchive.push(paddedRow);
            rowIndicesToDelete.push(i);
        }
    }

    if (rowsToArchive.length === 0) {
        return { message: "Active data is clean. No expired bookings found.", archived_count: 0 };
    }

    // 4. Append to Archive
    const appendRes = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/Archive!A:I:append?valueInputOption=USER_ENTERED`, {
        method: "POST",
        headers: { 'Authorization': `Bearer ${access_token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ values: rowsToArchive })
    });
    if (!appendRes.ok) throw new Error("Failed to write to Archive sheet.");

    // 5. Delete from Sheet1 (Reverse order)
    rowIndicesToDelete.sort((a, b) => b - a);
    const deleteRequests = rowIndicesToDelete.map(idx => ({
        deleteDimension: {
            range: {
                sheetId: sheet1Id,
                dimension: "ROWS",
                startIndex: idx,
                endIndex: idx + 1
            }
        }
    }));

    const batchRes = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}:batchUpdate`, {
        method: "POST",
        headers: { 'Authorization': `Bearer ${access_token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ requests: deleteRequests })
    });

    if (batchRes.ok) {
        return { message: "Janitor operation successful.", archived_count: rowsToArchive.length };
    } else {
        throw new Error(await batchRes.text());
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
