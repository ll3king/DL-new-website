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

function normalizeInboundPayload(payload) {
    const fromPhone = String(payload.from_number_e164 || payload.from_number || "").trim();
    const toPhone = String(payload.to_number || payload["phone[phone_number]"] || "").trim();
    const text = String(payload.content || "").trim();

    return {
        provider: "telerivet",
        provider_message_id: String(payload.id || "").trim(),
        from_phone: fromPhone,
        to_phone: toPhone,
        text,
        received_at: String(payload.time_created || "").trim(),
        contact_id: String(payload.contact_id || payload["contact[id]"] || "").trim(),
        phone_id: String(payload.phone_id || payload["phone[id]"] || "").trim(),
        project_id: String(payload.project_id || payload["phone[project_id]"] || "").trim(),
        service_id: String(payload.service_id || "").trim(),
        message_type: String(payload.message_type || "").trim(),
        direction: String(payload.direction || "").trim(),
        status: String(payload.status || "").trim(),
        source: String(payload.source || "").trim()
    };
}

const BOOKING_KEYWORD_PATTERN = /\b(book|booking|reserve|reservation|table)\b/i;
const PEOPLE_PATTERN = /\b(for|of|party of)?\s*(\d{1,2})\s*(people|persons|pax|guests)?\b/i;
const TIME_PATTERN = /\b(\d{1,2})(?::(\d{2}))?\s*(am|pm)\b/i;
const WEEKDAY_PATTERN = /\b(monday|tuesday|wednesday|thursday|friday|saturday|sunday)\b/i;
const RELATIVE_DAY_PATTERN = /\b(today|tonight|tomorrow)\b/i;
const DATE_PATTERN = /\b(\d{1,2})[\/-](\d{1,2})([\/-]\d{2,4})?\b/;

function parseFormBody(rawBody) {
    return Object.fromEntries(new URLSearchParams(rawBody).entries());
}

function validateInboundEvent(payload) {
    if (payload.event !== "incoming_message") {
        return "Unsupported event";
    }
    if (!payload.id) {
        return "Missing message id";
    }
    if (!(payload.from_number_e164 || payload.from_number)) {
        return "Missing sender number";
    }
    if (!payload.content) {
        return "Missing message content";
    }
    return "";
}

function hasBookingStructure(text) {
    const hasParty = PEOPLE_PATTERN.test(text);
    const hasTime = TIME_PATTERN.test(text);
    const hasDateSignal = WEEKDAY_PATTERN.test(text) || RELATIVE_DAY_PATTERN.test(text) || DATE_PATTERN.test(text);

    return (hasParty && hasTime) || (hasParty && hasDateSignal) || (hasTime && hasDateSignal);
}

function evaluateHighIntentBooking(text) {
    const normalizedText = String(text || "").trim();
    const hasKeyword = BOOKING_KEYWORD_PATTERN.test(normalizedText);
    const hasStructure = hasBookingStructure(normalizedText);

    if (hasKeyword || hasStructure) {
        return {
            accepted: true,
            intent_gate: "booking_high_intent"
        };
    }

    return {
        accepted: false,
        intent_gate: "filtered_out",
        filter_reason: "not_booking_high_intent"
    };
}

function buildHandlerReadyInput(inbound, gate) {
    return {
        ...inbound,
        intent_gate: gate.intent_gate
    };
}

export async function onRequestPost(context) {
    const { request, env } = context;

    try {
        const rawBody = await request.text();
        const payload = parseFormBody(rawBody);

        const expectedSecret = String(env.TELERIVET_WEBHOOK_SECRET || "");
        const suppliedSecret = String(payload.secret || "");

        if (expectedSecret && suppliedSecret !== expectedSecret) {
            console.error("Telerivet inbound rejected: invalid secret");
            return jsonResponse({ ok: false, error: "Unauthorized" }, 401);
        }

        const validationError = validateInboundEvent(payload);
        if (validationError) {
            return jsonResponse({ ok: false, error: validationError }, 400);
        }

        const inbound = normalizeInboundPayload(payload);
        const gate = evaluateHighIntentBooking(inbound.text);

        if (!gate.accepted) {
            console.log("Telerivet inbound filtered out", {
                inbound,
                gate
            });

            return jsonResponse({
                ok: true,
                received: true,
                accepted: false,
                gate,
                inbound
            });
        }

        const handlerInput = buildHandlerReadyInput(inbound, gate);

        console.log("Telerivet inbound accepted for handler", handlerInput);

        return jsonResponse({
            ok: true,
            received: true,
            accepted: true,
            gate,
            handler_input: handlerInput
        });
    } catch (error) {
        console.error("Telerivet inbound error:", error.message);
        return jsonResponse({ ok: false, error: error.message }, 500);
    }
}

export async function onRequestOptions() {
    return new Response(null, { headers: buildHeaders() });
}
