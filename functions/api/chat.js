import { GoogleGenerativeAI } from "@google/generative-ai";
import config from "./config.json";

export async function onRequestPost(context) {
    const { request, env } = context;

    // 1. Validate Input
    let data;
    try {
        data = await request.json();
    } catch (e) {
        return new Response(JSON.stringify({ error: "Invalid JSON" }), { status: 400 });
    }

    const { message, sender_id } = data;
    if (!message) {
        return new Response(JSON.stringify({ error: "Message is required" }), { status: 400 });
    }

    // 2. Setup Gemini
    const genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({
        model: "gemini-2.0-flash", // Use 2.0 or 3 if available in your region/plan
        systemInstruction: getSystemInstruction()
    });

    try {
        // Simple chat for now (stateless as per L3 requirements, but we can add history if needed via KV/D1)
        // For now, we follow the current Python logic of stateless single-message processing 
        // OR we can use the Chat session if we pass history in the request.

        const result = await model.generateContent(message);
        const reply = result.response.text();

        return new Response(JSON.stringify({ reply }), {
            headers: { "Content-Type": "application/json" }
        });
    } catch (error) {
        console.error("Gemini Error:", error);
        return new Response(JSON.stringify({ error: "AI Failed", details: error.message }), { status: 500 });
    }
}

function getSystemInstruction() {
    const { identity, operations, dishes, booking_terms, system_prompt } = config;

    const context = `
--- KNOWLEDGE BASE (LATEST) ---
Venue: ${identity.name}
Purpose: ${identity.core_purpose}
Description: ${identity.description}
Hours: ${operations.hours_text}

Signature Dishes:
${dishes.map(d => `- ${d.name}: ${d.description}`).join('\n')}

Booking Terms:
${booking_terms.map(t => `- ${t}`).join('\n')}

DateTime: ${new Date().toISOString()}
--- END KNOWLEDGE BASE ---
`;

    return `${system_prompt}\n\n${context}`;
}
