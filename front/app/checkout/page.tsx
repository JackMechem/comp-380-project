import { getSessionCookies } from "@/app/lib/serverAuth";
import { fetchUser } from "@/app/lib/ServerApiCalls";
import CheckoutClient from "./CheckoutClient";

export default async function CheckoutPage() {
    const { sessionToken, stripeUserId } = await getSessionCookies();

    let initialUser: Record<string, unknown> | null = null;
    if (sessionToken && stripeUserId) {
        initialUser = await fetchUser(stripeUserId, sessionToken);
    }

    return (
        <CheckoutClient
            isAuthenticated={!!sessionToken}
            initialUser={initialUser}
        />
    );
}
