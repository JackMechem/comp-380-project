import { NextRequest, NextResponse } from "next/server";
import { getApiKeyHeader } from "@/app/lib/serverAuth";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ token: string }> }) {
    const { token } = await params;

    const res = await fetch(`${process.env.API_BASE_URL}/auth/verify/${token}`, {
        headers: { ...getApiKeyHeader() },
        cache: "no-store",
    });

    if (!res.ok) {
        return NextResponse.json({ error: "Invalid or expired token." }, { status: 404 });
    }

    return NextResponse.json(await res.json(), { status: 200 });
}
