import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { pathToFileURL } from "node:url";

const workspaceRoot = "C:\\Users\\61413\\Desktop\\ai jobs\\DL new website";
const sourcePath = path.join(workspaceRoot, "functions", "api", "admin", "bookings.js");

async function loadAdminBookingsModule() {
    const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "admin-bookings-"));
    const modulePath = path.join(tempDir, "bookings.test.mjs");
    const stubPath = path.join(tempDir, "_booking-stub.mjs");

    const originalSource = await fs.readFile(sourcePath, "utf8");
    const patchedSource = originalSource.replace('from "../_booking.js";', 'from "./_booking-stub.mjs";');

const stubSource = `
const state = globalThis.__adminBookingTestState || {};
export async function appendGuestEvent(...args) {
    state.appendGuestEventCalls = (state.appendGuestEventCalls || 0) + 1;
    return null;
}
export async function appendBookingRow(...args) {
    state.appendBookingRowCalls = (state.appendBookingRowCalls || 0) + 1;
    return { rowNumber: 42 };
}
export async function appendBookingRowWithCleanup(context, config, booking, status, options) {
    const result = await appendBookingRow(config, booking, status, options);
    scheduleBookingDedupeCleanup(context, config, result.rowNumber);
    return result;
}
export function emptyResponse() { return new Response(null); }
export async function ensureBookingSheets() { state.ensureCalls = (state.ensureCalls || 0) + 1; return null; }
export async function fetchBookingRow() { throw new Error("fetchBookingRow should not be called in admin create success"); }
export function jsonResponse(_env, payload, init = {}) {
    return new Response(JSON.stringify(payload), {
        status: init.status || 200,
        headers: { "Content-Type": "application/json" }
    });
}
export async function listBookings() { return []; }
export async function requireConfig() { return {}; }
export function scheduleBookingDedupeCleanup(context, _config, rowNumber) {
    state.scheduleCleanupCalls = (state.scheduleCleanupCalls || 0) + 1;
    state.scheduledCleanupRow = String(rowNumber);
    if (context && typeof context.waitUntil === "function") {
        context.waitUntil(Promise.resolve({ deleted: false }));
    }
}
export async function sendBookingEmail() { return null; }
export async function updateBookingRow() { return null; }
export async function updateBookingStatus() { return null; }
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

function buildRequest(body) {
    return new Request("https://example.com/api/admin/bookings", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer secret"
        },
        body: JSON.stringify(body)
    });
}

test("admin create returns created booking without re-fetching the row and schedules cleanup", async () => {
    globalThis.__adminBookingTestState = {};
    let waitUntilCalls = 0;

    const mod = await loadAdminBookingsModule();
    const response = await mod.onRequestPost({
        request: buildRequest({
            name: "Link",
            email: "link@example.com",
            mobile: "0413160784",
            group_size: "2",
            date: "2026-05-23",
            time: "10:30"
        }),
        env: { ADMIN_PASSWORD: "secret" },
        waitUntil(promise) {
            waitUntilCalls += 1;
            return promise;
        }
    });

    const payload = await response.json();
    assert.equal(response.status, 201);
    assert.equal(payload.booking.id, "42");
    assert.equal(payload.booking.name, "Link");
    assert.equal(payload.booking.mobile, "0413160784");
    assert.equal(payload.booking.status, "Confirmed");
    assert.equal(globalThis.__adminBookingTestState.appendBookingRowCalls || 0, 1);
    assert.equal(globalThis.__adminBookingTestState.upsertGuestCalls || 0, 1);
    assert.equal(globalThis.__adminBookingTestState.appendGuestEventCalls || 0, 1);
    assert.equal(globalThis.__adminBookingTestState.scheduleCleanupCalls || 0, 1);
    assert.equal(globalThis.__adminBookingTestState.scheduledCleanupRow, "42");
    assert.equal(waitUntilCalls, 1);

    delete globalThis.__adminBookingTestState;
});
