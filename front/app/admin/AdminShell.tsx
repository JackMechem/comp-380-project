"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import MainBodyContainer from "../components/containers/mainBodyContainer";
import NavHeader from "../components/headers/navHeader";
import AdminSidebar from "../components/menus/adminSidebar";
import CarFormPanel from "./components/CarFormPanel";
import DashboardPanel from "./components/DashboardPanel";
import InventoryPanel from "./components/InventoryPanel";
import ReservationsPanel from "./components/ReservationsPanel";
import { useAdminSidebarStore } from "@/stores/adminSidebarStore";
import { useWindowSize } from "@/app/hooks/useWindowSize";
import { useUserDashboardStore } from "@/stores/userDashboardStore";
import { Car } from "@/app/types/CarTypes";
import { Reservation } from "@/app/types/ReservationTypes";

interface Props {
    initialCars: Car[];
    initialReservations: Reservation[];
}

export default function AdminShell({ initialCars, initialReservations }: Props) {
    const { collapsed, activeView } = useAdminSidebarStore();
    const { width } = useWindowSize();
    const isMobile = width !== undefined && width < 768;
    const router = useRouter();
    const { isAuthenticated, sessionToken, role } = useUserDashboardStore();

    useEffect(() => {
        if (!isAuthenticated || !sessionToken || (role !== "ADMIN" && role !== "STAFF")) {
            router.replace("/login");
        }
    }, [isAuthenticated, sessionToken, role]);

    const renderContent = () => {
        switch (activeView) {
            case "add-car":
                return (
                    <div>
                        <h1 className="page-title" style={{ marginBottom: 24 }}>Add Car</h1>
                        <CarFormPanel mode="add" />
                    </div>
                );
            case "edit-car":
                return (
                    <div>
                        <h1 className="page-title" style={{ marginBottom: 24 }}>Edit Car</h1>
                        <CarFormPanel mode="edit" />
                    </div>
                );
            case "view-data":
                return <InventoryPanel initialCars={initialCars} />;
            case "view-reservations":
                return <ReservationsPanel initialReservations={initialReservations} />;
            default:
                return <DashboardPanel initialCars={initialCars} />;
        }
    };

    return (
        <>
            <NavHeader white={false} />
            <AdminSidebar />
            <div
                className="transition-all duration-300 ease-in-out"
                style={{
                    paddingLeft: isMobile ? 0 : collapsed ? 64 : 220,
                    paddingBottom: isMobile ? 80 : 0,
                }}
            >
                <MainBodyContainer>
                    <div className="py-[40px]">
                        {renderContent()}
                    </div>
                </MainBodyContainer>
            </div>
        </>
    );
}
