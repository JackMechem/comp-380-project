import { create } from "zustand";
import { persist } from "zustand/middleware";

export type UserDashboardView =
    | "reservations"
    | "edit-reservation"
    | "user-details"
    // Admin/Staff views
    | "admin-dashboard"
    | "add-car"
    | "edit-car"
    | "view-data"
    | "view-reservations"
    | "view-accounts"
    | "view-users";

export interface DashboardReservation {
    reservationId: number;
    car: { vin: string; make: string; model: string; images: string[] } | null;
    user: number | { userId: number; [key: string]: unknown };
    paymentIds: string[];
    pickUpTime: number | string;
    dropOffTime: number | string;
    dateBooked: number | string;
    duration: number;
    durationHours: number;
    durationDays: number;
}

interface UserDashboardStore {
    collapsed: boolean;
    activeView: UserDashboardView;
    accountId: number | null;
    /** userId from auth response — the linked user in /users (stripe_users table) */
    stripeUserId: number | null;
    userEmail: string | null;
    userName: string | null;
    isAuthenticated: boolean;
    sessionToken: string | null;
    sessionExpiresAt: string | null;
    role: string | null;
    selectedReservation: DashboardReservation | null;
    /** VIN of car being edited (admin/staff) */
    editVin: string | null;
    toggle: () => void;
    setActiveView: (view: UserDashboardView) => void;
    setAccountId: (id: number | null) => void;
    setUserEmail: (email: string | null) => void;
    setUserName: (name: string | null) => void;
    setAuthenticated: (value: boolean) => void;
    setSession: (token: string, accountId: number, role: string, expiresAt: string, stripeUserId?: number | null) => void;
    clearSession: () => void;
    openEditReservation: (reservation: DashboardReservation) => void;
    openEditCar: (vin: string) => void;
    setEditVin: (vin: string | null) => void;
}

export const useUserDashboardStore = create<UserDashboardStore>()(
    persist(
        (set, get) => ({
            collapsed: false,
            activeView: "reservations",
            accountId: null,
            stripeUserId: null,
            userEmail: null,
            userName: null,
            isAuthenticated: false,
            sessionToken: null,
            sessionExpiresAt: null,
            role: null,
            selectedReservation: null,
            editVin: null,
            toggle: () => set({ collapsed: !get().collapsed }),
            setActiveView: (view) => set({ activeView: view }),
            setAccountId: (id) => set({ accountId: id }),
            setUserEmail: (email) => set({ userEmail: email }),
            setUserName: (name) => set({ userName: name }),
            setAuthenticated: (value) => set({ isAuthenticated: value }),
            setSession: (token, accountId, role, expiresAt, stripeUserId = null) =>
                set({ sessionToken: token, accountId, stripeUserId, role, sessionExpiresAt: expiresAt, isAuthenticated: true, userEmail: null, userName: null }),
            clearSession: () =>
                set({ sessionToken: null, accountId: null, stripeUserId: null, role: null, sessionExpiresAt: null, isAuthenticated: false, userEmail: null, userName: null }),
            openEditReservation: (reservation) =>
                set({ selectedReservation: reservation, activeView: "edit-reservation" }),
            openEditCar: (vin) => set({ activeView: "edit-car", editVin: vin }),
            setEditVin: (vin) => set({ editVin: vin }),
        }),
        {
            name: "user-dashboard",
            partialize: (state) => ({
                collapsed: state.collapsed,
                sessionToken: state.sessionToken,
                accountId: state.accountId,
                stripeUserId: state.stripeUserId,
                role: state.role,
                userEmail: state.userEmail,
                userName: state.userName,
                sessionExpiresAt: state.sessionExpiresAt,
                isAuthenticated: state.isAuthenticated,
            }),
        }
    )
);
