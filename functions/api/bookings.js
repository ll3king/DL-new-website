/**
 * Cloudflare Pages Function: /api/bookings
 * Handles reservation requests, email confirmation, and Sheets-backed CRM updates.
 */

import {
    appendBookingRow,
    appendGuestEvent,
    emptyResponse,
    ensureBookingSheets,
    evaluateBookingRequest,
    getBookingsForDate,
    jsonResponse,
    requireConfig,
    sendBookingEmail,
    updateEmailTracking,
    upsertGuest
} from "./_booking.js";

export async function onRequestPost(context) {
    const { request, env } = context;

    try {
        const body = await request.json();
        const booking = {
            name: body.name,
            email: body.email,
            mobile: body.mobile || "",
            group_size: body.group_size || "1",
            date: body.date,
            time: body.time
        };

        if (!booking.name || !booking.email || !booking.date || !booking.time) {
            return jsonResponse(env, { error: "Missing required fields: name, email, date, time" }, { status: 400 });
        }

        const config = await requireConfig(env);
        await ensureBookingSheets(config);

        const existingBookings = await getBookingsForDate(config, booking.date);
        const outcome = evaluateBookingRequest({ booking, existingBookings });
        const bookingStatus = outcome.booking_status;
        const emailType = outcome.email_type;
        const { rowNumber } = await appendBookingRow(config, booking, bookingStatus);

        if (!rowNumber) {
            throw new Error("Failed to resolve appended Sheet1 row number");
        }

        let emailTracking = {
            email_sent_at: "",
            email_type: emailType,
            email_status: "failed",
            email_error: "Unknown error"
        };

        try {
            emailTracking = await sendBookingEmail(env, booking, emailType);
        } catch (error) {
            console.error("Booking email send failed:", error.message);
            emailTracking = {
                email_sent_at: "",
                email_type: emailType,
                email_status: "failed",
                email_error: error.message
            };
        }

        await updateEmailTracking(config, rowNumber, emailTracking);
        await upsertGuest(config, booking, bookingStatus);
        await appendGuestEvent(config, "booking_created", booking, rowNumber, bookingStatus);

        return jsonResponse(env, {
            status: "success",
            message: "Booking received",
            booking_status: bookingStatus,
            reply_key: outcome.reply_key,
            email_status: emailTracking.email_status,
            email_type: emailTracking.email_type
        });
    } catch (error) {
        console.error("Booking Error:", error.message, error.stack);
        return jsonResponse(env, { error: error.message }, { status: 500 });
    }
}

export async function onRequestOptions(context) {
    return emptyResponse(context.env, "POST, OPTIONS");
}
