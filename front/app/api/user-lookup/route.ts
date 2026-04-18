import { NextRequest, NextResponse } from "next/server";
import { getBearerHeader, getApiKeyHeader } from "@/app/lib/serverAuth";

export async function GET(req: NextRequest) {
    const email = req.nextUrl.searchParams.get("email");
    if (!email) return NextResponse.json(null);

    const authHeader = await getBearerHeader();
    const headers: HeadersInit = { ...getApiKeyHeader(), ...(authHeader ? { Authorization: authHeader } : {}) };

    try {
        const res = await fetch(
            `${process.env.API_BASE_URL}/users?email=${encodeURIComponent(email)}`,
            { headers, cache: "no-store", signal: AbortSignal.timeout(8000) }
        );
        return NextResponse.json(await res.json());
    } catch {
        return NextResponse.json(null);
    }
}
