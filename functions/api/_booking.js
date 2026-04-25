const SHEET_HEADERS = {
    Sheet1: [["name", "email", "mobile", "group_size", "date", "time", "created_at", "status", "source", "email_sent_at", "email_type", "email_status", "email_error"]],
    Guests: [["email_normalized", "email", "name", "mobile", "first_booking_at", "last_booking_at", "booking_count", "last_group_size", "last_booking_date", "last_status"]],
    GuestEvents: [["event_at", "event_type", "email_normalized", "booking_row", "booking_status", "details"]],
    SmsThreads: [["phone_normalized", "display_phone", "known_guest_name", "known_mobile", "known_group_size", "known_booking_date", "known_booking_time", "recent_messages_json", "last_inbound_at", "updated_at"]]
};

export function buildCorsHeaders(env, methods = "GET, POST, PATCH, OPTIONS") {
    const origin = env.ALLOWED_ORIGIN || "*";

    return {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": origin,
        "Access-Control-Allow-Methods": methods,
        "Access-Control-Allow-Headers": "Content-Type, Authorization"
    };
}

export function jsonResponse(env, payload, init = {}) {
    const headers = {
        ...buildCorsHeaders(env, init.methods),
        ...(init.headers || {})
    };

    return new Response(JSON.stringify(payload), {
        status: init.status || 200,
        headers
    });
}

export function emptyResponse(env, methods) {
    return new Response(null, {
        headers: buildCorsHeaders(env, methods)
    });
}

export function normalizeEmail(email) {
    return String(email || "").trim().toLowerCase();
}

function buildGuestKey(booking) {
    const normalizedEmail = normalizeEmail(booking.email);
    if (normalizedEmail) {
        return normalizedEmail;
    }

    const normalizedMobile = normalizePhone(booking.mobile);
    return normalizedMobile ? `phone:${normalizedMobile}` : "";
}

export function normalizePhone(phone) {
    const digits = String(phone || "").replace(/[^\d+]/g, "");
    if (!digits) {
        return "";
    }
    if (digits.startsWith("+")) {
        return digits;
    }
    if (digits.startsWith("61")) {
        return `+${digits}`;
    }
    if (digits.startsWith("0")) {
        return `+61${digits.slice(1)}`;
    }
    return `+${digits}`;
}

export function extractRowNumber(updatedRange) {
    const match = /![A-Z]+(\d+):/i.exec(updatedRange || "");
    return match ? Number.parseInt(match[1], 10) : null;
}

export function getEmailFlowType(groupSize) {
    return Number.parseInt(groupSize, 10) > 6 ? "pending_review" : "confirmed";
}

export function getTodayInHobart() {
    const formatter = new Intl.DateTimeFormat("en-CA", {
        timeZone: "Australia/Hobart",
        year: "numeric",
        month: "2-digit",
        day: "2-digit"
    });

    return formatter.format(new Date());
}

export function evaluateBookingRequest({ booking, existingBookings = [], today = getTodayInHobart() }) {
    const groupSize = Number.parseInt(booking.group_size || "0", 10);
    const normalizedDate = String(booking.date || "");
    const normalizedTime = String(booking.time || "");

    if (normalizedDate === today) {
        return {
            booking_status: "Manual_Review",
            email_type: "pending_review",
            reply_key: "same_day_review"
        };
    }

    if (groupSize > 6) {
        return {
            booking_status: "Manual_Review",
            email_type: "pending_review",
            reply_key: "large_group_review"
        };
    }

    const requestedHour = normalizedTime.split(":")[0];
    const hourlyPax = existingBookings
        .filter((existing) => {
            if (!existing || existing.date !== normalizedDate) return false;
            if (["Archived", "Cancelled"].includes(existing.status)) return false;
            return String(existing.time || "").split(":")[0] === requestedHour;
        })
        .reduce((sum, existing) => sum + (Number.parseInt(existing.group_size || "0", 10) || 0), 0);

    if (hourlyPax + groupSize > 16) {
        return {
            booking_status: "Manual_Review",
            email_type: "pending_review",
            reply_key: "capacity_review"
        };
    }

    return {
        booking_status: "Confirmed",
        email_type: "confirmed",
        reply_key: "confirmed"
    };
}

