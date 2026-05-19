/**
 * Cloudflare Pages Function: /api/chat
 * Booking-first AI brain for chat and SMS channels.
 */

import {
    appendBookingRow,
    appendGuestEvent,
    emptyResponse,
    ensureBookingSheets,
    fetchGuestCoreInfo,
    jsonResponse,
    listBookings,
    normalizePhone,
    requireConfig,
    sendBookingEmail,
    updateBookingStatus,
    updateEmailTracking,
    upsertGuest
} from "./_booking.js";

const SITE_KNOWLEDGE = {
    name: "Dandy Lane Cafe",
    purpose: "A hidden-lane brunch sanctuary in Hobart CBD",
    hours: "Mon-Fri 7am-3pm, Sat-Sun 9am-2pm",
    address: "Unit 10 / 138 Collins Street, Hobart TAS 7000",
    phone: "0498061067",
    features: "Laptop-friendly, free WiFi, quiet workspace areas, pet-friendly outdoor seating",
    booking: "Bookings are booking-first: 1-6 future bookings can be confirmed, while 7+, same-day, or capacity-limited requests go to Manual_Review. Walk-in guidance can be added to Manual_Review replies."
};

const BOOKING_KEYWORD_PATTERN = /\b(book|booking|reserve|reservation|table)\b|预订|預訂|预约|預約|订位|訂位/i;
const GROUP_PATTERN = /\b(?:for|of|party of|group of)?\s*(\d{1,2})\s*(?:people|persons|pax|guests|位|人)?\b/i;
const EXPLICIT_GROUP_SIZE_PATTERN = /\b(?:table\s+for|book(?:ing)?\s+for|for|party of|group of)\s*(\d{1,2})\b|\b(\d{1,2})\s*(?:people|persons|pax|guests)\b/i;
const MOBILE_PATTERN = /(?:\+?\d[\d\s()-]{7,}\d)/;
const EMAIL_PATTERN = /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i;
const TIME_PATTERN = /\b(\d{1,2})(?::(\d{2}))?\s*(am|pm)\b|\b([01]?\d|2[0-3]):([0-5]\d)\b|(\d{1,2})点(?:(\d{1,2})分?)?/i;
const AT_HOUR_PATTERN = /\bat\s*(\d{1,2})\b/i;
const ISO_DATE_PATTERN = /\b(20\d{2})-(\d{1,2})-(\d{1,2})\b/;
const SLASH_DATE_PATTERN = /\b(\d{1,2})[\/-](\d{1,2})(?:[\/-](\d{2,4}))?\b/;
const WEEKDAY_PATTERN = /\b(monday|tuesday|wednesday|thursday|friday|saturday|sunday)\b/i;
const RELATIVE_DAY_PATTERN = /\b(today|tonight|tomorrow)\b|今天|今晚|明天/i;
const NAME_PATTERN = /\b(?:my name is|name is|this is|i am|it's)\s+([a-z][a-z' -]{1,40})\b/i;
const LOOKUP_FALLBACK_PATTERN = /\b(confirm|confirmation|double check|check|what time|what date|my booking|under the name|under)\b/i;
const CANCEL_FALLBACK_PATTERN = /\b(cancel|cancellation|won't be able to make|will not be able to make|can't make|cannot make)\b/i;

export async function onRequestPost(context) {
    const { request, env } = context;

    try {
        const body = await request.json();
        const channel = String(body.channel || "chat").trim().toLowerCase() || "chat";
        const messageText = String(body.message_text || body.message || "").trim();
        const incomingMobile = normalizePhone(body.from_phone || body.mobile || "");
        const history = normalizeHistory(body.history);
        const threadContext = normalizeThreadContext(body.thread_context);
        const previousBookingContext = normalizeBookingContext(body.booking_context);

        if (!messageText) {
            return jsonResponse(env, { error: "No message" }, { status: 400 });
        }

        const llmExtraction = await extractBookingSignals(env, {
            channel,
            messageText,
            history,
            threadContext,
            previousBookingContext,
            incomingMobile
        });
        const guestCoreInfo = await resolveGuestCoreInfo(env, body, history, threadContext);
        const bookingState = await buildBookingState({
            channel,
            messageText,
            history,
            threadContext,
            previousBookingContext,
            guestCoreInfo,
            incomingMobile,
            llmExtraction
        });
        const conversationMode = determineConversationMode({
            channel,
            messageText,
            history,
            threadContext,
            previousBookingContext,
            bookingState,
            llmExtraction
        });

        if (conversationMode === "general") {
            const reply = await generateGeneralReply(env, {
                messageText,
                history
            });

            return jsonResponse(env, {
                reply,
                booking_result: {
                    intent: "general",
                    mode: "general",
                    known_fields: {},
                    missing_fields: [],
                    next_action: "general_reply",
                    outcome: "",
                    guidance: []
                }
            });
        }

        let bookingResult;
        if (conversationMode === "lookup") {
            bookingResult = await handleLookupFlow(env, { bookingState, messageText, history });
        } else if (conversationMode === "cancel") {
            bookingResult = await handleCancelFlow(env, { bookingState, messageText, history });
        } else {
            bookingResult = await handleBookingFlow(env, {
                channel,
                bookingState,
                guestCoreInfo
            });
        }

        return jsonResponse(env, {
            reply: bookingResult.reply,
            booking_result: bookingResult.booking_result
        });
    } catch (error) {
        console.error("AI chat error:", error.message, error.stack);
        return jsonResponse(env, { error: error.message }, { status: 500 });
    }
}

