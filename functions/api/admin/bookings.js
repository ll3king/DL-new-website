/**
 * Cloudflare Pages Function: /api/admin/bookings
 * Secure admin backend for managing reservations via Google Sheets.
 */

import {
    appendGuestEvent,
    emptyResponse,
    ensureBookingSheets,
    fetchBookingRow,
    jsonResponse,
    listBookings,
    requireConfig,
    sendBookingEmail,
    updateBookingStatus,
    updateEmailTracking,
    upsertGuest
} from "../_booking.js";

function getAdminPassword(env) {
    return env.ADMIN_PASSWORD ? String(env.ADMIN_PASSWORD) : "";
}

function checkAuth(request, env) {
    const adminPassword = getAdminPassword(env);
    if (!adminPassword) {
        return false;
    }

    const authHeader = request.headers.get("Authorization");
    if (!authHeader) {
        return false;
    }

    const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : authHeader;
    return token === adminPassword;
}

function getAuthErrorResponse(env) {
    if (!getAdminPassword(env)) {
        return jsonResponse(env, { error: "ADMIN_PASSWORD is not configured" }, { status: 500 });
    }

    return jsonResponse(env, { error: "Unauthorized" }, { status: 401 });
}

export async function onRequestGet(context) {
    const { request, env } = context;

    if (!checkAuth(request, env)) {
        return getAuthErrorResponse(env);
    }

    try {
        const config = await requireConfig(env);
        await ensureBookingSheets(config);
        const bookings = await listBookings(config);
        return jsonResponse(env, { bookings });
    } catch (error) {
        console.error("Admin GET Error:", error.message);
        return jsonResponse(env, { bookings: [], error: error.message }, { status: 500 });
    }
}

export async function onRequestPatch(context) {
    const { request, env } = context;

    if (!checkAuth(request, env)) {
        return getAuthErrorResponse(env);
    }

    try {
        const { id, action } = await request.json();
        if (!id || !action) {
            return jsonResponse(env, { error: "id and action required" }, { status: 400 });
        }
        if (!["approve", "archive"].includes(action)) {
            return jsonResponse(env, { error: "action must be approve or archive" }, { status: 400 });
        }

        const rowNumber = Number.parseInt(id, 10);
        if (!Number.isFinite(rowNumber) || rowNumber < 2) {
            return jsonResponse(env, { error: "id must be a valid Sheet row number" }, { status: 400 });
        }

        const config = await requireConfig(env);
        await ensureBookingSheets(config);

        let status = "Pending";
        if (action === "approve") status = "Confirmed";
        if (action === "archive") status = "Archived";

        await updateBookingStatus(config, rowNumber, status);

        const booking = await fetchBookingRow(config, rowNumber);
        booking.status = status;

        let emailTracking = null;

        if (action === "approve") {
            try {
                emailTracking = await sendBookingEmail(env, booking, "approval_confirmed");
            } catch (error) {
                console.error("Approval email send failed:", error.message);
                emailTracking = {
                    email_sent_at: "",
                    email_type: "approval_confirmed",
                    email_status: "failed",
                    email_error: error.message
                };
            }

            await updateEmailTracking(config, rowNumber, emailTracking);
            await upsertGuest(config, booking, status, { incrementBookingCount: false });
            await appendGuestEvent(config, "booking_confirmed", booking, rowNumber, status);
        }

        const refreshedBooking = await fetchBookingRow(config, rowNumber);

        return jsonResponse(env, {
            message: "Updated",
            status,
            booking: refreshedBooking
        });
    } catch (error) {
        console.error("Admin PATCH Error:", error.message);
        return jsonResponse(env, { error: error.message }, { status: 500 });
    }
}

export async function onRequestOptions(context) {
    return emptyResponse(context.env, "GET, PATCH, OPTIONS");
}