export async function requireConfig(env) {
    if (!env.GOOGLE_SERVICE_ACCOUNT_JSON) {
        throw new Error("GOOGLE_SERVICE_ACCOUNT_JSON is not configured");
    }
    if (!env.SPREADSHEET_ID) {
        throw new Error("SPREADSHEET_ID is not configured");
    }

    let serviceAccount;
    try {
        serviceAccount = JSON.parse(env.GOOGLE_SERVICE_ACCOUNT_JSON);
    } catch (error) {
        throw new Error(`Failed to parse GOOGLE_SERVICE_ACCOUNT_JSON: ${error.message}`);
    }

    const token = await getGoogleAuthToken(serviceAccount);
    return {
        spreadsheetId: env.SPREADSHEET_ID,
        token
    };
}

export async function ensureBookingSheets(config) {
    const metadata = await fetchSheetMetadata(config);
    const existingTitles = new Set((metadata.sheets || []).map((sheet) => sheet.properties?.title));
    const requests = [];

    for (const title of Object.keys(SHEET_HEADERS)) {
        if (!existingTitles.has(title)) {
            requests.push({
                addSheet: {
                    properties: { title }
                }
            });
        }
    }

    if (requests.length) {
        await batchUpdateSpreadsheet(config, requests);
    }

    await Promise.all(Object.entries(SHEET_HEADERS).map(([title, headers]) => ensureSheetHeader(config, title, headers)));
}

export async function appendBookingRow(config, booking, status, options = {}) {
    const normalizedOptions = typeof options === "string"
        ? { source: options }
        : (options || {});
    const row = [
        booking.name,
        booking.email,
        booking.mobile || "",
        String(booking.group_size || "1"),
        booking.date,
        booking.time,
        new Date().toISOString(),
        status,
        normalizedOptions.source || "Website",
        "",
        "",
        "",
        ""
    ];

    const result = await appendValues(config, "Sheet1!A:M", [row]);
    const rowNumber = extractRowNumber(result.updates?.updatedRange);
    return { rowNumber, row };
}

export async function fetchBookingRow(config, rowNumber) {
    const values = await getValues(config, `Sheet1!A${rowNumber}:M${rowNumber}`);
    const row = values[0] || [];

    return {
        id: String(rowNumber),
        name: row[0] || "",
        email: row[1] || "",
        mobile: row[2] || "",
        group_size: row[3] || "",
        date: row[4] || "",
        time: row[5] || "",
        timestamp: row[6] || "",
        status: row[7] || "",
        source: row[8] || "",
        email_sent_at: row[9] || "",
        email_type: row[10] || "",
        email_status: row[11] || "",
        email_error: row[12] || ""
    };
}

export async function updateBookingStatus(config, rowNumber, status) {
    await updateValues(config, `Sheet1!H${rowNumber}:H${rowNumber}`, [[status]]);
}

export async function updateEmailTracking(config, rowNumber, tracking) {
    const values = [[
        tracking.email_sent_at || "",
        tracking.email_type || "",
        tracking.email_status || "",
        tracking.email_error || ""
    ]];

    await updateValues(config, `Sheet1!J${rowNumber}:M${rowNumber}`, values);
}

export async function listBookings(config) {
    const rows = await getValues(config, "Sheet1!A2:M200");

    return rows
        .map((row, index) => ({
            id: String(index + 2),
            name: row[0] || "",
            email: row[1] || "",
            mobile: row[2] || "",
            group_size: row[3] || "",
            date: row[4] || "",
            time: row[5] || "",
            timestamp: row[6] || "",
            status: row[7] || "",
            source: row[8] || "",
            email_sent_at: row[9] || "",
            email_type: row[10] || "",
            email_status: row[11] || "",
            email_error: row[12] || ""
        }))
        .filter((booking) => booking.status !== "Archived");
}