export async function onRequestOptions(context) {
    return emptyResponse(context.env, "POST, OPTIONS");
}

function normalizeHistory(history) {
    if (!Array.isArray(history)) {
        return [];
    }

    return history
        .map((item) => {
            const role = item?.role === "bot" || item?.role === "model" || item?.role === "assistant"
                ? "assistant"
                : "user";
            const text = String(item?.text || item?.parts?.[0]?.text || "").trim();

            if (!text) {
                return null;
            }

             if (role === "assistant" && isLowValueAssistantReply(text)) {
                return null;
            }

            return { role, text };
        })
        .filter(Boolean)
        .slice(-12);
}

function normalizeThreadContext(threadContext) {
    return {
        recent_messages: Array.isArray(threadContext?.recent_messages) ? threadContext.recent_messages.slice(-6) : [],
        known_guest_name: String(threadContext?.known_guest_name || "").trim(),
        known_group_size: String(threadContext?.known_group_size || "").trim(),
        known_booking_date: String(threadContext?.known_booking_date || "").trim(),
        known_booking_time: String(threadContext?.known_booking_time || "").trim()
    };
}

function normalizeBookingContext(bookingContext) {
    return {
        intent: String(bookingContext?.intent || "").trim(),
        mode: String(bookingContext?.mode || "").trim(),
        known_fields: bookingContext?.known_fields && typeof bookingContext.known_fields === "object"
            ? bookingContext.known_fields
            : {},
        missing_fields: Array.isArray(bookingContext?.missing_fields) ? bookingContext.missing_fields : [],
        next_action: String(bookingContext?.next_action || "").trim(),
        outcome: String(bookingContext?.outcome || "").trim(),
        guidance: Array.isArray(bookingContext?.guidance) ? bookingContext.guidance : []
    };
}

async function resolveGuestCoreInfo(env, body, history, threadContext) {
    const isNewConversation = history.length <= 1 && (!Array.isArray(threadContext.recent_messages) || threadContext.recent_messages.length <= 1);
    if (!isNewConversation) {
        return null;
    }

    const email = String(body?.booking_context?.known_fields?.email || body?.email || "").trim();
    const mobile = normalizePhone(
        body?.booking_context?.known_fields?.mobile
        || body?.mobile
        || body?.from_phone
        || ""
    );

    if (!email && !mobile) {
        return null;
    }

    try {
        const config = await requireConfig(env);
        await ensureBookingSheets(config);
        return await fetchGuestCoreInfo(config, { email, mobile });
    } catch (error) {
        console.warn("Guest core info lookup skipped:", error.message);
        return null;
    }
}

async function buildBookingState({ channel, messageText, history, threadContext, previousBookingContext, guestCoreInfo, incomingMobile, llmExtraction }) {
    const promptedField = inferPromptedField(history, previousBookingContext);
    const extracted = normalizeLlmExtractedFields(llmExtraction, promptedField);
    const fallbackExtracted = extractBookingDetails(messageText, promptedField);
    const sanitizedCurrentTurn = sanitizeAmbiguousCurrentTurnSlots(messageText, promptedField, {
        extracted,
        fallbackExtracted
    });
    const historyDerived = buildHistoryDerivedFields(history);
    const structuredMobile = normalizePhone(firstNonEmpty(
        previousBookingContext.known_fields?.mobile,
        incomingMobile,
        guestCoreInfo?.mobile
    ));
    const merged = {
        name: firstNonEmpty(
            previousBookingContext.known_fields?.name,
            extracted.name,
            fallbackExtracted.name,
            threadContext.known_guest_name,
            guestCoreInfo?.name
        ),
        email: firstNonEmpty(
            previousBookingContext.known_fields?.email,
            extracted.email,
            fallbackExtracted.email,
            guestCoreInfo?.email
        ),
        mobile: normalizePhone(firstNonEmpty(
            structuredMobile,
            extracted.mobile,
            fallbackExtracted.mobile
        )),
        group_size: firstNonEmpty(
            previousBookingContext.known_fields?.group_size,
            threadContext.known_group_size,
            sanitizedCurrentTurn.extracted.group_size,
            sanitizedCurrentTurn.fallbackExtracted.group_size,
            historyDerived.group_size
        ),
        date: firstNonEmpty(
            previousBookingContext.known_fields?.date,
            threadContext.known_booking_date,
            sanitizedCurrentTurn.extracted.date,
            sanitizedCurrentTurn.fallbackExtracted.date,
            historyDerived.date
        ),
        time: firstNonEmpty(
            previousBookingContext.known_fields?.time,
            threadContext.known_booking_time,
            sanitizedCurrentTurn.extracted.time,
            sanitizedCurrentTurn.fallbackExtracted.time,
            historyDerived.time
        )
    };

    if (!merged.name && isLikelyStandaloneName(messageText) && shouldTreatStandaloneNameAsSlot({
        previousBookingContext,
        threadContext,
        merged
    })) {
        merged.name = sanitizeGuestName(messageText);
    }

    const normalizedDate = normalizeBookingDate(merged.date);
    const normalizedTime = normalizeBookingTime(merged.time);

    return {
        channel,
        language: detectLanguage(messageText),
        known_fields: {
            name: merged.name,
            email: merged.email,
            mobile: merged.mobile,
            group_size: merged.group_size,
            date: normalizedDate.value,
            date_label: normalizedDate.label,
            time: normalizedTime.value
        },
        guest_core_info: guestCoreInfo || null
    };
}

