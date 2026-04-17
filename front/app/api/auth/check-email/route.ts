import { NextRequest, NextResponse } from "next/server";
import { getApiKeyHeader } from "@/app/lib/serverAuth";

export async function GET(req: NextRequest) {
    const email = req.nextUrl.searchParams.get("email");
    if (!email) return NextResponse.json({ status: "none" });

    try {
        const res = await fetch(
            `${process.env.API_BASE_URL}/users?email=${encodeURIComponent(email)}`,
            { headers: { ...getApiKeyHeader() }, cache: "no-store", signal: AbortSignal.timeout(6000) }
        );

        if (!res.ok) return NextResponse.json({ status: "unknown" });

        const raw = await res.json();

        // Handle every response shape the backend might return
        const user =
            raw?.data?.[0] ??
            raw?.content?.[0] ??
            raw?.users?.[0] ??
            raw?.results?.[0] ??
            (Array.isArray(raw) ? raw[0] : null) ??
            ((raw?.userId ?? raw?.id) ? raw : null);

        if (!user || (!user.userId && !user.id)) {
            return NextResponse.json({ status: "none" });
        }

        const role: string = user.role ?? user.accountType ?? user.userRole ?? "";
        const isGuest = role.toUpperCase() === "GUEST" || user.isGuest === true;
        const userId = user.userId ?? user.id ?? null;

        return NextResponse.json({ status: isGuest ? "guest" : "password", userId });
    } catch {
        return NextResponse.json({ status: "unknown" });
    }
}
