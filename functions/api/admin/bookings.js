/**
 * Cloudflare Pages Function: /api/admin/bookings
 * Secure admin backend for managing reservations via Google Sheets
 */

const HEADERS = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*"
};

function checkAuth(request, env) {
    const authHeader = request.headers.get("Authorization");
    const ADMIN_PASSWORD = env.ADMIN_PASSWORD || "DandyLane2024";

    if (!authHeader) return false;

    // Support both "Bearer <password>" and raw password
    const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : authHeader;
    return token === ADMIN_PASSWORD;
}

// GET: Fetch all bookings
export async function onRequestGet(context) {
    const { request, env } = context;

    if (!checkAuth(request, env)) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: HEADERS });
    }

    try {
        if (!env.GOOGLE_SERVICE_ACCOUNT_JSON) {
            // Return empty bookings if not configured (allows admin login to succeed)
            return new Response(JSON.stringify({ bookings: [], message: "Google Sheets not configured" }), { headers: HEADERS });
        }

        const serviceAccount = JSON.parse(env.GOOGLE_SERVICE_ACCOUNT_JSON);
        const SPREADSHEET_ID = env.SPREADSHEET_ID || '1d-FmRVSMfrUqNOhJjsbNVk2cgeqvkk5ZdDnDtx8QONc';

        const token = await getGoogleAuthToken(serviceAccount);
        const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/Sheet1!A2:H200`;
        const response = await fetch(url, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!response.ok) {
            const errText = await response.text();
            console.error("Sheets Read Error:", errText);
            return new Response(JSON.stringify({ bookings: [], error: "Failed to fetch from Sheets" }), { headers: HEADERS });
        }

        const data = await response.json();

        const bookings = (data.values || []).map((row, index) => ({
            id: (index + 2).toString(),
            name: row[0] || '',
            email: row[1] || '',
            mobile: row[2] || '',
            group_size: row[3] || '',
            date: row[4] || '',
            time: row[5] || '',
            timestamp: row[6] || '',
            status: row[7] || 'Pending'
        })).filter(b => b.status !== 'Archived'); // Hide archived bookings

        return new Response(JSON.stringify({ bookings }), { headers: HEADERS });

    } catch (error) {
        console.error("Admin GET Error:", error.message);
        return new Response(JSON.stringify({ bookings: [], error: error.message }), { status: 500, headers: HEADERS });
    }
}

// PATCH: Update booking status
export async function onRequestPatch(context) {
    const { request, env } = context;

    if (!checkAuth(request, env)) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: HEADERS });
    }

    try {
        const { id, action } = await request.json();
        if (!id || !action) {
            return new Response(JSON.stringify({ error: "id and action required" }), { status: 400, headers: HEADERS });
        }

        const serviceAccount = JSON.parse(env.GOOGLE_SERVICE_ACCOUNT_JSON);
        const SPREADSHEET_ID = env.SPREADSHEET_ID || '1d-FmRVSMfrUqNOhJjsbNVk2cgeqvkk5ZdDnDtx8QONc';
        const token = await getGoogleAuthToken(serviceAccount);

        let status = "Pending";
        if (action === "approve") status = "Confirmed";
        if (action === "archive") status = "Archived";

        const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/Sheet1!H${id}?valueInputOption=USER_ENTERED`;
        const response = await fetch(url, {
            method: "PUT",
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ values: [[status]] })
        });

        if (!response.ok) {
            const errText = await response.text();
            console.error("Sheets Update Error:", errText);
            throw new Error("Update failed");
        }

        return new Response(JSON.stringify({ message: "Updated", status }), { headers: HEADERS });

    } catch (error) {
        console.error("Admin PATCH Error:", error.message);
        return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: HEADERS });
    }
}

// Handle CORS preflight
export async function onRequestOptions() {
    return new Response(null, {
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, PATCH, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type, Authorization"
        }
    });
}

// --- Google Auth Helpers ---
async function getGoogleAuthToken(serviceAccount) {
    const { client_email, private_key } = serviceAccount;
    const now = Math.floor(Date.now() / 1000);
    const header = base64url(JSON.stringify({ alg: "RS256", typ: "JWT" }));
    const claimSet = base64url(JSON.stringify({
        iss: client_email,
        scope: "https://www.googleapis.com/auth/spreadsheets",
        aud: "https://oauth2.googleapis.com/token",
        exp: now + 3600,
        iat: now
    }));

    const signatureInput = `${header}.${claimSet}`;
    const signature = await signWithRSA(signatureInput, private_key);
    const jwt = `${signatureInput}.${signature}`;

    const res = await fetch("https://oauth2.googleapis.com/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${jwt}`
    });

    const data = await res.json();
    if (!res.ok || !data.access_token) {
        throw new Error(`Token exchange failed: ${data.error_description || data.error || 'Unknown'}`);
    }
    return data.access_token;
}

function base64url(str) {
    return btoa(str).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

async function signWithRSA(content, pem) {
    // Robust PEM cleaning for environment variables
    const pemContents = pem
        .replace(/\\n/g, '\n') // Handle escaped newlines
        .replace(/-----BEGIN PRIVATE KEY-----/g, '')
        .replace(/-----END PRIVATE KEY-----/g, '')
        .replace(/\s/g, '');

    const binaryDer = Uint8Array.from(atob(pemContents), c => c.charCodeAt(0));

    const key = await crypto.subtle.importKey(
        "pkcs8",
        binaryDer.buffer,
        { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
        false,
        ["sign"]
    );

    const sig = await crypto.subtle.sign("RSASSA-PKCS1-v1_5", key, new TextEncoder().encode(content));
    return base64url(String.fromCharCode(...new Uint8Array(sig)));
}