function determineConversationMode({ channel, messageText, history, threadContext, previousBookingContext, bookingState, llmExtraction }) {
    const llmMode = normalizeConversationMode(llmExtraction?.mode);
    if (llmMode) {
        return llmMode;
    }

    const previousMode = normalizeConversationMode(previousBookingContext.mode);
    if (previousMode && previousBookingContext.intent === "booking" && !previousBookingContext.outcome) {
        return previousMode;
    }

    if (CANCEL_FALLBACK_PATTERN.test(messageText)) {
        return "cancel";
    }

    if (LOOKUP_FALLBACK_PATTERN.test(messageText)) {
        return "lookup";
    }

    if (llmExtraction?.intent === "general" && channel !== "sms") {
        return "general";
    }

    if (Object.values(bookingState.known_fields).some(Boolean)) {
        return "create";
    }

    if (BOOKING_KEYWORD_PATTERN.test(messageText)) {
        return "create";
    }

    if (
        threadContext.known_guest_name
        || threadContext.known_group_size
        || threadContext.known_booking_date
        || threadContext.known_booking_time
        || Object.values(previousBookingContext.known_fields || {}).some(Boolean)
    ) {
        return "create";
    }

    const recentBotText = history
        .filter((item) => item.role === "assistant")
        .map((item) => item.text.toLowerCase())
        .join(" ");

    if (recentBotText.includes("booking") || recentBotText.includes("date would you like") || recentBotText.includes("what time") || recentBotText.includes("how many guests")) {
        return "create";
    }

    return "general";
}

async function handleBookingFlow(env, { channel, bookingState, guestCoreInfo }) {
    const knownFields = bookingState.known_fields;
    const missingFields = resolveMissingFields(knownFields);

    if (missingFields.length > 0) {
        const missingField = missingFields[0];
        return {
            reply: renderMissingFieldReply(missingField, bookingState.language, guestCoreInfo?.name || knownFields.name),
            booking_result: {
                intent: "booking",
                mode: "create",
                known_fields: serializeKnownFields(knownFields),
                missing_fields: missingFields,
                next_action: `ask_${missingField}`,
                outcome: "",
                guidance: []
            }
        };
    }

    const bookingOutcome = await determineBookingOutcome(env, knownFields);
    const bookingWrite = await persistBookingOutcome(env, knownFields, bookingOutcome, channel);
    const reply = renderOutcomeReply(bookingOutcome, bookingState.language, knownFields.name);

    return {
        reply,
        booking_result: {
            intent: "booking",
            mode: "create",
            known_fields: serializeKnownFields(knownFields),
            missing_fields: [],
            next_action: bookingOutcome.outcome === "Confirmed" ? "booking_confirmed" : "manual_review_pending",
            outcome: bookingOutcome.outcome,
            guidance: bookingOutcome.guidance,
            booking_status: bookingWrite?.booking_status || bookingOutcome.outcome
        }
    };
}

async function handleLookupFlow(env, { bookingState, messageText, history }) {
    const knownFields = bookingState.known_fields;
    const lookupResult = await resolveLookupResult(env, knownFields);
    const llmResult = await generateModeReply(env, {
        mode: "lookup",
        language: bookingState.language,
        messageText,
        history,
        knownFields,
        lookupResult,
        cancelResult: null
    });

    return {
        reply: llmResult.reply,
        booking_result: {
            intent: "booking",
            mode: "lookup",
            known_fields: serializeKnownFields(knownFields),
            missing_fields: Array.isArray(llmResult.missing_fields) ? llmResult.missing_fields : [],
            next_action: llmResult.next_action || (lookupResult.type === "match" ? "lookup_resolved" : "lookup_follow_up"),
            outcome: llmResult.outcome || (lookupResult.booking?.status || ""),
            guidance: Array.isArray(llmResult.guidance) ? llmResult.guidance : (lookupResult.type === "match" ? [] : [lookupResult.type])
        }
    };
}

async function handleCancelFlow(env, { bookingState, messageText, history }) {
    const knownFields = bookingState.known_fields;
    const lookupResult = await resolveLookupResult(env, knownFields);
    let cancelResult = null;

    if (lookupResult.type === "match") {
        const cancelledBooking = await cancelBooking(env, lookupResult.booking);
        cancelResult = {
            status: "cancelled",
            booking: cancelledBooking
        };
    } else {
        cancelResult = {
            status: lookupResult.type,
            booking: null
        };
    }

    const llmResult = await generateModeReply(env, {
        mode: "cancel",
        language: bookingState.language,
        messageText,
        history,
        knownFields,
        lookupResult,
        cancelResult
    });

    return {
        reply: llmResult.reply,
        booking_result: {
            intent: "booking",
            mode: "cancel",
            known_fields: serializeKnownFields(knownFields),
            missing_fields: Array.isArray(llmResult.missing_fields) ? llmResult.missing_fields : [],
            next_action: llmResult.next_action || (cancelResult.status === "cancelled" ? "cancel_completed" : "cancel_follow_up"),
            outcome: llmResult.outcome || (cancelResult.status === "cancelled" ? "Cancelled" : ""),
            guidance: Array.isArray(llmResult.guidance) ? llmResult.guidance : (cancelResult.status === "cancelled" ? [] : [cancelResult.status]),
            booking_status: cancelResult.status === "cancelled" ? "Cancelled" : undefined
        }
    };
}

