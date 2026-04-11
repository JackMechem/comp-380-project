import { create } from "zustand";

export type AdminView = "add-car" | "edit-car" | "view-data" | null;

interface AdminSidebarStore {
    collapsed: boolean;
    activeView: AdminView;
    editVin: string | null;
    toggle: () => void;
    setCollapsed: (collapsed: boolean) => void;
    setActiveView: (view: AdminView) => void;
    openEditCar: (vin: string) => void;
    setEditVin: (vin: string | null) => void;
}

export const useAdminSidebarStore = create<AdminSidebarStore>((set, get) => ({
    collapsed: false,
    activeView: null,
    editVin: null,
    toggle: () => set({ collapsed: !get().collapsed }),
    setCollapsed: (collapsed) => set({ collapsed }),
    setActiveView: (view) => set({ activeView: view }),
    openEditCar: (vin) => set({ activeView: "edit-car", editVin: vin }),
    setEditVin: (vin) => set({ editVin: vin }),
}));
