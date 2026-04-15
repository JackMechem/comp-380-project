import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(req: NextRequest) {
    const cookieStore = await cookies();
    const raw = cookieStore.get("credentials")?.value;
    const { username, password } = raw
        ? JSON.parse(raw)
        : { username: "jim", password: "intentionallyInsecurePassword#3" };
    const authHeader = `Basic ${Buffer.from(`${username}:${password}`).toString("base64")}`;

    const userId = req.nextUrl.searchParams.get("userId");

    const res = await fetch(
        `${process.env.API_BASE_URL}/reservations?pageSize=500&parseFullObjects=true`,
        { headers: { "Authorization": authHeader }, cache: "no-store" }
    );

    const result = await res.json();
    const all: Record<string, unknown>[] = Array.isArray(result) ? result : (result.data ?? []);

    if (userId) {
        const uid = Number(userId);
        const filtered = all.filter((r) => {
            const u = r.user;
            return typeof u === "object" && u !== null
                ? (u as Record<string, unknown>).userId === uid
                : u === uid;
        });
        return NextResponse.json(filtered);
    }

    // Admin: return full paginated shape
    return NextResponse.json(result);
}
