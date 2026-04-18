import { NextRequest, NextResponse } from "next/server";
import { getBearerHeader, getApiKeyHeader } from "@/app/lib/serverAuth";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const authHeader = await getBearerHeader();
    const body = await req.json();

    const headers: HeadersInit = { "Content-Type": "application/json", ...getApiKeyHeader() };
    if (authHeader) headers["Authorization"] = authHeader;

    const res = await fetch(`${process.env.API_BASE_URL}/reservations/${id}`, {
        method: "PATCH",
        headers,
        body: JSON.stringify(body),
    });

    try {
        return NextResponse.json(await res.json());
    } catch {
        return NextResponse.json(null);
    }
}
