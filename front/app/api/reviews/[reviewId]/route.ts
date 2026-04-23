import { NextRequest, NextResponse } from "next/server";
import { getBearerHeader, getApiKeyHeader } from "@/app/lib/serverAuth";

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ reviewId: string }> }) {
    const { reviewId } = await params;
    const authHeader = await getBearerHeader();
    const headers: HeadersInit = {
        ...getApiKeyHeader(),
        ...(authHeader ? { Authorization: authHeader } : {}),
    };
    try {
        const res = await fetch(`${process.env.API_BASE_URL}/reviews/${reviewId}`, {
            method: "DELETE",
            headers,
            signal: AbortSignal.timeout(8000),
        });
        return new NextResponse(null, { status: res.status });
    } catch (err) {
        console.error(`[DELETE /api/reviews/${reviewId}] error:`, err);
        return NextResponse.json({ error: "Failed to delete review", message: err }, { status: 502 });
    }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ reviewId: string }> }) {
    const { reviewId } = await params;
    const authHeader = await getBearerHeader();
    const body = await req.json();
    const headers: HeadersInit = {
        "Content-Type": "application/json",
        ...getApiKeyHeader(),
        ...(authHeader ? { Authorization: authHeader } : {}),
    };
    try {
        const res = await fetch(`${process.env.API_BASE_URL}/reviews/${reviewId}`, {
            method: "PATCH",
            headers,
            body: JSON.stringify(body),
            signal: AbortSignal.timeout(8000),
        });
        const text = await res.text();
        return new NextResponse(text, { status: res.status });
    } catch (err) {
        console.error(`[PATCH /api/reviews/${reviewId}] error:`, err);
        return NextResponse.json({ error: "Failed to update review" }, { status: 502 });
    }
}
