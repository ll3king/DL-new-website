/**
 * Cloudflare Pages Function: /api/admin/bookings
 * Securely manages bookings directly from Google Sheets.
 */

export async function onRequest(context) {
    const { request, env } = context;
    const authHeader = request.headers.get("Authorization");

    // 1. Authentication
    const ADMIN_PASSWORD = env.ADMIN_PASSWORD || "DandyLane2024"; // Default for trial
    if (!authHeader || authHeader !== `Bearer ${ADMIN_PASSWORD}`) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }

    const SPREADSHEET_ID = env.SPREADSHEET_ID || '1d-FmRVSMfrUqNOhJjsbNVk2cgeqvkk5ZdDnDtx8QONc';
    const serviceAccount = JSON.parse(env.GOOGLE_SERVICE_ACCOUNT_JSON);

    // --- GET: Fetch All Bookings ---
    if (request.method === "GET") {
        try {
            const token = await getGoogleAuthToken(serviceAccount);
            const url = `https://sheets.googleapis.com/v1/spreadsheets/${SPREADSHEET_ID}/values/Sheet1!A2:H100`;
            const response = await fetch(url, { headers: { 'Authorization': `Bearer ${token}` } });

            if (!response.ok) throw new Error("Fetch failed");
            const data = await response.json();

            // Map rows to objects
            const bookings = (data.values || []).map((row, index) => ({
                id: (index + 2).toString(), // Row number in Sheet
                name: row[0],
                email: row[1],
                mobile: row[2],
                group_size: row[3],
                date: row[4],
                time: row[5],
                timestamp: row[6],
                status: row[7] || "Pending"
            }));

            return new Response(JSON.stringify({ bookings }), { headers: { "Content-Type": "application/json" } });
        } catch (e) {
            return new Response(JSON.stringify({ error: e.message }), { status: 500 });
        }
    }

    // --- PATCH: Update/Archive Booking ---
    if (request.method === "PATCH") {
        try {
            const { id, action } = await request.json();
            const token = await getGoogleAuthToken(serviceAccount);

            let status = "Pending";
            if (action === "approve") status = "Confirmed";
            if (action === "archive") status = "Archived";

            // Update Column H (Status) for the specified row ID
            const url = `https://sheets.googleapis.com/v1/spreadsheets/${SPREADSHEET_ID}/values/Sheet1!H${id}?valueInputOption=USER_ENTERED`;
            const response = await fetch(url, {
                method: "PUT",
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ values: [[status]] })
            });

            if (!response.ok) throw new Error("Update failed");

            return new Response(JSON.stringify({ message: "Updated" }), { headers: { "Content-Type": "application/json" } });
        } catch (e) {
            return new Response(JSON.stringify({ error: e.message }), { status: 500 });
        }
    }

    return new Response(null, { status: 405 });
}

// Reuse Auth logic from bookings.js (Ideally shared in a util file, but in Pages /functions, we keep it simple)
async function getGoogleAuthToken(serviceAccount) {
    const { client_email, private_key } = serviceAccount;
    const header = { alg: "RS256", typ: "JWT" };
    const now = Math.floor(Date.now() / 1000);
    const claimSet = {
        iss: client_email,
        scope: "https://www.googleapis.com/auth/spreadsheets",
        aud: "https://oauth2.googleapis.com/token",
        exp: now + 3600,
        iat: now
    };
    const b64 = (obj) => btoa(JSON.stringify(obj)).replace(/=/g, "");
    const signatureInput = `${b64(header)}.${b64(claimSet)}`;

    const sig = await signAtEdge(signatureInput, private_key);
    const jwt = `${signatureInput}.${sig}`;

    const res = await fetch("https://oauth2.googleapis.com/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${jwt}`
    });
    const data = await res.json();
    return data.access_token;
}

async function signAtEdge(content, pem) {
    const pemContents = pem.replace(/-----BEGIN PRIVATE KEY-----|-----END PRIVATE KEY-----|\s/g, "");
    const binary = atob(pemContents);
    const buffer = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) buffer[i] = binary.charCodeAt(i);

    const key = await crypto.subtle.importKey("pkcs8", buffer.buffer, { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" }, false, ["sign"]);
    const signature = await crypto.subtle.sign("RSASSA-PKCS1-v1_5", key, new TextEncoder().encode(content));
    return btoa(String.fromCharCode(...new Uint8Array(signature))).replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
}
