"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { useSidebarStore } from "@/stores/sidebarStore";
import { useUserDashboardStore } from "@/stores/userDashboardStore";
import { useBookmarkStore } from "@/stores/bookmarkStore";
import HeaderMenu from "./menus/headerMenu";
import FilterSidebar from "./menus/filterSidebar";
import { useWindowSize } from "@/app/hooks/useWindowSize";
import styles from "./SidebarLayout.module.css";

const INACTIVITY_MS = 5 * 60 * 1000; // 5 minutes
const WARNING_BEFORE_MS = 10_000;     // show warning 10s before logout

const SidebarLayout = ({ children }: { children: React.ReactNode }) => {
    const pathname = usePathname();
    const router = useRouter();
    useEffect(() => {
        if (pathname !== "/login") {
            sessionStorage.setItem("pre-login-path", pathname);
        }
    }, [pathname]);

    const { openPanel } = useSidebarStore();
    const { width } = useWindowSize();
    const pushContent = openPanel && (width === undefined || width >= 1300);

    const { role, clearSession } = useUserDashboardStore();
    const isPrivileged = role === "ADMIN" || role === "STAFF";

    const [countdown, setCountdown] = useState<number | null>(null);
    const warningTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const logoutTimerRef  = useRef<ReturnType<typeof setTimeout> | null>(null);
    const countdownRef    = useRef<ReturnType<typeof setInterval> | null>(null);

    useEffect(() => {
        if (!isPrivileged) return;

        const signOut = () => {
            Cookies.remove("user-session", { path: "/" });
            Cookies.remove("account-id", { path: "/" });
            Cookies.remove("stripe-user-id", { path: "/" });
            Cookies.remove("user-role", { path: "/" });
            useBookmarkStore.getState().setBookmarks([]);
            clearSession();
            router.replace("/login?reason=inactivity");
        };

        const startCountdown = () => {
            setCountdown(10);
            let remaining = 10;
            countdownRef.current = setInterval(() => {
                remaining -= 1;
                setCountdown(remaining);
                if (remaining <= 0) {
                    clearInterval(countdownRef.current!);
                    countdownRef.current = null;
                }
            }, 1000);

            logoutTimerRef.current = setTimeout(() => {
                signOut();
            }, WARNING_BEFORE_MS);
        };

        const clearAll = () => {
            if (warningTimerRef.current) { clearTimeout(warningTimerRef.current); warningTimerRef.current = null; }
            if (logoutTimerRef.current)  { clearTimeout(logoutTimerRef.current);  logoutTimerRef.current  = null; }
            if (countdownRef.current)    { clearInterval(countdownRef.current);   countdownRef.current    = null; }
        };

        const reset = () => {
            clearAll();
            setCountdown(null);
            warningTimerRef.current = setTimeout(startCountdown, INACTIVITY_MS - WARNING_BEFORE_MS);
        };

        reset();
        window.addEventListener("mousemove", reset);
        return () => {
            window.removeEventListener("mousemove", reset);
            clearAll();
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isPrivileged]);

    return (
        <div className={styles.root}>
            <div
                className={styles.content}
                style={{ marginRight: pushContent ? 380 : 0 }}
            >
                {children}
            </div>

            {countdown !== null && (
                <div className={styles.inactivityOverlay}>
                    <div className={styles.inactivityModal}>
                        <p className={styles.inactivityTitle}>Still there?</p>
                        <p className={styles.inactivityBody}>
                            You&apos;ll be signed out in
                        </p>
                        <div className={styles.inactivityCountdown}>{countdown}</div>
                        <p className={styles.inactivityHint}>Move your mouse to stay signed in</p>
                    </div>
                </div>
            )}

            <HeaderMenu />
            <Suspense>
                <FilterSidebar />
            </Suspense>
        </div>
    );
};

export default SidebarLayout;
