import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { pathToFileURL } from "node:url";

const workspaceRoot = "C:\\Users\\61413\\Desktop\\ai jobs\\DL new website";
const chatSourcePath = path.join(workspaceRoot, "functions", "api", "chat.js");

async function loadChatTestModule() {
    const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "chat-router-"));
    const chatTestPath = path.join(tempDir, "chat.test.mjs");
    const bookingStubPath = path.join(tempDir, "_booking-stub.mjs");

    const originalSource = await fs.readFile(chatSourcePath, "utf8");
    const patchedSource = originalSource
        .replace('from "./_booking.js";', 'from "./_booking-stub.mjs";')
        .concat("\nexport { determineConversationMode, pickLookupMatch, selectLookupPromptField };\n");

    const bookingStubSource = `
export async function appendBookingRow() { throw new Error("appendBookingRow stub not implemented"); }
export async function appendGuestEvent() { return null; }
export function emptyResponse() { return new Response(null); }
export async function ensureBookingSheets() { return null; }
export async function fetchGuestCoreInfo() { return null; }
export function jsonResponse(_env, payload, init = {}) { return { payload, status: init.status || 200 }; }
export async function listBookings() { return []; }
export function normalizePhone(phone) { return String(phone || "").trim(); }
export async function requireConfig() { return {}; }
export async function sendBookingEmail() { return { email_status: "sent", email_type: "cancelled", email_error: "", email_sent_at: "" }; }
export async function updateEmailTracking() { return null; }
export async function updateBookingStatus() { return null; }
export async function upsertGuest() { return null; }
`;

    await fs.writeFile(bookingStubPath, bookingStubSource, "utf8");
    await fs.writeFile(chatTestPath, patchedSource, "utf8");

    return import(`${pathToFileURL(chatTestPath).href}?t=${Date.now()}`);
}

test("routes booking confirmation requests to lookup mode", async () => {
    const mod = await loadChatTestModule();

    const mode = mod.determineConversationMode({
        channel: "sms",
        messageText: "I'd like to confirm my booking on Saturday morning for 7 people under Emily.",
        history: [],
        threadContext: {},
        previousBookingContext: { intent: "", mode: "", known_fields: {}, outcome: "" },
        bookingState: {
            known_fields: {
                name: "Emily",
                mobile: "+61400000000",
                group_size: "7",
                date: "2026-05-23",
                time: ""
            }
        },
        llmExtraction: { mode: "lookup", intent: "booking", confidence: "high" }
    });

    assert.equal(mode, "lookup");
});

test("routes cancellation requests to cancel mode", async () => {
    const mod = await loadChatTestModule();

    const mode = mod.determineConversationMode({
        channel: "sms",
        messageText: "I won't be able to make this booking now so would like to cancel.",
        history: [],
        threadContext: {},
        previousBookingContext: { intent: "", mode: "", known_fields: {}, outcome: "" },
        bookingState: {
            known_fields: {
                name: "",
                mobile: "+61413160784",
                group_size: "",
                date: "",
                time: ""
            }
        },
        llmExtraction: { mode: "cancel", intent: "booking", confidence: "high" }
    });

    assert.equal(mode, "cancel");
});

test("lookup matching prefers a strong mobile-plus-date booking match", async () => {
    const mod = await loadChatTestModule();

    const match = mod.pickLookupMatch(
        [
            { id: "12", name: "Emily", mobile: "+61400000000", date: "2026-05-23", time: "10:30", group_size: "7", status: "Confirmed" },
            { id: "13", name: "Emily", mobile: "+61499999999", date: "2026-05-23", time: "11:00", group_size: "7", status: "Confirmed" }
        ],
        {
            name: "Emily",
            mobile: "+61400000000",
            group_size: "7",
            date: "2026-05-23",
            time: ""
        }
    );

    assert.equal(match.type, "match");
    assert.equal(match.booking?.id, "12");
});

test("cancel follow-up asks for the booking date instead of dropping into create prompts", async () => {
    const mod = await loadChatTestModule();

    const field = mod.selectLookupPromptField({
        name: "",
        mobile: "+61413160784",
        group_size: "",
        date: "",
        time: ""
    }, "cancel");

    assert.equal(field, "date");
});
