/**
 * Cloudflare Pages Function: /api/bookings
 * Handles new reservation requests and writes them to Google Sheets.
 */

export async function onRequestPost(context) {
    const { request, env } = context;

    try {
        const body = await request.json();
        const { name, email, mobile, group_size, date, time } = body;

        // 1. Validation
        if (!name || !email || !mobile || !date || !time) {
            return new Response(JSON.stringify({ error: "Missing required fields" }), { status: 400 });
        }

        // 2. Preparation for Google Sheets
        // SPREADSHEET_ID and GOOGLE_SERVICE_ACCOUNT_JSON should be in env
        const SPREADSHEET_ID = env.SPREADSHEET_ID || '1d-FmRVSMfrUqNOhJjsbNVk2cgeqvkk5ZdDnDtx8QONc';

        // We expect the JSON to be stored as a string in environment variables
        const serviceAccount = JSON.parse(env.GOOGLE_SERVICE_ACCOUNT_JSON);

        // 3. Get Auth Token (JWT)
        const token = await getGoogleAuthToken(serviceAccount);

        // 4. Append to Sheet
        const range = 'Sheet1!A:G'; // Adjust sheet name if necessary
        const url = `https://sheets.googleapis.com/v1/spreadsheets/${SPREADSHEET_ID}/values/${range}:append?valueInputOption=USER_ENTERED`;

        const values = [
            [name, email, mobile, group_size, date, time, new Date().toISOString()]
        ];

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ values })
        });

        if (!response.ok) {
            const errData = await response.json();
            throw new Error(`Sheets API Error: ${errData.error?.message || response.statusText}`);
        }

        return new Response(JSON.stringify({ status: "success", message: "Booking received" }), {
            headers: { "Content-Type": "application/json" }
        });

    } catch (error) {
        console.error("Booking System Error:", error);
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
}

/**
 * Generates a Google Auth Token using Service Account credentials
 * Implementation using Web Crypto API (supported by Cloudflare)
 */
async function getGoogleAuthToken(serviceAccount) {
    const { client_email, private_key } = serviceAccount;

    const header = {
        alg: "RS256",
        typ: "JWT"
    };

    const now = Math.floor(Date.now() / 1000);
    const claimSet = {
        iss: client_email,
        scope: "https://www.googleapis.com/auth/spreadsheets",
        aud: "https://oauth2.googleapis.com/token",
        exp: now + 3600,
        iat: now
    };

    const encodedHeader = btoa(JSON.stringify(header));
    const encodedClaimSet = btoa(JSON.stringify(claimSet));
    const signatureInput = `${encodedHeader}.${encodedClaimSet}`;

    // Sign using RSA-SHA256
    const signature = await signAtEdge(signatureInput, private_key);
    const jwt = `${signatureInput}.${signature}`;

    // Exchange JWT for Access Token
    const res = await fetch("https://oauth2.googleapis.com/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${jwt}`
    });

    const data = await res.json();
    if (!res.ok) throw new Error(`Token Exchange Failed: ${data.error_description || data.error}`);

    return data.access_token;
}

/**
 * Sign string using RSA-SHA256 with current Cloudflare subtle crypto
 */
async function signAtEdge(content, pem) {
    const pemHeader = "-----BEGIN PRIVATE KEY-----";
    const pemFooter = "-----END PRIVATE KEY-----";
    const pemContents = pem.replace(pemHeader, "").replace(pemFooter, "").replace(/\s/g, "");

    // Binary conversion
    const binaryDerString = atob(pemContents);
    const binaryDer = new Uint8Array(binaryDerString.length);
    for (let i = 0; i < binaryDerString.length; i++) {
        binaryDer[i] = binaryDerString.charCodeAt(i);
    }

    const key = await crypto.subtle.importKey(
        "pkcs8",
        binaryDer.buffer,
        {
            name: "RSASSA-PKCS1-v1_5",
            hash: "SHA-256",
        },
        false,
        ["sign"]
    );

    const signature = await crypto.subtle.sign(
        "RSASSA-PKCS1-v1_5",
        key,
        new TextEncoder().encode(content)
    );

    return btoa(String.fromCharCode(...new Uint8Array(signature)));
}
