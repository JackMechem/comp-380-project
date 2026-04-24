"use strict";
/**
 * Browser-side FCR API client.
 * All requests go through the Next.js /api/ proxy routes — no backend URLs or
 * API keys are needed here. Safe to import from any client component.
 *
 * Usage:
 *   import { browserApi } from 'fcr-client';
 *   const cars = await browserApi.cars.getFiltered({ pageSize: 20 });
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.browserApi = void 0;
const core_1 = require("./core");
// ── Helpers ───────────────────────────────────────────────────────────────────
async function apiThrow(res) {
    const text = await res.text().catch(() => res.statusText);
    throw new Error(text);
}
async function expectOk(res) {
    if (!res.ok)
        await apiThrow(res);
}
// ── Domain: cars ──────────────────────────────────────────────────────────────
const cars = {
    /** Search suggestions for nav autocomplete. */
    async suggest(searchText, pageSize = 6) {
        if (!searchText.trim())
            return [];
        const qs = (0, core_1.buildQuery)({ search: searchText, select: "vin,make,model", pageSize });
        try {
            const res = await fetch(`/api/cars?${qs}`);
            if (!res.ok)
                return [];
            const data = await res.json();
            return data.data ?? [];
        }
        catch {
            return [];
        }
    },
    /** Paginated + filtered car list. */
    async getFiltered(params) {
        const qs = (0, core_1.buildQuery)(params);
        const res = await fetch(`/api/cars?${qs}`, { cache: "no-store" });
        return (0, core_1.parseResponse)(res);
    },
    /** Paginated car list with only page + pageSize. */
    async getAll(opts = {}) {
        const qs = (0, core_1.buildQuery)({ page: opts.page, pageSize: opts.pageSize });
        const res = await fetch(`/api/cars${qs ? `?${qs}` : ""}`, { cache: "no-store" });
        return (0, core_1.parseResponse)(res);
    },
    /** Single car by VIN. */
    async getById(vin) {
        const res = await fetch(`/api/cars/${vin}`, { cache: "no-store" });
        return (0, core_1.parseResponse)(res);
    },
    /** Create a new car. */
    async add(car) {
        const res = await fetch("/api/cars", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(car),
        });
        if (!res.ok)
            await apiThrow(res);
        return res.text();
    },
    /** Update car fields. */
    async update(car) {
        const res = await fetch(`/api/cars/${car.vin}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(car),
        });
        if (!res.ok)
            await apiThrow(res);
        return res.text();
    },
    /** Update only the car's status. */
    async updateStatus(vin, carStatus) {
        const res = await fetch(`/api/cars/${vin}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ carStatus }),
        });
        if (!res.ok)
            await apiThrow(res);
        return res.text();
    },
    /** Delete a car. */
    async delete(vin) {
        const res = await fetch(`/api/cars/${vin}`, { method: "DELETE" });
        if (!res.ok)
            await apiThrow(res);
        return res.text();
    },
};
// ── Domain: accounts ──────────────────────────────────────────────────────────
const accounts = {
    /** Paginated account list with optional search + sort. */
    async getAll(opts = {}) {
        const qs = (0, core_1.buildQuery)({
            page: opts.page,
            pageSize: opts.pageSize,
            search: opts.search,
            sortBy: opts.sortBy ?? undefined,
            sortDir: opts.sortDir,
        });
        const res = await fetch(`/api/accounts${qs ? `?${qs}` : ""}`, { cache: "no-store" });
        return (0, core_1.parseResponse)(res);
    },
    /** Single account by ID, with optional full-object hydration. */
    async getById(acctId, opts) {
        const qs = (0, core_1.buildQuery)(opts?.parseFullObjects ? { parseFullObjects: "true" } : {});
        const res = await fetch(`/api/accounts/${acctId}${qs ? `?${qs}` : ""}`, {
            cache: "no-store",
        });
        return (0, core_1.parseResponse)(res);
    },
    /** Update account fields. */
    async update(acctId, patch) {
        const res = await fetch(`/api/accounts/${acctId}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(patch),
        });
        await expectOk(res);
    },
    /** Delete an account. */
    async delete(acctId) {
        const res = await fetch(`/api/accounts/${acctId}`, { method: "DELETE" });
        await expectOk(res);
    },
};
// ── Domain: users ─────────────────────────────────────────────────────────────
const users = {
    /** Paginated user list. */
    async getAll(opts = {}) {
        const qs = (0, core_1.buildQuery)({
            page: opts.page,
            pageSize: opts.pageSize,
            sortBy: opts.sortBy ?? undefined,
            sortDir: opts.sortDir,
        });
        const res = await fetch(`/api/users${qs ? `?${qs}` : ""}`, { cache: "no-store" });
        return (0, core_1.parseResponse)(res);
    },
    async getById(userId) {
        try {
            const res = await fetch(`/api/users/${userId}`);
            return res.ok ? res.json() : null;
        }
        catch {
            return null;
        }
    },
    async update(userId, patch) {
        try {
            const res = await fetch(`/api/users/${userId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(patch),
            });
            return res.ok ? res.json() : null;
        }
        catch {
            return null;
        }
    },
    async delete(userId) {
        const res = await fetch(`/api/users/${userId}`, { method: "DELETE" });
        await expectOk(res);
    },
};
// ── Domain: reservations ──────────────────────────────────────────────────────
const reservations = {
    /** Paginated reservation list (admin). */
    async getAll(opts = {}) {
        const qs = (0, core_1.buildQuery)({
            page: opts.page,
            pageSize: opts.pageSize,
            sortBy: opts.sortBy ?? undefined,
            sortDir: opts.sortDir,
        });
        const res = await fetch(`/api/reservations${qs ? `?${qs}` : ""}`, {
            cache: "no-store",
        });
        if (!res.ok) {
            const body = await res.text();
            throw new Error(`Failed to fetch reservations (${res.status}): ${body}`);
        }
        return res.json();
    },
    /** User's existing reservations (for date-range conflict detection). */
    async listForUser(userId) {
        try {
            const res = await fetch(`/api/reservations?userId=${encodeURIComponent(userId)}`);
            if (!res.ok)
                return [];
            const data = await res.json();
            return Array.isArray(data) ? data : [];
        }
        catch {
            return [];
        }
    },
    /** Update a reservation. */
    async update(reservationId, patch) {
        const res = await fetch(`/api/reservations/${reservationId}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(patch),
        });
        return (0, core_1.parseResponse)(res);
    },
    /** Delete a reservation. */
    async delete(reservationId) {
        const res = await fetch(`/api/reservations/${reservationId}`, {
            method: "DELETE",
        });
        if (!res.ok) {
            const body = await res.text();
            throw new Error(`Delete failed (${res.status}): ${body}`);
        }
    },
};
// ── Domain: reviews ───────────────────────────────────────────────────────────
const reviews = {
    /** Paginated review list (admin). */
    async getAll(opts = {}) {
        const qs = (0, core_1.buildQuery)({ page: opts.page, pageSize: opts.pageSize });
        const res = await fetch(`/api/reviews${qs ? `?${qs}` : ""}`, { cache: "no-store" });
        return (0, core_1.parseResponse)(res);
    },
    /** Reviews for a specific account. */
    async getForAccount(acctId, opts) {
        const qs = (0, core_1.buildQuery)({
            account: acctId,
            "objects-per-page": opts?.objectsPerPage ?? 500,
        });
        try {
            const res = await fetch(`/api/reviews?${qs}`);
            if (!res.ok)
                return [];
            const data = await res.json();
            return data?.data ?? [];
        }
        catch {
            return [];
        }
    },
    /** Delete a review. */
    async delete(reviewId) {
        const res = await fetch(`/api/reviews/${reviewId}`, { method: "DELETE" });
        await expectOk(res);
    },
};
// ── Domain: bookmarks ─────────────────────────────────────────────────────────
const bookmarks = {
    /** Get bookmarked cars for an account. */
    async get(accountId) {
        const res = await fetch(`/api/accounts/${accountId}/bookmarks`);
        return (0, core_1.parseResponse)(res);
    },
    /** Save a new VIN list to the account's bookmarks. */
    async update(accountId, vins) {
        const res = await fetch(`/api/accounts/${accountId}/bookmarks`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ bookmarkedCars: vins }),
        });
        await expectOk(res);
    },
};
// ── Domain: auth ──────────────────────────────────────────────────────────────
const auth = {
    /** Validate basic credentials. Returns the HTTP status code. */
    async validateCredentials(username, password) {
        const res = await fetch("/api/auth/validate", {
            headers: { Authorization: `Basic ${btoa(`${username}:${password}`)}` },
        });
        return res.status;
    },
    /** Send a magic login link to an email address. */
    async sendMagicLink(email) {
        await fetch("/api/auth/magic-link", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email }),
        });
    },
    /** Register a new account + user. */
    async register(data) {
        return fetch("/api/auth/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
            signal: AbortSignal.timeout(10000),
        });
    },
    /** Check whether a full account exists for the given email. */
    async checkAccount(email) {
        const res = await fetch(`/api/auth/check-account?email=${encodeURIComponent(email)}`, { cache: "no-store" });
        return res.ok ? res.json() : { exists: false };
    },
    /** Look up a user record by email (guest checkout). */
    async userLookup(email) {
        const res = await fetch(`/api/user-lookup?email=${encodeURIComponent(email)}`, { cache: "no-store" });
        if (!res.ok)
            return null;
        const raw = await res.json();
        return (raw?.data?.[0] ??
            raw?.content?.[0] ??
            raw?.users?.[0] ??
            (Array.isArray(raw) ? raw[0] : null) ??
            ((raw?.userId ?? raw?.id) ? raw : null) ??
            null);
    },
};
// ── Domain: payment ───────────────────────────────────────────────────────────
const payment = {
    /** Create a Stripe payment intent for the current cart. */
    async createIntent(data) {
        const res = await fetch("/api/payment-intent", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });
        return (0, core_1.parseResponse)(res);
    },
};
// ── Export ────────────────────────────────────────────────────────────────────
exports.browserApi = {
    cars,
    accounts,
    users,
    reservations,
    reviews,
    bookmarks,
    auth,
    payment,
};
