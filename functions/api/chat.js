/**
 * Cloudflare Pages Function: /api/chat
 * AI Concierge powered by Gemini with Tool Calling support
 */

const SITE_KNOWLEDGE = {
    name: "Dandy Lane Cafe",
    purpose: "A hidden-lane brunch sanctuary in Hobart CBD",
    hours: "Mon-Fri 7am-3pm, Sat-Sun 9am-2pm",
    address: "Unit 10 / 138 Collins Street, Hobart TAS 7000",
    phone: "0498061067",
    dishes: [
        "Wine-Infused Benedicts ($22) - Daily house-made hollandaise, 6 variations",
        "Potato Parmesan Rosti ($19.50) - Crispy rosti, grilled halloumi, avocado, poached egg",
        "Scotch Steak Sandwich ($24) - Prime scotch steak, caramelized onion jam"
    ],
    features: "Laptop-friendly, free WiFi, quiet workspace areas, pet-friendly outdoor seating",
    booking: "Walk-ins welcome. Groups of 6+ please call. Max 16 people per hour."
};

// Tool definition for Booking
const TOOLS = [
    {
        function_declarations: [
            {
                name: "create_booking",
                description: "Create a new table reservation for Dandy Lane Cafe. Call this when the user provides details like name, date, time, and group size.",
                parameters: {
                    type: "object",
                    properties: {
                        name: { type: "string", description: "Customer's full name" },
                        email: { type: "string", description: "Customer's email address" },
                        mobile: { type: "string", description: "Customer's mobile number" },
                        group_size: { type: "string", description: "Number of people in the group" },
                        date: { type: "string", description: "Date of reservation (YYYY-MM-DD)" },
                        time: { type: "string", description: "Time of reservation (HH:MM)" }
                    },
                    required: ["name", "email", "group_size", "date", "time"]
                }
            }
        ]
    }
];

export async function onRequestPost(context) {
    const { request, env } = context;
    const headers = { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" };

    try {
        const body = await request.json();
        const { message, history = [] } = body;

        if (!message) return new Response(JSON.stringify({ error: "Message is required" }), { status: 400, headers });

        const apiKey = env.GEMINI_API_KEY;
        if (!apiKey) return new Response(JSON.stringify({ error: "AI service not configured" }), { status: 503, headers });

        // Dynamic System Prompt with Current Date
        const now = new Date();
        const currentDateTime = now.toLocaleString('en-AU', { timeZone: 'Australia/Hobart' });

        const systemPrompt = `You are the Senior Concierge of Dandy Lane Cafe in Hobart. Be professional, warm, and concise.
Rules:
- Only answer about Dandy Lane Cafe.
- Use casual Australian English ("No worries", "Cheers").
- If someone says "Hi", just say "Hi, welcome to Dandy Lane. How can I help?"
- You CAN make bookings. If a user wants to book, ask for their name, email, mobile, group size, date, and time if missing.
- When you have all the info, call the 'create_booking' tool.
- NEVER say "I am an AI assistant".

Knowledge:
- Name: ${SITE_KNOWLEDGE.name}
- Address: ${SITE_KNOWLEDGE.address}
- Phone: ${SITE_KNOWLEDGE.phone}
- Hours: ${SITE_KNOWLEDGE.hours}
- Signature Dishes: ${SITE_KNOWLEDGE.dishes.join('; ')}
- Features: ${SITE_KNOWLEDGE.features}
- Booking Policy: ${SITE_KNOWLEDGE.booking}

IMPORTANT:
Current Time (Hobart): ${currentDateTime}
Today is: ${now.toLocaleDateString('en-AU', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', timeZone: 'Australia/Hobart' })}`;

        const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

        // Prepare contents for Gemini
        const contents = [
            ...history,
            { role: "user", parts: [{ text: message }] }
        ];

        // Initial call to Gemini
        const response = await fetch(geminiUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                system_instruction: { parts: [{ text: systemPrompt }] },
                contents: contents,
                tools: TOOLS
            })
        });

        if (!response.ok) {
            const err = await response.text();
            return new Response(JSON.stringify({ error: "Gemini Error", details: err }), { status: 502, headers });
        }

        let resData = await response.json();
        let candidate = resData?.candidates?.[0];
        let messageOutput = candidate?.content;

        // Check for Tool Calls
        if (messageOutput?.parts?.[0]?.functionCall) {
            const call = messageOutput.parts[0].functionCall;
            const functionName = call.name;
            const args = call.args;

            if (functionName === "create_booking") {
                // Execute Booking Logic
                const bookingResult = await handleCreateBooking(args, env);

                // Second call to Gemini with Tool Response
                const finalResponse = await fetch(geminiUrl, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        system_instruction: { parts: [{ text: systemPrompt }] },
                        contents: [
                            ...contents,
                            messageOutput, // The tool call message
                            {
                                role: "function", // Wait, for Google AI it's often role: "model" for call and "function" for response? 
                                // Actually for Gemini REST API v1beta: role: "function" or parts with functionResponse
                                parts: [{
                                    functionResponse: {
                                        name: functionName,
                                        response: { content: bookingResult }
                                    }
                                }]
                            }
                        ],
                        tools: TOOLS
                    })
                });

                resData = await finalResponse.json();
                candidate = resData?.candidates?.[0];
                const finalReply = candidate?.content?.parts?.[0]?.text || "Booking processed! Anything else?";
                return new Response(JSON.stringify({ reply: finalReply }), { headers });
            }
        }

        const reply = messageOutput?.parts?.[0]?.text || "I'm not sure how to respond. Can you tell me more?";
        return new Response(JSON.stringify({ reply }), { headers });

    } catch (error) {
        return new Response(JSON.stringify({ error: "Internal error", details: error.message }), { status: 500, headers });
    }
}