function detectLanguage(messageText) {
    return /[\u4e00-\u9fff]/.test(messageText) ? "zh" : "en";
}

function isLowValueAssistantReply(text) {
    const normalized = String(text || "").trim().toLowerCase();
    return normalized === "could you say that again, mate?" || normalized === "how can i help?";
}

function inferPromptedField(history, previousBookingContext) {
    if (Array.isArray(previousBookingContext.missing_fields) && previousBookingContext.missing_fields.length > 0) {
        return previousBookingContext.missing_fields[0];
    }

    const assistantText = history
        .filter((item) => item.role === "assistant")
        .slice(-2)
        .map((item) => item.text.toLowerCase())
        .join(" ");

    if (assistantText.includes("what name") || assistantText.includes("put it under")) {
        return "name";
    }
    if (assistantText.includes("what date")) {
        return "date";
    }
    if (assistantText.includes("what time")) {
        return "time";
    }
    if (assistantText.includes("how many guests")) {
        return "group_size";
    }
    if (assistantText.includes("mobile")) {
        return "mobile";
    }

    return "";
}

function extractBookingDetails(messageText, promptedField) {
    const text = String(messageText || "").trim();
    const details = {
        name: "",
        email: "",
        mobile: "",
        group_size: "",
        date: "",
        time: ""
    };

    const emailMatch = text.match(EMAIL_PATTERN);
    if (emailMatch) {
        details.email = emailMatch[0].toLowerCase();
    }

    const phoneMatch = text.match(MOBILE_PATTERN);
    if (phoneMatch) {
        details.mobile = normalizePhone(phoneMatch[0]);
    }

    const groupMatch = text.match(GROUP_PATTERN);
    if (groupMatch) {
        const groupSize = Number.parseInt(groupMatch[1], 10);
        if (Number.isFinite(groupSize) && groupSize > 0) {
            details.group_size = String(groupSize);
        }
    }

    const normalizedDate = normalizeBookingDate(text);
    if (normalizedDate.value) {
        details.date = normalizedDate.value;
    }

    const normalizedTime = normalizeBookingTime(text, promptedField);
    if (normalizedTime.value) {
        details.time = normalizedTime.value;
    }

    const explicitNameMatch = text.match(NAME_PATTERN);
    if (explicitNameMatch) {
        details.name = sanitizeGuestName(explicitNameMatch[1]);
    } else if (promptedField === "name" && isLikelyStandaloneName(text)) {
        details.name = sanitizeGuestName(text);
    }

    return details;
}

async function extractBookingSignals(env, { channel, messageText, history, threadContext, previousBookingContext, incomingMobile }) {
    const apiKey = env.GEMINI_API_KEY;
    if (!apiKey) {
        return null;
    }

    const historyText = history
        .map((item) => `${item.role === "assistant" ? "assistant" : "guest"}: ${item.text}`)
        .join("\n");
    const knownFields = {
        name: String(previousBookingContext.known_fields?.name || threadContext.known_guest_name || "").trim(),
        mobile: normalizePhone(previousBookingContext.known_fields?.mobile || incomingMobile || ""),
        group_size: String(previousBookingContext.known_fields?.group_size || threadContext.known_group_size || "").trim(),
        date: String(previousBookingContext.known_fields?.date || threadContext.known_booking_date || "").trim(),
        time: String(previousBookingContext.known_fields?.time || threadContext.known_booking_time || "").trim()
    };

    const systemPrompt = [
        "You extract booking slots for a cafe booking brain.",
        "Return JSON only.",
        "Treat existing known_fields as higher priority facts than conversation history.",
        "For SMS, mobile is already known if provided.",
        "Infer booking intent, but do not invent missing fields.",
        "Classify the primary conversation mode as one of: general, create, lookup, cancel.",
        "Use lookup when the guest is asking to confirm, check, or find an existing booking.",
        "Use cancel when the guest wants to cancel an existing booking.",
        "Use create when the guest wants to make, complete, or continue a booking request.",
        "If the guest says 'at 10', interpret it as time 10:00.",
        "Never infer group_size from a bare hour or time expression such as 'at 12', 'tomorrow at 12', '12pm', or '12:30'.",
        "Only set group_size when the guest explicitly states the number of guests, such as 'for 2', '2 people', 'party of 4', or 'group of 5'.",
        "If a field is not clearly present, return an empty string for it.",
        "Use keys: mode, intent, name, mobile, group_size, date, time, confidence.",
        "mode must be one of: general, create, lookup, cancel.",
        "intent must be one of: booking, general. Use booking for create, lookup, and cancel.",
        "confidence must be one of: high, medium, low."
    ].join("\n");

    const userPrompt = JSON.stringify({
        channel,
        message_text: messageText,
        known_fields: knownFields,
        history: historyText
    });

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                system_instruction: { parts: [{ text: systemPrompt }] },
                contents: [{ role: "user", parts: [{ text: userPrompt }] }],
                generationConfig: {
                    response_mime_type: "application/json"
                }
            })
        });

        const data = await response.json();
        const text = String(data?.candidates?.[0]?.content?.parts?.[0]?.text || "").trim();
        if (!text) {
            return null;
        }

        return safeParseJson(text);
    } catch (error) {
        console.warn("Booking signal extraction skipped:", error.message);
        return null;
    }
}

