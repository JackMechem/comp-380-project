import { redirect } from "next/navigation";
import { getSessionCookies } from "@/app/lib/serverAuth";
import { fetchCars, fetchReservations } from "@/app/lib/ServerApiCalls";
import AdminShell from "./AdminShell";
import { Car } from "@/app/types/CarTypes";
import { Reservation } from "@/app/types/ReservationTypes";


export default async function AdminPage() {
    const { sessionToken, role } = await getSessionCookies();

    // Hard redirect only when there's definitely no session at all.
    // If role cookie is missing (old session), let AdminShell's Zustand check handle it.
    if (!sessionToken) {
        redirect("/login");
    }

    // If we have the role from cookie and it's not admin/staff, redirect immediately.
    if (role && role !== "ADMIN" && role !== "STAFF") {
        redirect("/login");
    }

    const [carsData, reservationsData] = await Promise.all([
        fetchCars(sessionToken, { pageSize: 500 }),
        fetchReservations(sessionToken, { pageSize: 100, parseFullObjects: true }),
    ]);

    const cars: Car[] = carsData as Car[];
    const reservations: Reservation[] = reservationsData as Reservation[];

    return <AdminShell initialCars={cars} initialReservations={reservations} />;
}
