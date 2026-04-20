import { NextRequest, NextResponse } from "next/server";
import { getBearerHeader, getApiKeyHeader } from "@/app/lib/serverAuth";

/**
 * Dedicated bookmarks endpoint.
 * GET  — returns the account with parseFullObjects so bookmarks come back as full car objects.
 * PATCH — replaces the bookmark list via PATCH on the backend, using the API key
 *          so that CUSTOMER-role accounts can update their own bookmarks.
 */

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const authHeader = await getBearerHeader();

    const url = `${process.env.API_BASE_URL}/accounts/${id}?parseFullObjects=true`;
    const headers: HeadersInit = { ...getApiKeyHeader(), ...(authHeader ? { Authorization: authHeader } : {}) };
    const res = await fetch(url, { headers, cache: "no-store" });
    if (!res.ok) {
        const text = await res.text();
        return new NextResponse(text, { status: res.status });
    }
    const data = await res.json();
    return NextResponse.json({ bookmarkedCars: data.bookmarkedCars ?? [] });
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const body = await req.json();
    const authHeader = await getBearerHeader();

    const headers: HeadersInit = {
        "Content-Type": "application/json",
        ...getApiKeyHeader(),
        ...(authHeader ? { Authorization: authHeader } : {}),
    };

    // Backend expects VINs as plain strings, not objects
    const vins: string[] = (body.bookmarkedCars ?? []).map((b: { vin: string } | string) =>
        typeof b === "string" ? b : b.vin
    );

    const res = await fetch(`${process.env.API_BASE_URL}/accounts/${id}`, {
        method: "PATCH",
        headers,
        body: JSON.stringify({ bookmarkedCars: vins }),
    });

    const responseText = await res.text();
    console.log(`[bookmarks] PATCH /accounts/${id} — status: ${res.status}, body: ${responseText}`);

    if (res.ok || res.status === 201 || res.status === 204) {
        return new NextResponse(null, { status: 204 });
    }
    return new NextResponse(responseText, { status: res.status });
}
