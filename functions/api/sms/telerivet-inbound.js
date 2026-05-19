import {
    ensureBookingSheets,
    fetchSmsThreadContext,
    normalizePhone,
    requireConfig,
    sendSmsMessage,
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
const EXPLICIT_PARTY_PATTERN = /\b(?:for|of|party of)\s*(\d{1,2})\b/i;
const PEOPLE_NOUN_PATTERN = /\b(\d{1,2})\s*(people|persons|pax|guests)\b/i;
const TIME_PATTERN = /\b(\d{1,2})(?::(\d{2}))?\s*(am|pm)\b/i;
const WEEKDAY_PATTERN = /\b(monday|tuesday|wednesday|thursday|friday|saturday|sunday)\b/i;
const RELATIVE_DAY_PATTERN = /\b(today|tonight|tomorrow)\b/i;
const DATE_PATTERN = /\b(\d{1,2})[\/-](\d{1,2})([\/-]\d{2,4})?\b/;
const EXPLICIT_NAME_PATTERN = /\b(?:my name is|name is)\s+([a-z][a-z' -]{1,40})\b/i;

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
    const hasParty = EXPLICIT_PARTY_PATTERN.test(text) || PEOPLE_NOUN_PATTERN.test(text);
    const hasTime = TIME_PATTERN.test(text);
    const hasDateSignal = WEEKDAY_PATTERN.test(text) || RELATIVE_DAY_PATTERN.test(text) || DATE_PATTERN.test(text);

    return hasParty && (hasTime || hasDateSignal);
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

function hasActiveBookingThread(threadContext) {
    if (!threadContext) {
        return false;
    }

    return Boolean(
        threadContext.known_guest_name
        || threadContext.known_group_size
        || threadContext.known_booking_date
        || threadContext.known_booking_time
        || (Array.isArray(threadContext.recent_messages) && threadContext.recent_messages.length > 0)
    );
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
        known_mobile: normalizePhone(threadContext?.known_mobile || "")
    };

    const explicitNameMatch = String(text || "").match(EXPLICIT_NAME_PATTERN);
    if (explicitNameMatch) {
        nextKnown.known_guest_name = sanitizeGuestName(explicitNameMatch[1]) || nextKnown.known_guest_name;
    } else if (shouldTreatAsStandaloneName(text, threadContext)) {
        nextKnown.known_guest_name = sanitizeGuestName(text) || nextKnown.known_guest_name;
    }

    const explicitPartyMatch = String(text || "").match(EXPLICIT_PARTY_PATTERN);
    const peopleNounMatch = String(text || "").match(PEOPLE_NOUN_PATTERN);
    if (explicitPartyMatch) {
        nextKnown.known_group_size = explicitPartyMatch[1] || nextKnown.known_group_size;
    } else if (peopleNounMatch) {
        nextKnown.known_group_size = peopleNounMatch[1] || nextKnown.known_group_size;
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

function appendAssistantMessage(previousMessages, replyText, timestamp) {
    const recentMessages = Array.isArray(previousMessages) ? [...previousMessages] : [];
    recentMessages.push({
        role: "assistant",
        text: replyText,
        at: timestamp
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
        known_mobile: knownFields.known_mobile || normalizePhone(inbound.from_phone),
        known_booking_date: "",
        known_booking_time: ""
    };
}

function buildAiInput(inbound, threadContext) {
    return {
        channel: "sms",
        from_phone: inbound.from_phone,
        message_text: inbound.text,
        thread_context: threadContext,
        booking_context: {
            source: "SMS",
            known_fields: {
                name: threadContext.known_guest_name || "",
                mobile: normalizePhone(threadContext.known_mobile || inbound.from_phone),
                group_size: threadContext.known_group_size || ""
            }
        }
    };
}

async function getAiReply(request, inbound, threadContext) {
    const origin = new URL(request.url).origin;
    const history = Array.isArray(threadContext?.recent_messages)
        ? threadContext.recent_messages
            .filter((message) => !(message.role === "guest" && message.text === inbound.text && message.at === inbound.received_at))
            .filter((message) => !(message.role === "assistant" && isLowValueAssistantReply(message.text)))
            .map((message) => ({
                role: message.role === "assistant" ? "assistant" : "user",
                text: message.text
            }))
        : [];

    const response = await fetch(`${origin}/api/chat`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            channel: "sms",
            message_text: inbound.text,
            history,
            from_phone: inbound.from_phone,
            thread_context: threadContext,
            booking_context: {
                source: "SMS",
                known_fields: {
                    name: threadContext.known_guest_name || "",
                    mobile: normalizePhone(threadContext.known_mobile || inbound.from_phone),
                    group_size: threadContext.known_group_size || ""
                }
            }
        })
    });

    const data = await response.json();
    if (!response.ok) {
        throw new Error(data?.error || "AI chat request failed");
    }

    console.log("Telerivet handler bridge message", {
        channel: "sms",
        message_text: inbound.text,
        history
    });
    console.log("Telerivet handler chat response", {
        has_reply: Boolean(data?.reply),
        reply_preview: String(data?.reply || "").slice(0, 160)
    });

    return String(data.reply || "").trim();
}

function isLowValueAssistantReply(text) {
    const normalized = String(text || "").trim().toLowerCase();
    return normalized === "could you say that again, mate?" || normalized === "how can i help?";
}

function shouldTreatAsStandaloneName(text, threadContext) {
    const stripped = String(text || "").trim();
    if (!stripped || stripped.length > 40 || /\d/.test(stripped)) {
        return false;
    }
    if (!/^[a-z][a-z' -]{1,40}$/i.test(stripped)) {
        return false;
    }

    const recentAssistantText = Array.isArray(threadContext?.recent_messages)
        ? threadContext.recent_messages
            .filter((message) => message.role === "assistant")
            .slice(-2)
            .map((message) => String(message.text || "").toLowerCase())
            .join(" ")
        : "";

    return recentAssistantText.includes("what name") || recentAssistantText.includes("put the booking under");
}

function sanitizeGuestName(text) {
    return String(text || "")
        .trim()
        .replace(/\s+/g, " ")
        .replace(/[^\p{L}' -]/gu, "");
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
        const config = await requireConfig(env);
        await ensureBookingSheets(config);

        const thread = await fetchSmsThreadContext(config, normalizePhone(inbound.from_phone));
        const gate = evaluateHighIntentBooking(inbound.text);
        const accepted = gate.accepted || hasActiveBookingThread(thread);

        if (!accepted) {
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

        const threadContext = buildThreadContext(thread, inbound);
        await upsertSmsThreadContext(config, {
            phone_normalized: inbound.from_phone,
            display_phone: inbound.from_phone,
            known_guest_name: threadContext.known_guest_name,
            known_mobile: normalizePhone(threadContext.known_mobile || inbound.from_phone),
            known_group_size: threadContext.known_group_size,
            known_booking_date: threadContext.known_booking_date,
            known_booking_time: threadContext.known_booking_time,
            recent_messages: threadContext.recent_messages,
            last_inbound_at: inbound.received_at,
            updated_at: new Date().toISOString()
        });

        const effectiveGate = accepted && !gate.accepted
            ? { accepted: true, intent_gate: "booking_thread_continuation" }
            : gate;
        const handlerInput = buildHandlerReadyInput(inbound, effectiveGate);
        const aiInput = buildAiInput(handlerInput, threadContext);
        const replyText = await getAiReply(request, inbound, threadContext);
        const nextRecentMessages = replyText
            ? appendAssistantMessage(threadContext.recent_messages, replyText, new Date().toISOString())
            : threadContext.recent_messages;

        console.log("Telerivet inbound accepted for handler", handlerInput);
        console.log("Telerivet handler prepared AI input", aiInput);
        console.log("Telerivet handler AI reply", {
            reply_text: replyText,
            outbound: replyText ? { status: "scheduled" } : null
        });

        const tailWork = [];

        if (replyText) {
            tailWork.push(
                sendSmsMessage(env, {
                    to: inbound.from_phone,
                    text: replyText
                })
                    .then((outbound) => {
                        console.log("Telerivet handler outbound completed", outbound);
                    })
                    .catch((error) => {
                        console.error("Telerivet handler outbound failed:", error.message);
                    })
            );

            tailWork.push(
                upsertSmsThreadContext(config, {
                    phone_normalized: inbound.from_phone,
                    display_phone: inbound.from_phone,
                    known_guest_name: threadContext.known_guest_name,
                    known_mobile: normalizePhone(threadContext.known_mobile || inbound.from_phone),
                    known_group_size: threadContext.known_group_size,
                    known_booking_date: threadContext.known_booking_date,
                    known_booking_time: threadContext.known_booking_time,
                    recent_messages: nextRecentMessages,
                    last_inbound_at: inbound.received_at,
                    updated_at: new Date().toISOString()
                }).catch((error) => {
                    console.error("Telerivet handler thread update failed:", error.message);
                })
            );
        }

        if (tailWork.length && typeof context.waitUntil === "function") {
            context.waitUntil(Promise.allSettled(tailWork));
        } else if (tailWork.length) {
            await Promise.allSettled(tailWork);
        }

        return jsonResponse({
            ok: true,
            received: true,
            accepted: true,
            gate: effectiveGate,
            handler_input: handlerInput,
            ai_input: aiInput,
            reply_text: replyText,
            outbound: replyText ? { status: "scheduled" } : null
        });
    } catch (error) {
        console.error("Telerivet inbound error:", error.message);
        return jsonResponse({ ok: false, error: error.message }, 500);
    }
}

export async function onRequestOptions() {
    return new Response(null, { headers: buildHeaders() });
}
