import { NextRequest, NextResponse } from "next/server";
import { getBearerHeader, getApiKeyHeader } from "@/app/lib/serverAuth";

export async function GET(req: NextRequest) {
    const authHeader = await getBearerHeader();
    const qs = req.nextUrl.searchParams.toString();

    const headers: HeadersInit = { ...getApiKeyHeader(), ...(authHeader ? { Authorization: authHeader } : {}) };
    const res = await fetch(`${process.env.API_BASE_URL}/cars?${qs}`, {
        headers,
        cache: "no-store",
    });
    return NextResponse.json(await res.json(), { status: res.status });
}

export async function POST(req: NextRequest) {
    const authHeader = await getBearerHeader();
    const body = await req.json();

    const headers: HeadersInit = { "Content-Type": "application/json", ...getApiKeyHeader() };
    if (authHeader) headers["Authorization"] = authHeader;

    const res = await fetch(`${process.env.API_BASE_URL}/cars`, {
        method: "POST",
        headers,
        body: JSON.stringify(body),
    });
    const text = await res.text();
    return new NextResponse(text, { status: res.status });
}
