import {
    ensureBookingSheets,
    fetchSmsThreadContext,
    normalizePhone,
    requireConfig,
    upsertSmsThreadContext
} from "../_booking.js";

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

function extractKnownFields(text, threadContext) {
    const nextKnown = {
        known_guest_name: threadContext?.known_guest_name || "",
        known_group_size: threadContext?.known_group_size || "",
        known_booking_date: threadContext?.known_booking_date || "",
        known_booking_time: threadContext?.known_booking_time || ""
    };

    const peopleMatch = String(text || "").match(PEOPLE_PATTERN);
    if (peopleMatch) {
        nextKnown.known_group_size = peopleMatch[2] || nextKnown.known_group_size;
    }

    const timeMatch = String(text || "").match(TIME_PATTERN);
    if (timeMatch) {
        const hours = Number.parseInt(timeMatch[1], 10);
        const minutes = timeMatch[2] || "00";
        const meridiem = String(timeMatch[3] || "").toLowerCase();
        let normalizedHours = hours;

        if (meridiem === "pm" && normalizedHours < 12) normalizedHours += 12;
        if (meridiem === "am" && normalizedHours === 12) normalizedHours = 0;

        nextKnown.known_booking_time = `${String(normalizedHours).padStart(2, "0")}:${minutes}`;
    }

    const weekdayMatch = String(text || "").match(WEEKDAY_PATTERN);
    const relativeDayMatch = String(text || "").match(RELATIVE_DAY_PATTERN);
    const dateMatch = String(text || "").match(DATE_PATTERN);
    if (weekdayMatch) {
        nextKnown.known_booking_date = weekdayMatch[1];
    } else if (relativeDayMatch) {
        nextKnown.known_booking_date = relativeDayMatch[1];
    } else if (dateMatch) {
        nextKnown.known_booking_date = dateMatch[0];
    }

    return nextKnown;
}

function buildRecentMessages(previousMessages, inbound) {
    const recentMessages = Array.isArray(previousMessages) ? [...previousMessages] : [];
    recentMessages.push({
        role: "guest",
        text: inbound.text,
        at: inbound.received_at
    });
    return recentMessages.slice(-6);
}

function buildThreadContext(threadContext, inbound) {
    const knownFields = extractKnownFields(inbound.text, threadContext);
    const recentMessages = buildRecentMessages(threadContext?.recent_messages, inbound);

    return {
        recent_messages: recentMessages,
        known_guest_name: knownFields.known_guest_name,
        known_group_size: knownFields.known_group_size,
        known_booking_date: knownFields.known_booking_date,
        known_booking_time: knownFields.known_booking_time
    };
}

function buildAiInput(inbound, threadContext) {
    return {
        channel: "sms",
        from_phone: inbound.from_phone,
        message_text: inbound.text,
        received_at: inbound.received_at,
        thread_context: threadContext,
        booking_context: {
            source: "SMS"
        }
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

        const config = await requireConfig(env);
        await ensureBookingSheets(config);

        const thread = await fetchSmsThreadContext(config, normalizePhone(inbound.from_phone));
        const threadContext = buildThreadContext(thread, inbound);
        await upsertSmsThreadContext(config, {
            phone_normalized: inbound.from_phone,
            display_phone: inbound.from_phone,
            known_guest_name: threadContext.known_guest_name,
            known_group_size: threadContext.known_group_size,
            known_booking_date: threadContext.known_booking_date,
            known_booking_time: threadContext.known_booking_time,
            recent_messages: threadContext.recent_messages,
            last_inbound_at: inbound.received_at,
            updated_at: new Date().toISOString()
        });

        const handlerInput = buildHandlerReadyInput(inbound, gate);
        const aiInput = buildAiInput(handlerInput, threadContext);

        console.log("Telerivet inbound accepted for handler", handlerInput);
        console.log("Telerivet handler prepared AI input", aiInput);

        return jsonResponse({
            ok: true,
            received: true,
            accepted: true,
            gate,
            handler_input: handlerInput,
            ai_input: aiInput
        });
    } catch (error) {
        console.error("Telerivet inbound error:", error.message);
        return jsonResponse({ ok: false, error: error.message }, 500);
    }
}

export async function onRequestOptions() {
    return new Response(null, { headers: buildHeaders() });
}