export async function getBookingsForDate(config, date) {
    const rows = await getValues(config, "Sheet1!A2:M500");
    return rows
        .map((row, index) => ({
            id: String(index + 2),
            name: row[0] || "",
            email: row[1] || "",
            mobile: row[2] || "",
            group_size: row[3] || "",
            date: row[4] || "",
            time: row[5] || "",
            status: row[7] || "",
            source: row[8] || ""
        }))
        .filter((booking) => booking.date === date && booking.status !== "Archived");
}

export async function fetchGuestCoreInfo(config, identifiers = {}) {
    const normalizedEmail = normalizeEmail(identifiers.email);
    const normalizedMobile = normalizePhone(identifiers.mobile || identifiers.phone);

    if (!normalizedEmail && !normalizedMobile) {
        return null;
    }

    const rows = await getValues(config, "Guests!A2:J500");
    const match = rows.find((row) => {
        const rowEmail = normalizeEmail(row[0] || row[1] || "");
        const rowMobile = normalizePhone(row[3] || "");

        if (normalizedEmail && rowEmail === normalizedEmail) {
            return true;
        }

        if (normalizedMobile && rowMobile === normalizedMobile) {
            return true;
        }

        return false;
    });

    if (!match) {
        return null;
    }

    return {
        email: match[1] || "",
        name: match[2] || "",
        mobile: match[3] || "",
        booking_count: match[6] || "",
        last_group_size: match[7] || "",
        last_booking_date: match[8] || "",
        last_status: match[9] || ""
    };
}

export async function upsertGuest(config, booking, bookingStatus, options = {}) {
    const guestKey = buildGuestKey(booking);
    const rows = await getValues(config, "Guests!A:J");
    const existingIndex = rows.findIndex((row, index) => index > 0 && String(row[0] || "").trim() === guestKey);
    const now = new Date().toISOString();
    const incrementBookingCount = options.incrementBookingCount !== false;

    let firstBookingAt = now;
    let bookingCount = 1;

    if (existingIndex >= 0) {
        firstBookingAt = rows[existingIndex][4] || now;
        const previousCount = Number.parseInt(rows[existingIndex][6] || "0", 10);
        bookingCount = Number.isFinite(previousCount) ? previousCount : 0;
        bookingCount = incrementBookingCount ? bookingCount + 1 : bookingCount;
    } else if (!incrementBookingCount) {
        bookingCount = 0;
    }

    const guestRow = [
        guestKey,
        booking.email,
        booking.name,
        booking.mobile || "",
        firstBookingAt,
        now,
        String(bookingCount),
        String(booking.group_size || ""),
        `${booking.date} ${booking.time}`.trim(),
        bookingStatus
    ];

    if (existingIndex >= 0) {
        const rowNumber = existingIndex + 1;
        await updateValues(config, `Guests!A${rowNumber}:J${rowNumber}`, [guestRow]);
        return { rowNumber, bookingCount };
    }

    const result = await appendValues(config, "Guests!A:J", [guestRow]);
    return { rowNumber: extractRowNumber(result.updates?.updatedRange), bookingCount };
}

export async function appendGuestEvent(config, eventType, booking, bookingRow, bookingStatus) {
    const details = JSON.stringify({
        name: booking.name,
        email: booking.email,
        date: booking.date,
        time: booking.time,
        group_size: booking.group_size
    });

    await appendValues(config, "GuestEvents!A:F", [[
        new Date().toISOString(),
        eventType,
        buildGuestKey(booking),
        String(bookingRow || ""),
        bookingStatus,
        details
    ]]);
}

