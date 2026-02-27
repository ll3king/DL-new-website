/**
 * Cloudflare Pages Function: /api/bookings
 * Handles reservation requests -> Google Sheets
 */

const HEADERS = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*"
};

export async function onRequestPost(context) {
    const { request, env } = context;

    try {
        const body = await request.json();
        const { name, email, mobile, group_size, date, time } = body;

        if (!name || !email || !date || !time) {
            return new Response(JSON.stringify({ error: "Missing required fields: name, email, date, time" }), { status: 400, headers: HEADERS });
        }

        // Check if Google Sheets is configured
        if (!env.GOOGLE_SERVICE_ACCOUNT_JSON) {
            console.error("GOOGLE_SERVICE_ACCOUNT_JSON not configured");
            return new Response(JSON.stringify({ error: "Booking system not configured" }), { status: 503, headers: HEADERS });
        }

        let serviceAccount;
        try {
            serviceAccount = JSON.parse(env.GOOGLE_SERVICE_ACCOUNT_JSON);
        } catch (e) {
            console.error("Failed to parse service account JSON:", e.message);
            return new Response(JSON.stringify({ error: "Service config error" }), { status: 500, headers: HEADERS });
        }

        const SPREADSHEET_ID = env.SPREADSHEET_ID || '1d-FmRVSMfrUqNOhJjsbNVk2cgeqvkk5ZdDnDtx8QONc';

        // Get auth token
        const token = await getGoogleAuthToken(serviceAccount);

        // Determine status
        const status = parseInt(group_size) > 6 ? "Manual_Review" : "Confirmed";

        // Append to Sheet
        const range = 'Sheet1!A:H';
        const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${range}:append?valueInputOption=USER_ENTERED`;

        const values = [[name, email, mobile || '', group_size || '1', date, time, new Date().toISOString(), status]];

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ values })
        });

        if (!response.ok) {
            const errData = await response.text();
            console.error("Sheets API Error:", errData);
            return new Response(JSON.stringify({ error: "Failed to save booking" }), { status: 502, headers: HEADERS });
        }

        return new Response(JSON.stringify({ status: "success", message: "Booking received", booking_status: status }), { headers: HEADERS });

    } catch (error) {
        console.error("Booking Error:", error.message, error.stack);
        return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: HEADERS });
    }
}

// Handle CORS preflight
export async function onRequestOptions() {
    return new Response(null, {
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type"
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
        throw new Error(`Token exchange failed: ${data.error_description || data.error || 'Unknown error'}`);
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
