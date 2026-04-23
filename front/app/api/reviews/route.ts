import { NextRequest, NextResponse } from "next/server";
import { getBearerHeader, getApiKeyHeader } from "@/app/lib/serverAuth";

export async function GET(req: NextRequest) {
    const params = req.nextUrl.searchParams.toString();
    const url = `${process.env.API_BASE_URL}/reviews${params ? `?${params}` : ""}`;
    try {
        const res = await fetch(url, {
            headers: { ...getApiKeyHeader() },
            cache: "no-store",
            signal: AbortSignal.timeout(8000),
        });
        const text = await res.text();
        return new NextResponse(text, {
            status: res.status,
            headers: { "Content-Type": "application/json" },
        });
    } catch (err) {
        console.error("[GET /api/reviews] error:", err);
        return NextResponse.json({ error: "Failed to fetch reviews" }, { status: 502 });
    }
}

export async function POST(req: NextRequest) {
    const authHeader = await getBearerHeader();
    const body = await req.json();
    const headers: HeadersInit = {
        "Content-Type": "application/json",
        ...getApiKeyHeader(),
        ...(authHeader ? { Authorization: authHeader } : {}),
    };
    try {
        const res = await fetch(`${process.env.API_BASE_URL}/reviews`, {
            method: "POST",
            headers,
            body: JSON.stringify(body),
            signal: AbortSignal.timeout(8000),
        });
        const text = await res.text();
        return new NextResponse(text, { status: res.status });
    } catch (err) {
        console.error("[POST /api/reviews] error:", err);
        return NextResponse.json({ error: "Failed to create review" }, { status: 502 });
    }
}