export async function fetchSmsThreadContext(config, phone) {
    const normalizedPhone = normalizePhone(phone);
    const rows = await getValues(config, "SmsThreads!A2:J500");
    const rowIndex = rows.findIndex((row) => normalizePhone(row[0]) === normalizedPhone);

    if (rowIndex === -1) {
        return null;
    }

    const row = rows[rowIndex];
    let recentMessages = [];

    try {
        recentMessages = row[7] ? JSON.parse(row[7]) : [];
    } catch (error) {
        recentMessages = [];
    }

    return {
        rowNumber: rowIndex + 2,
        phone_normalized: row[0] || "",
        display_phone: row[1] || "",
        known_guest_name: row[2] || "",
        known_mobile: row[3] || "",
        known_group_size: row[4] || "",
        known_booking_date: row[5] || "",
        known_booking_time: row[6] || "",
        recent_messages: Array.isArray(recentMessages) ? recentMessages : [],
        last_inbound_at: row[8] || "",
        updated_at: row[9] || ""
    };
}

export async function upsertSmsThreadContext(config, thread) {
    const normalizedPhone = normalizePhone(thread.phone_normalized || thread.display_phone);
    const existing = await fetchSmsThreadContext(config, normalizedPhone);
    const row = [[
        normalizedPhone,
        thread.display_phone || normalizedPhone,
        thread.known_guest_name || "",
        normalizePhone(thread.known_mobile || normalizedPhone),
        thread.known_group_size || "",
        thread.known_booking_date || "",
        thread.known_booking_time || "",
        JSON.stringify(thread.recent_messages || []),
        thread.last_inbound_at || "",
        thread.updated_at || new Date().toISOString()
    ]];

    if (existing) {
        await updateValues(config, `SmsThreads!A${existing.rowNumber}:J${existing.rowNumber}`, row);
        return { rowNumber: existing.rowNumber };
    }

    const result = await appendValues(config, "SmsThreads!A:J", row);
    return { rowNumber: extractRowNumber(result.updates?.updatedRange) };
}

export async function sendSmsMessage(env, payload) {
    if (!env.TELERIVET_API_KEY) {
        throw new Error("TELERIVET_API_KEY is not configured");
    }
    if (!env.TELERIVET_PROJECT_ID) {
        throw new Error("TELERIVET_PROJECT_ID is not configured");
    }

    const body = {
        content: payload.text,
        to_number: payload.to
    };

    if (env.TELERIVET_ROUTE_ID) {
        body.route_id = env.TELERIVET_ROUTE_ID;
    }

    const response = await fetch(`https://api.telerivet.com/v1/projects/${env.TELERIVET_PROJECT_ID}/messages/send`, {
        method: "POST",
        headers: {
            "Authorization": `Basic ${btoa(`${env.TELERIVET_API_KEY}:`)}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
    });

    const rawText = await response.text();
    let data = {};

    try {
        data = rawText ? JSON.parse(rawText) : {};
    } catch (error) {
        data = { raw: rawText };
    }

    if (!response.ok) {
        const errorMessage = data?.message || data?.error || rawText || "Unknown Telerivet send error";
        throw new Error(errorMessage);
    }

    return {
        provider_message_id: data.id || "",
        status: data.status || "queued"
    };
}

export async function sendBookingEmail(env, booking, emailType) {
    if (!booking.email) {
        return {
            email_sent_at: "",
            email_type: emailType,
            email_status: "skipped",
            email_error: ""
        };
    }

    if (!env.RESEND_API_KEY) {
        throw new Error("RESEND_API_KEY is not configured");
    }
    if (!env.BOOKING_FROM_EMAIL) {
        throw new Error("BOOKING_FROM_EMAIL is not configured");
    }

    const subjectMap = {
        confirmed: "Your Dandy Lane Cafe booking is confirmed",
        pending_review: "Your Dandy Lane Cafe booking is pending review",
        approval_confirmed: "Your Dandy Lane Cafe booking is now confirmed",
        cancelled: "Your Dandy Lane Cafe booking has been cancelled"
    };

    const introMap = {
        confirmed: "Your booking has been confirmed.",
        pending_review: "Thanks for your request. Our team will review it shortly.",
        approval_confirmed: "Your booking request has been approved and confirmed.",
        cancelled: "Your booking has been cancelled. Thank you for letting us know, and we hope to welcome you another time."
    };

    const statusLineMap = {
        confirmed: "Status: Confirmed",
        pending_review: "Status: Pending review",
        approval_confirmed: "Status: Confirmed after review",
        cancelled: "Status: Cancelled"
    };

    const payload = {
        from: env.BOOKING_FROM_EMAIL,
        to: [booking.email],
        subject: subjectMap[emailType] || subjectMap.confirmed,
        html: renderBookingEmailHtml(booking, introMap[emailType] || introMap.confirmed, statusLineMap[emailType] || statusLineMap.confirmed),
        text: renderBookingEmailText(booking, introMap[emailType] || introMap.confirmed, statusLineMap[emailType] || statusLineMap.confirmed)
    };

    if (env.BOOKING_REPLY_TO) {
        payload.reply_to = env.BOOKING_REPLY_TO;
    }

    const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${env.RESEND_API_KEY}`,
            "Content-Type": "application/json",
            "User-Agent": "dandy-lane-bookings/1.0"
        },
        body: JSON.stringify(payload)
    });

    const rawText = await response.text();
    let data = {};

    try {
        data = rawText ? JSON.parse(rawText) : {};
    } catch (error) {
        data = { raw: rawText };
    }

    if (!response.ok) {
        const errorMessage = data?.message || data?.error || rawText || "Unknown resend error";
        throw new Error(errorMessage);
    }

    return {
        email_sent_at: new Date().toISOString(),
        email_type: emailType,
        email_status: "sent",
        email_error: "",
        resend_id: data.id || ""
    };
}

