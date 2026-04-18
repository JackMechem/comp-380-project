import { NextResponse } from "next/server";
import { getApiKeyHeader } from "@/app/lib/serverAuth";

export async function GET() {
    const res = await fetch(`${process.env.API_BASE_URL}/enums`, { headers: { ...getApiKeyHeader() }, cache: "no-store" });
    return NextResponse.json(await res.json(), { status: res.status });
}
