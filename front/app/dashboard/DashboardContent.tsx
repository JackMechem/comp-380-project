import DashboardShell from "./DashboardShell";
import { DashboardReservation } from "@/stores/userDashboardStore";
import { fetchAccount, fetchCarByVin } from "@/app/lib/ServerApiCalls";

interface Props {
    sessionToken: string;
    accountId: number | null;
    stripeUserId: number | null;
    paymentSuccess: boolean;
}

export default async function DashboardContent({ sessionToken, accountId, stripeUserId, paymentSuccess }: Props) {
    let reservations: DashboardReservation[] = [];
    let userData: Record<string, unknown> | null = null;
    let serverFetched = false;

    if (accountId) {
        const account = await fetchAccount(accountId, sessionToken, { parseFullObjects: true });
        console.log("[DashboardContent] /accounts/:id response:", JSON.stringify(account, null, 2));

        if (account) {
            const user = account.user as Record<string, unknown> | null;
            userData = user ?? null;
            const raw = (user?.reservations ?? []) as Record<string, unknown>[];

            if (Array.isArray(raw) && raw.length > 0) {
                // Collect unique VINs and fetch all cars in parallel
                const vins = [...new Set(raw.map((r) => r.car as string).filter(Boolean))];
                console.log("[DashboardContent] fetching", vins.length, "unique cars:", vins);
                const carResults = await Promise.all(vins.map((vin) => fetchCarByVin(vin, sessionToken)));
                const carMap = new Map<string, Record<string, unknown>>();
                carResults.forEach((car) => { if (car) carMap.set(car.vin as string, car); });

                reservations = raw.map((r) => {
                    const vin = r.car as string;
                    const car = carMap.get(vin) ?? null;
                    return {
                        ...r,
                        car: car ? { vin: car.vin, make: car.make, model: car.model, images: car.images ?? [] } : null,
                        paymentIds: (r.payments as string[]) ?? [],
                    } as DashboardReservation;
                });
            }
        }

        console.log("[DashboardContent] reservations count:", reservations.length);
        serverFetched = true;
    } else {
        console.log("[DashboardContent] skipped — accountId is null");
    }

    return (
        <DashboardShell
            initialReservations={reservations}
            initialUser={userData}
            serverFetched={serverFetched}
            paymentSuccess={paymentSuccess}
        />
    );
}