export async function updateBookingRow(config, rowNumber, booking) {
    const existing = await fetchBookingRow(config, rowNumber);
    const values = [[
        booking.name ?? existing.name,
        booking.email ?? existing.email,
        booking.mobile ?? existing.mobile,
        String(booking.group_size ?? existing.group_size ?? ""),
        booking.date ?? existing.date,
        booking.time ?? existing.time,
        booking.created_at ?? existing.timestamp ?? new Date().toISOString(),
        booking.status ?? existing.status,
        booking.source ?? existing.source,
        booking.email_sent_at ?? existing.email_sent_at,
        booking.email_type ?? existing.email_type,
        booking.email_status ?? existing.email_status,
        booking.email_error ?? existing.email_error
    ]];

    await updateValues(config, `Sheet1!A${rowNumber}:M${rowNumber}`, values);
    return fetchBookingRow(config, rowNumber);
}

function renderBookingEmailHtml(booking, intro, statusLine) {
    return `
        <div style="font-family: Arial, sans-serif; color: #1f2937; line-height: 1.6;">
            <p>Hi ${escapeHtml(booking.name)},</p>
            <p>${escapeHtml(intro)}</p>
            <p>${escapeHtml(statusLine)}</p>
            <ul>
                <li>Date: ${escapeHtml(booking.date)}</li>
                <li>Time: ${escapeHtml(booking.time)}</li>
                <li>Group size: ${escapeHtml(String(booking.group_size || ""))}</li>
            </ul>
            <p>If you need to update your booking, reply to this email.</p>
            <p>Dandy Lane Cafe</p>
        </div>
    `.trim();
}

function renderBookingEmailText(booking, intro, statusLine) {
    return [
        `Hi ${booking.name},`,
        "",
        intro,
        statusLine,
        "",
        `Date: ${booking.date}`,
        `Time: ${booking.time}`,
        `Group size: ${booking.group_size}`,
        "",
        "If you need to update your booking, reply to this email.",
        "",
        "Dandy Lane Cafe"
    ].join("\n");
}

function escapeHtml(value) {
    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
}