function normalizeLlmExtractedFields(llmExtraction, promptedField) {
    if (!llmExtraction || typeof llmExtraction !== "object") {
        return {
            name: "",
            email: "",
            mobile: "",
            group_size: "",
            date: "",
            time: ""
        };
    }

    return {
        name: sanitizeGuestName(llmExtraction.name || ""),
        email: String(llmExtraction.email || "").trim().toLowerCase(),
        mobile: normalizePhone(llmExtraction.mobile || ""),
        group_size: String(llmExtraction.group_size || "").trim(),
        date: normalizeBookingDate(String(llmExtraction.date || "")).value,
        time: normalizeBookingTime(String(llmExtraction.time || ""), promptedField).value
    };
}

function buildHistoryDerivedFields(history) {
    const derived = {
        group_size: "",
        date: "",
        time: ""
    };

    const userMessages = Array.isArray(history)
        ? history.filter((item) => item.role === "user").map((item) => item.text)
        : [];

    for (const text of userMessages) {
        const details = extractBookingDetails(text, "");

        if (details.group_size) {
            derived.group_size = details.group_size;
        }
        if (details.date) {
            derived.date = details.date;
        }
        if (details.time) {
            derived.time = details.time;
        }
    }

    return derived;
}

function normalizeBookingDate(value) {
    const text = String(value || "").trim().toLowerCase();
    if (!text) {
        return { value: "", label: "" };
    }

    const now = new Date(new Date().toLocaleString("en-US", { timeZone: "Australia/Hobart" }));
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const relativeMatch = text.match(RELATIVE_DAY_PATTERN);
    if (relativeMatch) {
        const relative = relativeMatch[1];
        const date = new Date(startOfToday);
        const relativeLabel = relative || relativeMatch[0];

        if (relativeLabel === "tomorrow" || relativeLabel === "明天") {
            date.setDate(date.getDate() + 1);
        }
        return { value: formatDate(date), label: relativeLabel };
    }

    const isoMatch = text.match(ISO_DATE_PATTERN);
    if (isoMatch) {
        const date = new Date(Number.parseInt(isoMatch[1], 10), Number.parseInt(isoMatch[2], 10) - 1, Number.parseInt(isoMatch[3], 10));
        return { value: formatDate(date), label: formatDate(date) };
    }

    const slashMatch = text.match(SLASH_DATE_PATTERN);
    if (slashMatch) {
        const yearToken = slashMatch[3];
        const year = yearToken
            ? normalizeYear(yearToken)
            : inferFutureYear(Number.parseInt(slashMatch[2], 10), Number.parseInt(slashMatch[1], 10), startOfToday);
        const date = new Date(year, Number.parseInt(slashMatch[2], 10) - 1, Number.parseInt(slashMatch[1], 10));
        return { value: formatDate(date), label: formatDate(date) };
    }

    const weekdayMatch = text.match(WEEKDAY_PATTERN);
    if (weekdayMatch) {
        const date = nextWeekdayDate(startOfToday, weekdayMatch[1].toLowerCase());
        return { value: formatDate(date), label: weekdayMatch[1].toLowerCase() };
    }

    return { value: "", label: "" };
}

function normalizeBookingTime(value, promptedField = "") {
    const text = String(value || "").trim().toLowerCase();
    if (!text) {
        return { value: "" };
    }

    const atHourMatch = text.match(AT_HOUR_PATTERN);
    if (atHourMatch) {
        const hours = Number.parseInt(atHourMatch[1], 10);
        if (hours >= 0 && hours <= 23) {
            return {
                value: `${String(hours).padStart(2, "0")}:00`
            };
        }
    }

    const match = text.match(TIME_PATTERN);
    if (!match) {
        if (promptedField === "time" && /^\d{1,2}$/.test(text)) {
            const hours = Number.parseInt(text, 10);
            if (hours >= 0 && hours <= 23) {
                return {
                    value: `${String(hours).padStart(2, "0")}:00`
                };
            }
        }
        return { value: "" };
    }

    if (match[4] !== undefined) {
        return {
            value: `${String(Number.parseInt(match[4], 10)).padStart(2, "0")}:${match[5]}`
        };
    }

    if (match[6] !== undefined) {
        return {
            value: `${String(Number.parseInt(match[6], 10)).padStart(2, "0")}:${String(match[7] || "00").padStart(2, "0")}`
        };
    }

    let hours = Number.parseInt(match[1], 10);
    const minutes = match[2] || "00";
    const meridiem = match[3];

    if (meridiem === "pm" && hours < 12) {
        hours += 12;
    }
    if (meridiem === "am" && hours === 12) {
        hours = 0;
    }

    return {
        value: `${String(hours).padStart(2, "0")}:${minutes}`
    };
}

function sanitizeAmbiguousCurrentTurnSlots(messageText, promptedField, { extracted, fallbackExtracted }) {
    const currentText = String(messageText || "").trim();
    const timeValue = firstNonEmpty(extracted.time, fallbackExtracted.time);
    const groupValue = firstNonEmpty(extracted.group_size, fallbackExtracted.group_size);
    const hasExplicitGroupSize = hasExplicitGroupSizeSignal(currentText, promptedField);
    const hasExplicitTime = Boolean(normalizeBookingTime(currentText, promptedField).value);

    if (!currentText || !timeValue || !groupValue || hasExplicitGroupSize || !hasExplicitTime) {
        return { extracted, fallbackExtracted };
    }

    const timeHour = Number.parseInt(String(timeValue).split(":")[0] || "", 10);
    const groupSize = Number.parseInt(groupValue, 10);

    if (!Number.isFinite(timeHour) || !Number.isFinite(groupSize) || timeHour !== groupSize) {
        return { extracted, fallbackExtracted };
    }

    return {
        extracted: { ...extracted, group_size: "" },
        fallbackExtracted: { ...fallbackExtracted, group_size: "" }
    };
}