async function handleCreateBooking(args, env) {
    const { name, email, mobile, group_size, date, time } = args;

    // We basically call the same logic as bookings.js but internally
    // Reusing the Spreadsheet logic
    try {
        const serviceAccount = JSON.parse(env.GOOGLE_SERVICE_ACCOUNT_JSON);
        const spreadsheetId = env.SPREADSHEET_ID || '1d-FmRVSMfrUqNOhJjsbNVk2cgeqvkk5ZdDnDtx8QONc';

        const now = Math.floor(Date.now() / 1000);
        const header = b64u(JSON.stringify({ alg: "RS256", typ: "JWT" }));
        const claimSet = b64u(JSON.stringify({
            iss: serviceAccount.client_email,
            scope: "https://www.googleapis.com/auth/spreadsheets",
            aud: "https://oauth2.googleapis.com/token",
            exp: now + 3600,
            iat: now
        }));

        const signatureInput = `${header}.${claimSet}`;
        const signature = await signRSA(signatureInput, serviceAccount.private_key);
        const jwt = `${signatureInput}.${signature}`;

        const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${jwt}`
        });
        const tokenData = await tokenRes.json();
        const token = tokenData.access_token;

        const status = parseInt(group_size) > 6 ? "AI_Pending_Review" : "AI_Confirmed";
        const val = [name, email, mobile || '', group_size, date, time, new Date().toISOString(), status];

        const sheetRes = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/Sheet1!A:H:append?valueInputOption=USER_ENTERED`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({ values: [val] })
        });

        if (sheetRes.ok) {
            return `Success: Booking created for ${name} on ${date} at ${time}. Status: ${status}.`;
        } else {
            const err = await sheetRes.text();
            return `Error: Failed to write to Google Sheets. ${err}`;
        }
    } catch (e) {
        return `Error: Exception during booking processing. ${e.message}`;
    }
}

// Helpers
function b64u(s) { return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, ''); }
async function signRSA(content, pem) {
    const pemContents = pem
        .replace(/\\n/g, '\n') // Handle escaped newlines
        .replace(/-----BEGIN PRIVATE KEY-----/g, '')
        .replace(/-----END PRIVATE KEY-----/g, '')
        .replace(/\s/g, '');
    const binaryDer = Uint8Array.from(atob(pemContents), c => c.charCodeAt(0));
    const key = await crypto.subtle.importKey("pkcs8", binaryDer.buffer, { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" }, false, ["sign"]);
    const sig = await crypto.subtle.sign("RSASSA-PKCS1-v1_5", key, new TextEncoder().encode(content));
    return b64u(String.fromCharCode(...new Uint8Array(sig)));
}

export async function onRequestOptions() {
    return new Response(null, {
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type"
        }
    });
}
