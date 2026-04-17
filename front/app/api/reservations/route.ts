import { NextRequest, NextResponse } from "next/server";
import { getBearerHeader, getApiKeyHeader } from "@/app/lib/serverAuth";

export async function GET(req: NextRequest) {
    const userId = req.nextUrl.searchParams.get("userId");
    const authHeader = await getBearerHeader();

    const headers: HeadersInit = { ...getApiKeyHeader(), ...(authHeader ? { Authorization: authHeader } : {}) };
    const res = await fetch(
        `${process.env.API_BASE_URL}/reservations?pageSize=500&parseFullObjects=true`,
        { headers, cache: "no-store", signal: AbortSignal.timeout(10000) }
    );

    const result = await res.json();
    const all: Record<string, unknown>[] = Array.isArray(result) ? result : (result.data ?? []);

    if (userId) {
        const uid = Number(userId);
        const filtered = all.filter((r) => {
            const u = r.user;
            return typeof u === "object" && u !== null
                ? (u as Record<string, unknown>).userId === uid
                : u === uid;
        });
        return NextResponse.json(filtered);
    }

    // Admin: return full paginated shape
    return NextResponse.json(result);
}