function hasExplicitGroupSizeSignal(text, promptedField) {
    if (promptedField === "group_size") {
        return true;
    }

    return EXPLICIT_GROUP_SIZE_PATTERN.test(String(text || ""));
}

function resolveMissingFields(knownFields) {
    const order = ["date", "time", "group_size", "name", "mobile"];
    const missing = [];

    for (const field of order) {
        const value = field === "mobile"
            ? firstNonEmpty(knownFields.mobile, knownFields.email)
            : knownFields[field];

        if (!value) {
            missing.push(field);
        }
    }

    return missing;
}

async function determineBookingOutcome(env, knownFields) {
    const groupSize = Number.parseInt(knownFields.group_size || "0", 10);
    const sameDay = isSameDayBooking(knownFields.date);
    const overCapacity = await isOverCapacity(env, knownFields.date, knownFields.time, groupSize);

    if (sameDay || groupSize >= 7 || overCapacity) {
        return {
            outcome: "Manual_Review",
            guidance: ["walk_in_welcome"]
        };
    }

    return {
        outcome: "Confirmed",
        guidance: []
    };
}

async function isOverCapacity(env, date, time, requestedPax) {
    if (!date || !time || !requestedPax) {
        return false;
    }

    try {
        const config = await requireConfig(env);
        await ensureBookingSheets(config);
        const bookings = await listBookings(config);
        const requestedHour = String(time).split(":")[0];

        const hourlyPax = bookings
            .filter((booking) => {
                if (booking.date !== date || booking.status === "Archived") {
                    return false;
                }
                return String(booking.time || "").split(":")[0] === requestedHour;
            })
            .reduce((sum, booking) => sum + (Number.parseInt(booking.group_size || "0", 10) || 0), 0);

        return hourlyPax + requestedPax > 16;
    } catch (error) {
        console.warn("Capacity check skipped:", error.message);
        return false;
    }
}

async function persistBookingOutcome(env, knownFields, bookingOutcome, channel) {
    const booking = {
        name: knownFields.name,
        email: knownFields.email || "",
        mobile: knownFields.mobile || "",
        group_size: knownFields.group_size,
        date: knownFields.date,
        time: knownFields.time
    };

    const config = await requireConfig(env);
    await ensureBookingSheets(config);

    const source = channel === "sms" ? "AI_SMS" : "AI_Chat";
    const { rowNumber } = await appendBookingRow(config, booking, bookingOutcome.outcome, { source });

    if (!rowNumber) {
        throw new Error("Failed to resolve appended booking row number");
    }

    let emailTracking = {
        email_sent_at: "",
        email_type: bookingOutcome.outcome === "Confirmed" ? "confirmed" : "pending_review",
        email_status: "skipped",
        email_error: ""
    };

    if (booking.email) {
        try {
            emailTracking = await sendBookingEmail(
                env,
                booking,
                bookingOutcome.outcome === "Confirmed" ? "confirmed" : "pending_review"
            );
        } catch (error) {
            console.error("Booking email send failed:", error.message);
            emailTracking = {
                email_sent_at: "",
                email_type: bookingOutcome.outcome === "Confirmed" ? "confirmed" : "pending_review",
                email_status: "failed",
                email_error: error.message
            };
        }
    }

    await updateEmailTracking(config, rowNumber, emailTracking);
    await upsertGuest(config, booking, bookingOutcome.outcome);
    await appendGuestEvent(config, "booking_created", booking, rowNumber, bookingOutcome.outcome);

    return {
        booking_status: bookingOutcome.outcome,
        row_number: rowNumber
    };
}

async function resolveLookupResult(env, knownFields) {
    const config = await requireConfig(env);
    await ensureBookingSheets(config);
    const bookings = await listBookings(config);

    return pickLookupMatch(bookings, knownFields);
}

function pickLookupMatch(bookings, knownFields) {
    const activeBookings = Array.isArray(bookings)
        ? bookings.filter((booking) => !["Archived", "Cancelled"].includes(String(booking.status || "")))
        : [];

    const scored = activeBookings
        .map((booking) => ({
            booking,
            score: scoreLookupMatch(booking, knownFields)
        }))
        .filter((entry) => entry.score > 0)
        .sort((left, right) => right.score - left.score);

    if (!scored.length) {
        return {
            type: hasLookupIdentifiers(knownFields) ? "no_match" : "missing_identifiers",
            booking: null
        };
    }

    const [best, secondBest] = scored;
    if (!best || best.score < 6) {
        return {
            type: hasLookupIdentifiers(knownFields) ? "ambiguous_match" : "missing_identifiers",
            booking: null
        };
    }

    if (secondBest && secondBest.score === best.score) {
        return {
            type: "ambiguous_match",
            booking: null
        };
    }

    return {
        type: "match",
        booking: best.booking
    };
}

