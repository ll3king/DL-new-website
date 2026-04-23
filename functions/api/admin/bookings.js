/**
 * Cloudflare Pages Function: /api/admin/bookings
 * Secure admin backend for managing reservations via Google Sheets.
 */

import {
    appendGuestEvent,
    appendBookingRow,
    emptyResponse,
    ensureBookingSheets,
    fetchBookingRow,
    jsonResponse,
    listBookings,
    requireConfig,
    sendBookingEmail,
    updateBookingRow,
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
        const payload = await request.json();
        const { id, action } = payload;
        if (!id || !action) {
            return jsonResponse(env, { error: "id and action required" }, { status: 400 });
        }
        if (!["approve", "cancel", "edit"].includes(action)) {
            return jsonResponse(env, { error: "action must be approve, cancel or edit" }, { status: 400 });
        }

        const rowNumber = Number.parseInt(id, 10);
        if (!Number.isFinite(rowNumber) || rowNumber < 2) {
            return jsonResponse(env, { error: "id must be a valid Sheet row number" }, { status: 400 });
        }

        const config = await requireConfig(env);
        await ensureBookingSheets(config);

        let status = "Pending";
        let booking = await fetchBookingRow(config, rowNumber);

        let emailTracking = null;

        if (action === "approve") {
            status = "Confirmed";
            await updateBookingStatus(config, rowNumber, status);
            booking.status = status;

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

        if (action === "cancel") {
            status = "Cancelled";
            await updateBookingStatus(config, rowNumber, status);
            booking.status = status;

            try {
                emailTracking = await sendBookingEmail(env, booking, "cancelled");
            } catch (error) {
                console.error("Cancellation email send failed:", error.message);
                emailTracking = {
                    email_sent_at: "",
                    email_type: "cancelled",
                    email_status: "failed",
                    email_error: error.message
                };
            }

            await updateEmailTracking(config, rowNumber, emailTracking);
            await upsertGuest(config, booking, status, { incrementBookingCount: false });
            await appendGuestEvent(config, "booking_cancelled", booking, rowNumber, status);
        }

        if (action === "edit") {
            const updated = {
                name: payload.name,
                email: payload.email,
                mobile: payload.mobile,
                group_size: payload.group_size,
                date: payload.date,
                time: payload.time
            };

            booking = await updateBookingRow(config, rowNumber, updated);
            await upsertGuest(config, booking, booking.status || "Confirmed", { incrementBookingCount: false });
            await appendGuestEvent(config, "booking_updated", booking, rowNumber, booking.status || "Confirmed");
            return jsonResponse(env, {
                message: "Updated",
                status: booking.status,
                booking
            });
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

export async function onRequestPost(context) {
    const { request, env } = context;

    if (!checkAuth(request, env)) {
        return getAuthErrorResponse(env);
    }

    try {
        const body = await request.json();
        const booking = {
            name: body.name,
            email: body.email || "",
            mobile: body.mobile || "",
            group_size: body.group_size || "",
            date: body.date,
            time: body.time
        };

        if (!booking.name || !booking.mobile || !booking.group_size || !booking.date || !booking.time) {
            return jsonResponse(env, { error: "name, mobile, group_size, date and time are required" }, { status: 400 });
        }

        const config = await requireConfig(env);
        await ensureBookingSheets(config);
        const { rowNumber } = await appendBookingRow(config, booking, "Confirmed", "Admin");

        if (!rowNumber) {
            throw new Error("Failed to create booking");
        }

        await upsertGuest(config, booking, "Confirmed");
        await appendGuestEvent(config, "booking_created_admin", booking, rowNumber, "Confirmed");

        return jsonResponse(env, {
            message: "Created",
            booking: await fetchBookingRow(config, rowNumber)
        }, { status: 201 });
    } catch (error) {
        console.error("Admin POST Error:", error.message);
        return jsonResponse(env, { error: error.message }, { status: 500 });
    }
}

export async function onRequestOptions(context) {
    return emptyResponse(context.env, "GET, POST, PATCH, OPTIONS");
}