async function ensureSheetHeader(config, title, headers) {
    const existing = await getValues(config, `${title}!1:1`);
    const expectedHeader = headers[0];
    const existingHeader = existing[0] || [];
    const needsUpdate = expectedHeader.some((header, index) => existingHeader[index] !== header);

    if (!existing.length || !existing[0].length || needsUpdate) {
        await updateValues(config, `${title}!A1:${columnLetter(headers[0].length)}1`, headers);
    }
}

async function fetchSheetMetadata(config) {
    const response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${config.spreadsheetId}`, {
        headers: {
            "Authorization": `Bearer ${config.token}`
        }
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch spreadsheet metadata: ${await response.text()}`);
    }

    return response.json();
}

async function batchUpdateSpreadsheet(config, requests) {
    const response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${config.spreadsheetId}:batchUpdate`, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${config.token}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ requests })
    });

    if (!response.ok) {
        throw new Error(`Failed to update spreadsheet structure: ${await response.text()}`);
    }

    return response.json();
}

async function getValues(config, range) {
    const response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${config.spreadsheetId}/values/${range}`, {
        headers: {
            "Authorization": `Bearer ${config.token}`
        }
    });

    if (!response.ok) {
        throw new Error(`Failed to read ${range}: ${await response.text()}`);
    }

    const data = await response.json();
    return data.values || [];
}

async function appendValues(config, range, values) {
    const response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${config.spreadsheetId}/values/${range}:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${config.token}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            values,
            majorDimension: "ROWS"
        })
    });

    if (!response.ok) {
        throw new Error(`Failed to append ${range}: ${await response.text()}`);
    }

    return response.json();
}

async function updateValues(config, range, values) {
    const response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${config.spreadsheetId}/values/${range}?valueInputOption=USER_ENTERED`, {
        method: "PUT",
        headers: {
            "Authorization": `Bearer ${config.token}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            values,
            majorDimension: "ROWS"
        })
    });

    if (!response.ok) {
        throw new Error(`Failed to update ${range}: ${await response.text()}`);
    }

    return response.json();
}

function columnLetter(columnNumber) {
    let current = columnNumber;
    let output = "";

    while (current > 0) {
        const remainder = (current - 1) % 26;
        output = String.fromCharCode(65 + remainder) + output;
        current = Math.floor((current - 1) / 26);
    }

    return output;
}

async function getGoogleAuthToken(serviceAccount) {
    const { client_email, private_key } = serviceAccount;
    const now = Math.floor(Date.now() / 1000);
    const header = base64url(JSON.stringify({ alg: "RS256", typ: "JWT" }));
    const claimSet = base64url(JSON.stringify({
        iss: client_email,
        scope: "https://www.googleapis.com/auth/spreadsheets",
        aud: "https://oauth2.googleapis.com/token",
        exp: now + 3600,
        iat: now
    }));

    const signatureInput = `${header}.${claimSet}`;
    const signature = await signWithRSA(signatureInput, private_key);
    const jwt = `${signatureInput}.${signature}`;

    const response = await fetch("https://oauth2.googleapis.com/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${jwt}`
    });

    const data = await response.json();
    if (!response.ok || !data.access_token) {
        throw new Error(`Token exchange failed: ${data.error_description || data.error || "Unknown error"}`);
    }

    return data.access_token;
}

function base64url(str) {
    return btoa(str).replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
}

async function signWithRSA(content, pem) {
    const pemContents = pem
        .replace(/\\n/g, "\n")
        .replace(/-----BEGIN PRIVATE KEY-----/g, "")
        .replace(/-----END PRIVATE KEY-----/g, "")
        .replace(/\s/g, "");

    const binaryDer = Uint8Array.from(atob(pemContents), (char) => char.charCodeAt(0));
    const key = await crypto.subtle.importKey(
        "pkcs8",
        binaryDer.buffer,
        { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
        false,
        ["sign"]
    );

    const signature = await crypto.subtle.sign("RSASSA-PKCS1-v1_5", key, new TextEncoder().encode(content));
    return base64url(String.fromCharCode(...new Uint8Array(signature)));
}
