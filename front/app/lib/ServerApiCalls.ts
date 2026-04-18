/**
 * Server-only fetch helpers. All calls include the API key and, where
 * applicable, the session Bearer token. Import only from server components
 * or API routes — never from client components.
 */

import { getApiKeyHeader } from "./serverAuth";

const base = () => process.env.API_BASE_URL;

function buildHeaders(sessionToken?: string | null): Record<string, string> {
    return {
        "Content-Type": "application/json",
        ...getApiKeyHeader(),
        ...(sessionToken ? { Authorization: `Bearer ${sessionToken}` } : {}),
    };
}

export async function fetchAccount(
    acctId: number,
    sessionToken: string,
    options?: { parseFullObjects?: boolean },
): Promise<Record<string, unknown> | null> {
    const params = new URLSearchParams();
    if (options?.parseFullObjects) params.set("parseFullObjects", "true");
    const qs = params.toString();
    const url = `${base()}/accounts/${acctId}${qs ? `?${qs}` : ""}`;
    console.log("[fetchAccount] GET", url);

    try {
        const res = await fetch(url, {
            headers: buildHeaders(sessionToken),
            cache: "no-store",
        });
        console.log("[fetchAccount] status", res.status);
        if (!res.ok) {
            const text = await res.text();
            console.log("[fetchAccount] error body", text);
            return null;
        }
        const data = await res.json();
        console.log("[fetchAccount] response", JSON.stringify(data, null, 2));
        return data;
    } catch (err) {
        console.log("[fetchAccount] exception", err);
        return null;
    }
}

export async function fetchUser(
    userId: number,
    sessionToken: string,
): Promise<Record<string, unknown> | null> {
    try {
        const res = await fetch(`${base()}/users/${userId}`, {
            headers: buildHeaders(sessionToken),
            cache: "no-store",
            signal: AbortSignal.timeout(5000),
        });
        return res.ok ? await res.json() : null;
    } catch {
        return null;
    }
}

export async function fetchReservations(
    sessionToken: string,
    options?: { pageSize?: number; parseFullObjects?: boolean; userId?: number },
): Promise<unknown[]> {
    const params = new URLSearchParams();
    params.set("pageSize", String(options?.pageSize ?? 500));
    if (options?.parseFullObjects) params.set("parseFullObjects", "true");
    if (options?.userId != null) params.set("userId", String(options.userId));

    const url = `${base()}/reservations?${params}`;
    const headers = buildHeaders(sessionToken);
    console.log("[fetchReservations] GET", url);
    console.log("[fetchReservations] headers", JSON.stringify(headers));

    try {
        const res = await fetch(url, {
            headers,
            cache: "no-store",
            signal: AbortSignal.timeout(10000),
        });
        console.log("[fetchReservations] status", res.status);
        if (!res.ok) {
            const text = await res.text();
            console.log("[fetchReservations] error body", text);
            return [];
        }
        const data = await res.json();
        console.log("[fetchReservations] response", JSON.stringify(data, null, 2));
        return Array.isArray(data) ? data : (data.data ?? []);
    } catch (err) {
        console.log("[fetchReservations] exception", err);
        return [];
    }
}

export async function fetchCarByVin(
    vin: string,
    sessionToken?: string | null,
): Promise<Record<string, unknown> | null> {
    const url = `${base()}/cars/${vin}`;
    try {
        const res = await fetch(url, {
            headers: buildHeaders(sessionToken),
            cache: "no-store",
            signal: AbortSignal.timeout(5000),
        });
        return res.ok ? await res.json() : null;
    } catch {
        return null;
    }
}

export async function fetchCars(
    sessionToken: string,
    options?: { pageSize?: number },
): Promise<unknown[]> {
    const params = new URLSearchParams();
    params.set("pageSize", String(options?.pageSize ?? 500));

    try {
        const res = await fetch(`${base()}/cars?${params}`, {
            headers: buildHeaders(sessionToken),
            cache: "no-store",
            signal: AbortSignal.timeout(8000),
        });
        if (!res.ok) return [];
        const data = await res.json();
        return Array.isArray(data) ? data : (data.data ?? []);
    } catch {
        return [];
    }
}