function scoreLookupMatch(booking, knownFields) {
    let score = 0;
    const bookingMobile = normalizePhone(booking?.mobile || "");
    const knownMobile = normalizePhone(knownFields?.mobile || "");
    const bookingEmail = String(booking?.email || "").trim().toLowerCase();
    const knownEmail = String(knownFields?.email || "").trim().toLowerCase();
    const bookingName = normalizeComparableName(booking?.name || "");
    const knownName = normalizeComparableName(knownFields?.name || "");

    if (knownMobile && bookingMobile === knownMobile) {
        score += 6;
    }
    if (knownEmail && bookingEmail && bookingEmail === knownEmail) {
        score += 6;
    }
    if (knownName && bookingName && bookingName === knownName) {
        score += 3;
    }
    if (knownFields?.date && booking?.date === knownFields.date) {
        score += 3;
    }
    if (knownFields?.group_size && String(booking?.group_size || "") === String(knownFields.group_size || "")) {
        score += 2;
    }
    if (knownFields?.time && String(booking?.time || "") === String(knownFields.time || "")) {
        score += 2;
    }

    return score;
}

function hasLookupIdentifiers(knownFields) {
    return Boolean(
        String(knownFields?.name || "").trim()
        || String(knownFields?.mobile || "").trim()
        || String(knownFields?.email || "").trim()
        || String(knownFields?.date || "").trim()
    );
}

async function cancelBooking(env, booking) {
    const config = await requireConfig(env);
    await ensureBookingSheets(config);

    await updateBookingStatus(config, booking.id, "Cancelled");

    let emailTracking = {
        email_sent_at: "",
        email_type: "cancelled",
        email_status: "skipped",
        email_error: ""
    };

    if (booking.email) {
        try {
            emailTracking = await sendBookingEmail(env, booking, "cancelled");
        } catch (error) {
            console.error("Booking cancellation email failed:", error.message);
            emailTracking = {
                email_sent_at: "",
                email_type: "cancelled",
                email_status: "failed",
                email_error: error.message
            };
        }
    }

    await updateEmailTracking(config, booking.id, emailTracking);
    await upsertGuest(config, booking, "Cancelled", { incrementBookingCount: false });
    await appendGuestEvent(config, "booking_cancelled", booking, booking.id, "Cancelled");

    return {
        ...booking,
        status: "Cancelled"
    };
}

async function generateModeReply(env, { mode, language, messageText, history, knownFields, lookupResult, cancelResult }) {
    const apiKey = env.GEMINI_API_KEY;
    if (!apiKey) {
        return {
            reply: "I can help with that booking. Could you share a bit more detail?",
            missing_fields: [],
            next_action: `${mode}_follow_up`,
            outcome: "",
            guidance: []
        };
    }

    const historyText = Array.isArray(history)
        ? history.map((item) => `${item.role === "assistant" ? "assistant" : "guest"}: ${item.text}`).join("\n")
        : "";

    const systemPrompt = [
        "You are the booking AI brain for Dandy Lane Cafe.",
        "All customer-facing replies must be generated by you, not by templates.",
        "Return JSON only.",
        "Use keys: reply, missing_fields, next_action, outcome, guidance.",
        "reply must be concise, natural, and in the guest's language.",
        "missing_fields must be an array of zero or more of: name, email, mobile, group_size, date, time.",
        "next_action must be a short snake_case label.",
        "outcome should be empty unless a booking was found, confirmed, or cancelled.",
        "guidance must be an array of short labels.",
        "Do not invent booking details that are not present in known_fields or tool results.",
        "If the mode is lookup, use lookup_result as a fact source and decide whether to answer directly or ask for the minimum clarification.",
        "If the mode is cancel, use lookup_result and cancel_result as fact sources and decide whether to confirm cancellation or ask for the minimum clarification.",
        "If lookup_result is empty or ambiguous, ask for the minimum missing detail instead of acting like a create flow."
    ].join("\n");

    const userPrompt = JSON.stringify({
        mode,
        language,
        message_text: messageText,
        known_fields: knownFields,
        history: historyText,
        lookup_result: lookupResult,
        cancel_result: cancelResult
    });

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                system_instruction: { parts: [{ text: systemPrompt }] },
                contents: [{ role: "user", parts: [{ text: userPrompt }] }],
                generationConfig: {
                    response_mime_type: "application/json"
                }
            })
        });

        const data = await response.json();
        const text = String(data?.candidates?.[0]?.content?.parts?.[0]?.text || "").trim();
        if (!text) {
            throw new Error("Empty mode reply");
        }

        const parsed = safeParseJson(text);
        return {
            reply: String(parsed?.reply || "").trim(),
            missing_fields: Array.isArray(parsed?.missing_fields) ? parsed.missing_fields : [],
            next_action: String(parsed?.next_action || "").trim(),
            outcome: String(parsed?.outcome || "").trim(),
            guidance: Array.isArray(parsed?.guidance) ? parsed.guidance : []
        };
    } catch (error) {
        console.warn("Mode reply generation skipped:", error.message);
        return {
            reply: "I can help with that booking. Could you share a bit more detail?",
            missing_fields: [],
            next_action: `${mode}_follow_up`,
            outcome: "",
            guidance: []
        };
    }
}

function renderMissingFieldReply(field, language, guestName) {
    const replies = {
        en: {
            date: "What date would you like for the booking?",
            time: "What time would you like?",
            group_size: "How many guests should I book for?",
            name: "What name should I put the booking under?",
            mobile: "What mobile number should we use for this booking?"
        },
        zh: {
            date: "请问您想预订哪一天？",
            time: "请问您想几点到店？",
            group_size: "请问一共几位？",
            name: "请问预订留什么名字？",
            mobile: "请提供一个手机号码用于这次预订。"
        }
    };

    return replies[language]?.[field] || replies.en[field];
}

