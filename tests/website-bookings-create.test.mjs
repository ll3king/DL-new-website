import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { pathToFileURL } from "node:url";

const workspaceRoot = "C:\\Users\\61413\\Desktop\\ai jobs\\DL new website";
const sourcePath = path.join(workspaceRoot, "functions", "api", "bookings.js");

async function loadBookingsModule() {
    const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "website-bookings-"));
    const modulePath = path.join(tempDir, "bookings.test.mjs");
    const stubPath = path.join(tempDir, "_booking-stub.mjs");

    const originalSource = await fs.readFile(sourcePath, "utf8");
    const patchedSource = originalSource.replace('from "./_booking.js";', 'from "./_booking-stub.mjs";');

    const stubSource = `
const state = globalThis.__websiteBookingTestState || {};
export async function appendBookingRow() {
    state.appendBookingRowCalls = (state.appendBookingRowCalls || 0) + 1;
    return { rowNumber: 73 };
}
export async function appendBookingRowWithCleanup(context, config, booking, status, options) {
    const result = await appendBookingRow(config, booking, status, options);
    scheduleBookingDedupeCleanup(context, config, result.rowNumber);
    return result;
}
export async function appendGuestEvent() {
    state.appendGuestEventCalls = (state.appendGuestEventCalls || 0) + 1;
    return null;
}
export function emptyResponse() { return new Response(null); }
export async function ensureBookingSheets() { return null; }
export function evaluateBookingRequest() {
    return { booking_status: "Confirmed", email_type: "confirmed", reply_key: "confirmed" };
}
export async function getBookingsForDate() { return []; }
export function jsonResponse(_env, payload, init = {}) {
    return new Response(JSON.stringify(payload), {
        status: init.status || 200,
        headers: { "Content-Type": "application/json" }
    });
}
export async function requireConfig() { return {}; }
export function scheduleBookingDedupeCleanup(context, _config, rowNumber) {
    state.scheduleCleanupCalls = (state.scheduleCleanupCalls || 0) + 1;
    state.scheduledCleanupRow = String(rowNumber);
    if (context && typeof context.waitUntil === "function") {
        context.waitUntil(Promise.resolve({ deleted: false }));
    }
}
export async function sendBookingEmail() {
    return { email_sent_at: "", email_type: "confirmed", email_status: "sent", email_error: "" };
}
export async function updateEmailTracking() { return null; }
export async function upsertGuest() {
    state.upsertGuestCalls = (state.upsertGuestCalls || 0) + 1;
    return null;
}
`;

    await fs.writeFile(stubPath, stubSource, "utf8");
    await fs.writeFile(modulePath, patchedSource, "utf8");

    return import(`${pathToFileURL(modulePath).href}?t=${Date.now()}`);
}

test("website booking create schedules cleanup after append succeeds", async () => {
    globalThis.__websiteBookingTestState = {};
    let waitUntilCalls = 0;

    const mod = await loadBookingsModule();
    const response = await mod.onRequestPost({
        request: new Request("https://example.com/api/bookings", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                name: "Link",
                email: "link@example.com",
                mobile: "0413160784",
                group_size: "2",
                date: "2026-05-23",
                time: "10:30"
            })
        }),
        env: {},
        waitUntil(promise) {
            waitUntilCalls += 1;
            return promise;
        }
    });

    const payload = await response.json();
    assert.equal(response.status, 200);
    assert.equal(payload.status, "success");
    assert.equal(globalThis.__websiteBookingTestState.appendBookingRowCalls || 0, 1);
    assert.equal(globalThis.__websiteBookingTestState.upsertGuestCalls || 0, 1);
    assert.equal(globalThis.__websiteBookingTestState.appendGuestEventCalls || 0, 1);
    assert.equal(globalThis.__websiteBookingTestState.scheduleCleanupCalls || 0, 1);
    assert.equal(globalThis.__websiteBookingTestState.scheduledCleanupRow, "73");
    assert.equal(waitUntilCalls, 1);

    delete globalThis.__websiteBookingTestState;
});
