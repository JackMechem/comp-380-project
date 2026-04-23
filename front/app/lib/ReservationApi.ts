import { ReservationPages } from "../types/ReservationTypes";

export const getAllReservations = async ({
    page,
    pageSize,
    sortBy,
    sortDir,
}: {
    page?: number;
    pageSize?: number;
    sortBy?: string | null;
    sortDir?: "asc" | "desc";
} = {}): Promise<ReservationPages> => {
    const params = new URLSearchParams();
    if (page) params.set("page", String(page));
    if (pageSize) params.set("pageSize", String(pageSize));
    if (sortBy) params.set("sortBy", sortBy);
    if (sortDir) params.set("sortDir", sortDir);

    const res = await fetch(`/api/reservations?${params.toString()}`, { cache: "no-store" });
    if (!res.ok) {
        const body = await res.text();
        console.error(`[getAllReservations] ${res.status}:`, body);
        throw new Error(`Failed to fetch reservations (${res.status}): ${body}`);
    }
    return res.json();
};
