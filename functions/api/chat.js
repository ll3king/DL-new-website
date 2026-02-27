/**
 * Cloudflare Pages Function: /api/chat
 * AI Concierge for Dandy Lane Cafe - Humanized Version
 */

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
    booking: "Groups of 6+ please call. Max 16 people per hour. Must book for tomorrow onwards."
};

const TOOLS = [
    {
        function_declarations: [
            {
                name: "create_booking",
                description: "Create a new table reservation. Call this ONLY for dates starting from tomorrow. If date is today, suggest walk-in instead.",
                parameters: {
                    type: "object",
                    properties: {
                        name: { type: "string" },
                        email: { type: "string" },
                        mobile: { type: "string" },
                        group_size: { type: "string" },
                        date: { type: "string", description: "Format: YYYY-MM-DD. Must be after today." },
                        time: { type: "string" }
                    },
                    required: ["name", "email", "group_size", "date", "time"]
                }
            },
            {
                name: "notify_management",
                description: "Notify management when a customer has a complex request, complaint, or question outside menu/hours.",
                parameters: {
                    type: "object",
                    properties: {
                        customer_name: { type: "string" },
                        contact: { type: "string" },
                        details: { type: "string", description: "The specific question or issue that needs human review." }
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

        if (!message) return new Response(JSON.stringify({ error: "Missing message" }), { status: 400, headers });

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
2. **NEVER** say "I am an AI", "I am a language model", or "I cannot remember info".
3. **MEMORY**: Use the provided conversation history to recognize the customer. If they told you their name or email earlier, USE IT.
4. **DATE LOGIC**: 
   - Today is: ${hobartTime}.
   - Reservations are for **TOMORROW onwards** only.
   - If a user asks for TODAY: Say "We only take online bookings for tomorrow onwards. For today, just walk in! We'll do our absolute best to find a seat for you."
   - If past date: Politely say that's in the past.
   - For dates like "28th Feb", assume 2026 (the upcoming occurrence). No need to verify the year.
5. **CAPACITY**: Max 6 people per booking. Over 6 must call ${SITE_KNOWLEDGE.phone}. Hourly cap is 16.
6. **SILENT HANDOFF**: For questions about supply chains, events, caterings, complaints, or anything complex, use 'notify_management'. Tell the user: "I'll check that with our manager and we'll get back to you shortly."
7. **LANGUAGE MIRRORING**: English is your primary language, but you must mirror the guest's language. If a guest speaks to you in a language other than English (like Chinese), reply in that language to provide a premium, multilingual service while keeping the professional Hobart staff persona.

Knowledge:
- Location: ${SITE_KNOWLEDGE.address}
- Hours: ${SITE_KNOWLEDGE.hours}
- Dishes: ${SITE_KNOWLEDGE.dishes.join('; ')}
- Phone: ${SITE_KNOWLEDGE.phone}

Tone: Professional, warm, Hobart local vibe. Keep answers to 1-2 short sentences.`;

        const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

        // Prepare History for Gemini
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

        const resData = await response.json();
        let candidate = resData?.candidates?.[0];
        let messageOutput = candidate?.content;

        // Handle Tool Calling
        if (messageOutput?.parts?.[0]?.functionCall) {
            const call = messageOutput.parts[0].functionCall;
            const functionName = call.name;
            const args = call.args;

            let resultData;
            if (functionName === "create_booking") {
                resultData = await handleBooking(args, env);
            } else if (functionName === "notify_management") {
                resultData = await handleNotify(args, env);
            }

            // Call 2: Final response with tool result
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
                            parts: [{ functionResponse: { name: functionName, response: { content: resultData } } }]
                        }
                    ],
                    tools: TOOLS
                })
            });

            const finalData = await finalRes.json();
            const finalReply = finalData?.candidates?.[0]?.content?.parts?.[0]?.text || "No worries, I've noted that down for you.";
            return new Response(JSON.stringify({ reply: finalReply }), { headers });
        }

        const reply = messageOutput?.parts?.[0]?.text || "Sorry mate, could you say that again?";
        return new Response(JSON.stringify({ reply }), { headers });

    } catch (e) {
        return new Response(JSON.stringify({ error: e.message }), { status: 500, headers });
    }
}

async function handleBooking(args, env) {
    try {
        const val = [args.name, args.email, args.mobile, args.group_size, args.date, args.time, new Date().toISOString(), "AI_Confirmed"];
        return await writeToSheet(val, env);
    } catch (e) { return "Error: " + e.message; }
}

async function handleNotify(args, env) {
    try {
        const val = [args.customer_name || 'Guest', 'N/A', args.contact || 'N/A', '0', 'N/A', 'N/A', new Date().toISOString(), `Manager_Review: ${args.details}`];
        return await writeToSheet(val, env);
    } catch (e) { return "Error: " + e.message; }
}

async function writeToSheet(values, env) {
    const sAccount = JSON.parse(env.GOOGLE_SERVICE_ACCOUNT_JSON);
    const spreadsheetId = env.SPREADSHEET_ID;

    // Auth
    const now = Math.floor(Date.now() / 1000);
    const header = b64u(JSON.stringify({ alg: "RS256", typ: "JWT" }));
    const claimSet = b64u(JSON.stringify({ iss: sAccount.client_email, scope: "https://www.googleapis.com/auth/spreadsheets", aud: "https://oauth2.googleapis.com/token", exp: now + 3600, iat: now }));
    const signature = await signRSA(`${header}.${claimSet}`, sAccount.private_key);
    const jwt = `${header}.${claimSet}.${signature}`;

    const tRes = await fetch("https://oauth2.googleapis.com/token", { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body: `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${jwt}` });
    const { access_token } = await tRes.json();

    const res = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/Sheet1!A:H:append?valueInputOption=USER_ENTERED`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${access_token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ values: [values] })
    });
    return res.ok ? "Success" : "Failed to sync";
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
