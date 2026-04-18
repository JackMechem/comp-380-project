import { NextRequest, NextResponse } from "next/server";
import { getApiKeyHeader } from "@/app/lib/serverAuth";

export async function POST(req: NextRequest) {
    const body = await req.json();

    const res = await fetch(`${process.env.API_BASE_URL}/auth/send-link`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...getApiKeyHeader() },
        body: JSON.stringify(body),
        cache: "no-store",
    });

    try {
        return NextResponse.json(await res.json(), { status: res.status });
    } catch {
        return NextResponse.json({ message: "If that email has a confirmed account, a login link has been sent." }, { status: 200 });
    }
}
