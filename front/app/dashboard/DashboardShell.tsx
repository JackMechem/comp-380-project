"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ReservationsPanel from "./components/ReservationsPanel";
import EditReservationPanel from "./components/EditReservationPanel";
import UserDetailsPanel from "./components/UserDetailsPanel";
import { useUserDashboardStore, DashboardReservation } from "@/stores/userDashboardStore";
import { useCartStore } from "@/stores/cartStore";
import { BiCheckCircle, BiX } from "react-icons/bi";
import styles from "./dashboard.module.css";

interface Props {
    initialReservations: DashboardReservation[];
    initialUser: Record<string, unknown> | null;
    serverFetched: boolean;
    paymentSuccess: boolean;
}

export default function DashboardShell({ initialReservations, initialUser, serverFetched, paymentSuccess: initialPaymentSuccess }: Props) {
    const { activeView } = useUserDashboardStore();
    const { clearCart } = useCartStore();
    const router = useRouter();
    const [paymentSuccess, setPaymentSuccess] = useState(initialPaymentSuccess);

    useEffect(() => {
        if (initialPaymentSuccess) {
            clearCart();
            router.replace("/dashboard", { scroll: false });
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const renderPanel = () => {
        switch (activeView) {
            case "edit-reservation": return <EditReservationPanel />;
            case "user-details":    return <UserDetailsPanel initialUser={serverFetched ? initialUser : null} />;
            default:                return <ReservationsPanel initialReservations={initialReservations} serverFetched={serverFetched} />;
        }
    };

    return (
        <>
            {paymentSuccess && (
                <div className={styles.successBanner}>
                    <div className={styles.successBannerLeft}>
                        <BiCheckCircle className={styles.successBannerIcon} />
                        <span>Payment successful! Your reservation has been confirmed.</span>
                    </div>
                    <button onClick={() => setPaymentSuccess(false)} className={styles.successBannerClose}>
                        <BiX />
                    </button>
                </div>
            )}
            {renderPanel()}
        </>
    );
}
