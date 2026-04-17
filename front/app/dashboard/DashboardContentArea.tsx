"use client";

import { useUserDashboardStore } from "@/stores/userDashboardStore";
import { useWindowSize } from "@/app/hooks/useWindowSize";
import MainBodyContainer from "../components/containers/mainBodyContainer";
import styles from "./dashboard.module.css";

export default function DashboardContentArea({ children }: { children: React.ReactNode }) {
    const { collapsed } = useUserDashboardStore();
    const { width } = useWindowSize();
    const isMobile = width !== undefined && width < 768;

    return (
        <div
            className={styles.content}
            style={{ paddingLeft: isMobile ? 0 : collapsed ? 64 : 220, paddingBottom: isMobile ? 80 : 0 }}
        >
            <MainBodyContainer>
                <div className={styles.inner}>
                    {children}
                </div>
            </MainBodyContainer>
        </div>
    );
}
