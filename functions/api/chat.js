/**
 * Cloudflare Pages Function: /api/chat
 * AI Concierge for Dandy Lane Cafe - Enhanced with Check Booking & Robust Sync
 */

import {
    appendBookingRow,
    ensureBookingSheets,
    evaluateBookingRequest,
    getBookingsForDate,
    requireConfig
} from "./_booking.js";

const SITE_KNOWLEDGE = {
    name: "Dandy Lane Cafe",
    purpose: "A hidden-lane brunch sanctuary in Hobart CBD",
    hours: "Mon-Fri 7am-3pm, Sat-Sun 9am-2pm",
    address: "Unit 10 / 138 Collins Street, Hobart TAS 7000",
    phone: "0498061067",
    dishes: [
        "Wine-Infused Benedicts - Daily house-made hollandaise, 6 variations",
        "Potato Parmesan Rosti - Crispy rosti, grilled halloumi, avocado, poached egg",
        "Scotch Steak Sandwich - Prime scotch steak, caramelized onion jam"
    ],
    features: "Laptop-friendly, free WiFi, quiet workspace areas, pet-friendly outdoor seating",
    booking: "Max 16 people per hour for automatic confirmation. 1-6 people can be auto-confirmed. 7+ people go to manual review. Same-day booking requests also go to manual review, and walk-ins are always welcome."
};

const TOOLS = [
    {
        function_declarations: [
            {
                name: "create_booking",
                description: "Create a new table reservation request.",
                parameters: {
                    type: "object",
                    properties: {
                        name: { type: "string" },
                        email: { type: "string" },
                        mobile: { type: "string" },
                        group_size: { type: "string" },
                        date: { type: "string", description: "YYYY-MM-DD" },
                        time: { type: "string" }
                    },
                    required: ["name", "email", "group_size", "date", "time"]
                }
            },
            {
                name: "check_booking",
                description: "Search for existing reservations by name or email.",
                parameters: {
                    type: "object",
                    properties: {
                        identifier: { type: "string", description: "Name or email of the guest" }
                    },
                    required: ["identifier"]
                }
            },
            {
                name: "notify_management",
                description: "Notify management for complex requests, complaints, or questions outside knowledge.",
                parameters: {
                    type: "object",
                    properties: {
                        customer_name: { type: "string" },
                        contact: { type: "string" },
                        details: { type: "string" }
                    },
                    required: ["details"]
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

        if (!message) return new Response(JSON.stringify({ error: "No message" }), { status: 400, headers });

        const apiKey = env.GEMINI_API_KEY;
        const now = new Date();
        const hobartTime = new Intl.DateTimeFormat('en-AU', {
            timeZone: 'Australia/Hobart',
            year: 'numeric', month: '2-digit', day: '2-digit',
            hour: '2-digit', minute: '2-digit', weekday: 'long'
        }).format(now);

        const systemPrompt = `You are a Senior Staff Member at Dandy Lane Cafe. You are NOT an AI. You are a real person helping customers.

CORE RULES:
1. **NEVER** mention prices.
2. **NEVER** say "I am an AI assistant".
3. **MEMORY**: Use conversation history.
4. **DATE LOGIC**: Today is: ${hobartTime}. Same-day bookings are allowed as manual review only. Encourage walk-ins for today.
5. **CAPACITY (STRICT)**: 16 people per hour max. 
6. **TIERED GROUPS**:
   - 1-6 on future dates: Standard booking.
   - 7+ people: Manual review. Tell guests we have received the request and walk-ins are welcome.
   - Same-day bookings: Manual review. Tell guests confirmation may take time and walk-ins are welcome.
   - Capacity limit: Manual review. Tell guests walk-ins are welcome.
7. **LANGUAGE MIRRORING**: Reply in the customer's language.

Knowledge:
- Location: ${SITE_KNOWLEDGE.address}
- Hours: ${SITE_KNOWLEDGE.hours}
- Booking: ${SITE_KNOWLEDGE.booking}`;

        const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

        // Build history sequence
        const contents = history.map(h => ({
            role: h.role === 'bot' ? 'model' : 'user',
            parts: [{ text: h.parts?.[0]?.text || h.text || "" }]
        }));
        contents.push({ role: "user", parts: [{ text: message }] });

        let response = await fetch(geminiUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                system_instruction: { parts: [{ text: systemPrompt }] },
                contents: contents,
                tools: TOOLS
            })
        });

        let resData = await response.json();
        let candidate = resData?.candidates?.[0];
        let messageOutput = candidate?.content;

        // Process Tool Calls
        if (messageOutput?.parts?.[0]?.functionCall) {
            const call = messageOutput.parts[0].functionCall;
            const functionName = call.name;
            const args = call.args;

            let toolResult;
            if (functionName === "create_booking") {
                toolResult = await handleCreate(args, env);
            } else if (functionName === "check_booking") {
                toolResult = await handleCheck(args, env);
            } else if (functionName === "notify_management") {
                toolResult = await handleNotify(args, env);
            }

            // Call 2: Generate final text response
            const finalRes = await fetch(geminiUrl, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    system_instruction: { parts: [{ text: systemPrompt }] },
                    contents: [
                        ...contents,
                        messageOutput,
                        {
                            role: "model",
                            parts: [{ functionResponse: { name: functionName, response: { content: toolResult } } }]
                        }
                    ],
                    tools: TOOLS
                })
            });

            const finalData = await finalRes.json();
            const finalReply = finalData?.candidates?.[0]?.content?.parts?.[0]?.text || "I've handled that for you. Anything else?";
            return new Response(JSON.stringify({ reply: finalReply }), { headers });
        }

        const reply = messageOutput?.parts?.[0]?.text || "Could you say that again, mate?";
        return new Response(JSON.stringify({ reply }), { headers });

    } catch (e) {
        return new Response(JSON.stringify({ error: e.message }), { status: 500, headers });
    }
}

