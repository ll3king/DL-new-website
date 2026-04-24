function buildHeaders() {
    return {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization"
    };
}

function jsonResponse(payload, status = 200) {
    return new Response(JSON.stringify(payload), {
        status,
        headers: buildHeaders()
    });
}

export async function onRequestPost(context) {
    const { request, env } = context;

    try {
        const contentType = request.headers.get("content-type") || "";
        const rawBody = await request.text();
        const payload = Object.fromEntries(new URLSearchParams(rawBody).entries());

        const expectedSecret = String(env.TELERIVET_WEBHOOK_SECRET || "");
        const suppliedSecret = String(payload.secret || "");

        if (expectedSecret && suppliedSecret !== expectedSecret) {
            console.error("Telerivet sample webhook rejected: invalid secret");
            return jsonResponse({ ok: false, error: "Unauthorized" }, 401);
        }

        console.log("Telerivet sample webhook received", {
            contentType,
            payload,
            rawBody
        });

        return jsonResponse({
            ok: true,
            received: true,
            content_type: contentType,
            fields: Object.keys(payload)
        });
    } catch (error) {
        console.error("Telerivet sample webhook error:", error.message);
        return jsonResponse({ ok: false, error: error.message }, 500);
    }
}

export async function onRequestOptions() {
    return new Response(null, { headers: buildHeaders() });
}
