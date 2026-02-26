/**
 * Cloudflare Pages Function: /api/chat
 * AI Concierge powered by Gemini
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

const SYSTEM_PROMPT = `You are the Senior Concierge of Dandy Lane Cafe in Hobart. Be professional, warm, and concise.
Rules:
- Only answer about Dandy Lane Cafe (menu, location, hours, bookings)
- If asked about unrelated topics, politely decline
- Use casual Australian English ("No worries", "Cheers")
- If someone says "Hi", just say "Hi, welcome to Dandy Lane. How can I help?"
- Never say "I am an AI assistant"

Knowledge:
- Name: ${SITE_KNOWLEDGE.name}
- Address: ${SITE_KNOWLEDGE.address}
- Phone: ${SITE_KNOWLEDGE.phone}
- Hours: ${SITE_KNOWLEDGE.hours}
- Signature Dishes: ${SITE_KNOWLEDGE.dishes.join('; ')}
- Features: ${SITE_KNOWLEDGE.features}
- Booking Policy: ${SITE_KNOWLEDGE.booking}
Current Time: ${new Date().toISOString()}`;

export async function onRequestPost(context) {
    const { request, env } = context;

    const headers = {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
    };

    try {
        const body = await request.json();
        const { message } = body;

        if (!message) {
            return new Response(JSON.stringify({ error: "Message is required" }), { status: 400, headers });
        }

        const apiKey = env.GEMINI_API_KEY;
        if (!apiKey) {
            return new Response(JSON.stringify({ error: "AI service not configured" }), { status: 503, headers });
        }

        // Call Gemini REST API directly (no SDK dependency needed at edge)
        const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

        const geminiResponse = await fetch(geminiUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
                contents: [{ parts: [{ text: message }] }]
            })
        });

        if (!geminiResponse.ok) {
            const errText = await geminiResponse.text();
            console.error("Gemini API Error:", errText);
            return new Response(JSON.stringify({ error: "AI temporarily unavailable" }), { status: 502, headers });
        }

        const data = await geminiResponse.json();
        const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, I couldn't process that. Please try again.";

        return new Response(JSON.stringify({ reply }), { headers });

    } catch (error) {
        console.error("Chat Error:", error.message);
        return new Response(JSON.stringify({ error: "Internal error", details: error.message }), { status: 500, headers });
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