async function handleCreate(args, env) {
    const booking = {
        name: args.name,
        email: args.email || "",
        mobile: args.mobile || "",
        group_size: args.group_size || "1",
        date: args.date,
        time: args.time
    };

    const config = await requireConfig(env);
    await ensureBookingSheets(config);
    const existingBookings = await getBookingsForDate(config, booking.date);
    const outcome = evaluateBookingRequest({ booking, existingBookings });
    await appendBookingRow(config, booking, outcome.booking_status, "AI_Concierge");

    if (outcome.reply_key === "same_day_review") {
        return "SAME_DAY_MANUAL_REVIEW: Thanks for your booking request for today. Same-day bookings are checked by our team manually, so confirmation may take a little time. If you're nearby, please come by anyway — we always keep space flowing for walk-ins and we'll do our best to look after you.";
    }

    if (outcome.reply_key === "large_group_review") {
        return "LARGE_GROUP_MANUAL_REVIEW: Thanks for your booking request. For groups of this size, our team checks availability manually before confirming. We've received your request and will review it as soon as possible. If you're nearby, you're also very welcome to come by and we'll do our best to look after you as a walk-in.";
    }

    if (outcome.reply_key === "capacity_review") {
        return "CAPACITY_MANUAL_REVIEW: That time is very tight for automatic online bookings, so I've passed your request to the team for review. If you're nearby, please feel free to come by anyway — we always do our best to help walk-ins.";
    }

    return `BOOKING_CONFIRMED: Booking confirmed for ${booking.date} at ${booking.time} for ${booking.group_size}.`;
}

async function handleCheck(args, env) {
    const id = args.identifier.toLowerCase();
    const result = await sheetOperation('GET', null, env);
    if (result.error) return "Error accessing records.";

    const rows = result.values || [];
    const match = rows.reverse().find(r => (r[0] && r[0].toLowerCase().includes(id)) || (r[1] && r[1].toLowerCase().includes(id)));

    if (match) {
        return `Found booking for ${match[0]} on ${match[4]} at ${match[5]}. Status: ${match[7]}.`;
    }
    return "No booking found. Would you like to create one?";
}

async function handleNotify(args, env) {
    const val = [args.customer_name || 'Guest', 'N/A', args.contact || 'N/A', '0', 'N/A', 'N/A', new Date().toISOString(), `ALERT: ${args.details}`, "AI_Concierge"];
    return await sheetOperation('APPEND', val, env);
}


// Unified Sheet Operation
async function sheetOperation(mode, values, env) {
    try {
        const sAccount = JSON.parse(env.GOOGLE_SERVICE_ACCOUNT_JSON);
        const spreadsheetId = env.SPREADSHEET_ID;

        // JWT Auth
        const now = Math.floor(Date.now() / 1000);
        const header = b64u(JSON.stringify({ alg: "RS256", typ: "JWT" }));
        const claimSet = b64u(JSON.stringify({ iss: sAccount.client_email, scope: "https://www.googleapis.com/auth/spreadsheets", aud: "https://oauth2.googleapis.com/token", exp: now + 3600, iat: now }));
        const signature = await signRSA(`${header}.${claimSet}`, sAccount.private_key);
        const jwt = `${header}.${claimSet}.${signature}`;

        const tRes = await fetch("https://oauth2.googleapis.com/token", { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body: `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${jwt}` });
        const { access_token } = await tRes.json();

        if (mode === 'GET') {
            const res = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/Sheet1!A:H`, {
                headers: { 'Authorization': `Bearer ${access_token}` }
            });
            return await res.json();
        } else {
            const res = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/Sheet1!A:H:append?valueInputOption=USER_ENTERED`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${access_token}`, 'Content-Type': 'application/json' },
                body: JSON.stringify({ values: [values] })
            });
            return res.ok ? { success: true } : { error: await res.text() };
        }
    } catch (e) { return { error: e.message }; }
}

function b64u(s) { return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, ''); }
async function signRSA(c, p) {
    const pem = p.replace(/\\n/g, '\n').replace(/-----BEGIN PRIVATE KEY-----/g, '').replace(/-----END PRIVATE KEY-----/g, '').replace(/\s/g, '');
    const der = Uint8Array.from(atob(pem), c => c.charCodeAt(0));
    const key = await crypto.subtle.importKey("pkcs8", der.buffer, { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" }, false, ["sign"]);
    const sig = await crypto.subtle.sign("RSASSA-PKCS1-v1_5", key, new TextEncoder().encode(c));
    return b64u(String.fromCharCode(...new Uint8Array(sig)));
}

export async function onRequestOptions() {
    return new Response(null, { headers: { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Methods": "POST, OPTIONS", "Access-Control-Allow-Headers": "Content-Type" } });
}
