import { NextRequest, NextResponse } from "next/server";
import { getApiKeyHeader } from "@/app/lib/serverAuth";

export async function GET(req: NextRequest) {
    const email = req.nextUrl.searchParams.get("email");
    if (!email) return NextResponse.json({ exists: false });

    try {
        const res = await fetch(
            `${process.env.API_BASE_URL}/auth/account-exists?email=${encodeURIComponent(email)}`,
            { headers: { ...getApiKeyHeader() }, cache: "no-store", signal: AbortSignal.timeout(6000) }
        );

        return NextResponse.json({ exists: res.status === 200 });
    } catch {
        return NextResponse.json({ exists: false });
    }
}
