import { NextRequest, NextResponse } from "next/server";
import { getBearerHeader, getApiKeyHeader } from "@/app/lib/serverAuth";

export async function POST(req: NextRequest) {
    const { email, password, userId: providedId } = await req.json();
    if ((!email && !providedId) || !password) {
        return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }

    const base = process.env.API_BASE_URL;

    // Resolve userId — use provided ID or look up by email
    let userId: number | null = providedId ?? null;
    let role: string | null = null;

    if (!userId && email) {
        // Try with auth first, then without
        const authHeader = await getBearerHeader();
        const headers: HeadersInit = { ...getApiKeyHeader(), ...(authHeader ? { Authorization: authHeader } : {}) };

        try {
            const lookupRes = await fetch(
                `${base}/users?email=${encodeURIComponent(email)}`,
                { headers, cache: "no-store", signal: AbortSignal.timeout(6000) }
            );
            if (lookupRes.ok) {
                const raw = await lookupRes.json();
                const user =
                    raw?.data?.[0] ??
                    raw?.content?.[0] ??
                    raw?.users?.[0] ??
                    (Array.isArray(raw) ? raw[0] : null) ??
                    ((raw?.userId ?? raw?.id) ? raw : null);
                userId = user?.userId ?? user?.id ?? null;
                role = user?.role ?? user?.accountType ?? user?.userRole ?? null;
            }
        } catch {
            return NextResponse.json({ error: "Could not reach the server." }, { status: 503 });
        }
    }

    if (!userId) {
        return NextResponse.json({ error: "Could not find that account." }, { status: 422 });
    }

    // If we know the role and it's not GUEST, reject
    if (role && role !== "GUEST") {
        return NextResponse.json({ error: "full_account" }, { status: 409 });
    }

    // PATCH the account to add password and promote to CUSTOMER
    try {
        const patchRes = await fetch(`${base}/users/${userId}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json", ...getApiKeyHeader() },
            body: JSON.stringify({ password, role: "CUSTOMER" }),
            signal: AbortSignal.timeout(10000),
        });

        if (patchRes.ok) {
            return NextResponse.json({ ok: true });
        }

        const body = await patchRes.json().catch(() => ({}));
        // If PATCH fails because it's already a full account
        if (patchRes.status === 409 || patchRes.status === 403) {
            return NextResponse.json({ error: "full_account" }, { status: 409 });
        }
        return NextResponse.json({ error: body?.message ?? "Upgrade failed." }, { status: patchRes.status });
    } catch {
        return NextResponse.json({ error: "Could not reach the server." }, { status: 503 });
    }
}
