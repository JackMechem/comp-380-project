import { NextRequest, NextResponse } from "next/server";
import { getApiKeyHeader } from "@/app/lib/serverAuth";

export async function POST(req: NextRequest) {
    const body = await req.json();

    try {
        const res = await fetch(`${process.env.API_BASE_URL}/auth/send-link`, {
            method: "POST",
            headers: { "Content-Type": "application/json", ...getApiKeyHeader() },
            body: JSON.stringify(body),
            cache: "no-store",
            signal: AbortSignal.timeout(10000),
        });

        try {
            return NextResponse.json(await res.json(), { status: res.status });
        } catch {
            return new NextResponse(null, { status: res.status });
        }
    } catch {
        return NextResponse.json({ error: "Login service unavailable." }, { status: 503 });
    }
}