function renderOutcomeReply(bookingOutcome, language, guestName) {
    const nameText = guestName ? ` ${guestName}` : "";

    if (bookingOutcome.outcome === "Confirmed") {
        return language === "zh"
            ? `好的${nameText}，您的预订已经确认。我们期待您的到来。`
            : `All set${nameText}. Your booking is confirmed and we look forward to seeing you.`;
    }

    return language === "zh"
        ? `好的${nameText}，这次预订我先交给团队确认。若您方便，也欢迎直接 walk-in。`
        : `Thanks${nameText}. I've passed this booking to the team for manual review, and you're also welcome to walk in if that suits you.`;
}

function serializeKnownFields(knownFields) {
    return {
        name: knownFields.name,
        email: knownFields.email,
        mobile: knownFields.mobile,
        group_size: knownFields.group_size,
        date: knownFields.date,
        time: knownFields.time
    };
}

async function generateGeneralReply(env, { messageText, history }) {
    const apiKey = env.GEMINI_API_KEY;
    if (!apiKey) {
        return "I can help with bookings, opening hours, location, and general cafe questions.";
    }

    const systemPrompt = `You are a senior staff member at Dandy Lane Cafe.

Rules:
1. Never mention prices.
2. Never say you are an AI.
3. Reply in the customer's language.
4. Booking is the cafe's main workflow. If the customer clearly wants a booking, do not stay in general chat mode.
5. Keep replies concise and natural.

Knowledge:
- Location: ${SITE_KNOWLEDGE.address}
- Hours: ${SITE_KNOWLEDGE.hours}
- Features: ${SITE_KNOWLEDGE.features}
- Booking: ${SITE_KNOWLEDGE.booking}`;

    const contents = history.map((item) => ({
        role: item.role === "assistant" ? "model" : "user",
        parts: [{ text: item.text }]
    }));
    contents.push({ role: "user", parts: [{ text: messageText }] });

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            system_instruction: { parts: [{ text: systemPrompt }] },
            contents
        })
    });

    const data = await response.json();
    const candidate = data?.candidates?.[0]?.content?.parts?.[0];
    return String(candidate?.text || "How can I help?").trim();
}

function isLikelyStandaloneName(text) {
    const stripped = String(text || "").trim();
    if (!stripped || stripped.length > 40) {
        return false;
    }
    if (/\d/.test(stripped) || EMAIL_PATTERN.test(stripped) || MOBILE_PATTERN.test(stripped)) {
        return false;
    }
    return /^[a-z][a-z' -]+$/i.test(stripped) || /^[\u4e00-\u9fff]{2,6}$/u.test(stripped);
}

function shouldTreatStandaloneNameAsSlot({ previousBookingContext, threadContext, merged }) {
    const knownName = firstNonEmpty(previousBookingContext.known_fields?.name, threadContext.known_guest_name, merged.name);
    if (knownName) {
        return false;
    }

    return Boolean(
        firstNonEmpty(previousBookingContext.known_fields?.group_size, threadContext.known_group_size, merged.group_size)
        || firstNonEmpty(previousBookingContext.known_fields?.date, threadContext.known_booking_date, merged.date)
        || firstNonEmpty(previousBookingContext.known_fields?.time, threadContext.known_booking_time, merged.time)
        || firstNonEmpty(previousBookingContext.known_fields?.mobile, merged.mobile)
    );
}

function sanitizeGuestName(text) {
    return String(text || "")
        .trim()
        .replace(/\s+/g, " ")
        .replace(/[^\p{L}' -]/gu, "");
}

function normalizeComparableName(text) {
    return sanitizeGuestName(text).toLowerCase();
}

function normalizeConversationMode(mode) {
    const normalized = String(mode || "").trim().toLowerCase();
    return ["general", "create", "lookup", "cancel"].includes(normalized) ? normalized : "";
}

function isSameDayBooking(dateValue) {
    if (!dateValue) {
        return false;
    }

    const today = new Date(new Date().toLocaleString("en-US", { timeZone: "Australia/Hobart" }));
    return formatDate(new Date(today.getFullYear(), today.getMonth(), today.getDate())) === dateValue;
}

function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
}

function normalizeYear(yearToken) {
    const year = Number.parseInt(yearToken, 10);
    if (yearToken.length === 2) {
        return year + 2000;
    }
    return year;
}

function inferFutureYear(month, day, today) {
    const currentYear = today.getFullYear();
    const candidate = new Date(currentYear, month - 1, day);
    return candidate < today ? currentYear + 1 : currentYear;
}

function safeParseJson(text) {
    try {
        return JSON.parse(text);
    } catch (error) {
        const fenced = text.replace(/^```json\s*|\s*```$/g, "").trim();
        return JSON.parse(fenced);
    }
}

function nextWeekdayDate(today, weekdayName) {
    const weekdayIndex = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"].indexOf(weekdayName);
    const result = new Date(today);
    const current = result.getDay();
    let delta = weekdayIndex - current;

    if (delta <= 0) {
        delta += 7;
    }

    result.setDate(result.getDate() + delta);
    return result;
}

function firstNonEmpty(...values) {
    return values.find((value) => String(value || "").trim()) || "";
}
