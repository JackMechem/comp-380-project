import { cookies } from "next/headers";

export function getApiKeyHeader(): Record<string, string> {
    const key = process.env.API_KEY;
    return key ? { "X-API-Key": key } : {};
}

export async function getBearerHeader(): Promise<string | undefined> {
    const store = await cookies();
    const token = store.get("user-session")?.value;
    return token ? `Bearer ${token}` : undefined;
}

export async function getSessionCookies(): Promise<{
    sessionToken: string | null;
    accountId: number | null;
    stripeUserId: number | null;
    role: string | null;
}> {
    const store = await cookies();
    const sessionToken = store.get("user-session")?.value ?? null;
    const accountIdRaw = store.get("account-id")?.value;
    const stripeUserIdRaw = store.get("stripe-user-id")?.value;
    const role = store.get("user-role")?.value ?? null;
    return {
        sessionToken,
        accountId: accountIdRaw ? Number(accountIdRaw) : null,
        stripeUserId: stripeUserIdRaw ? Number(stripeUserIdRaw) : null,
        role,
    };
}
