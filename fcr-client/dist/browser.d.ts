/**
 * Browser-side FCR API client.
 * All requests go through the Next.js /api/ proxy routes — no backend URLs or
 * API keys are needed here. Safe to import from any client component.
 *
 * Usage:
 *   import { browserApi } from 'fcr-client';
 *   const cars = await browserApi.cars.getFiltered({ pageSize: 20 });
 */
import type { Car, CarPages, CarApiParams, ReservationPages, ReservationPatch, UserReservationRaw, Review, ReviewPages, Account, AccountPages, User, UserPages } from "./types";
export declare const browserApi: {
    cars: {
        /** Search suggestions for nav autocomplete. */
        suggest(searchText: string, pageSize?: number): Promise<{
            vin: string;
            make: string;
            model: string;
        }[]>;
        /** Paginated + filtered car list. */
        getFiltered(params: CarApiParams | Record<string, string | number | undefined>): Promise<CarPages>;
        /** Paginated car list with only page + pageSize. */
        getAll(opts?: {
            page?: number;
            pageSize?: number;
        }): Promise<CarPages>;
        /** Single car by VIN. */
        getById(vin: string): Promise<Car>;
        /** Create a new car. */
        add(car: Car): Promise<string>;
        /** Update car fields. */
        update(car: Car): Promise<string>;
        /** Update only the car's status. */
        updateStatus(vin: string, carStatus: string): Promise<string>;
        /** Delete a car. */
        delete(vin: string): Promise<string>;
    };
    accounts: {
        /** Paginated account list with optional search + sort. */
        getAll(opts?: {
            page?: number;
            pageSize?: number;
            search?: string;
            sortBy?: string | null;
            sortDir?: "asc" | "desc";
        }): Promise<AccountPages>;
        /** Single account by ID, with optional full-object hydration. */
        getById(acctId: number, opts?: {
            parseFullObjects?: boolean;
        }): Promise<Record<string, unknown>>;
        /** Update account fields. */
        update(acctId: number, patch: Partial<Pick<Account, "name" | "email" | "role" | "dateEmailConfirmed">>): Promise<void>;
        /** Delete an account. */
        delete(acctId: number): Promise<void>;
    };
    users: {
        /** Paginated user list. */
        getAll(opts?: {
            page?: number;
            pageSize?: number;
            sortBy?: string | null;
            sortDir?: "asc" | "desc";
        }): Promise<UserPages>;
        getById(userId: string | number): Promise<Record<string, unknown> | null>;
        update(userId: string | number, patch: Record<string, unknown>): Promise<Record<string, unknown> | null>;
        delete(userId: number): Promise<void>;
    };
    reservations: {
        /** Paginated reservation list (admin). */
        getAll(opts?: {
            page?: number;
            pageSize?: number;
            sortBy?: string | null;
            sortDir?: "asc" | "desc";
        }): Promise<ReservationPages>;
        /** User's existing reservations (for date-range conflict detection). */
        listForUser(userId: string | number): Promise<UserReservationRaw[]>;
        /** Update a reservation. */
        update(reservationId: string | number, patch: ReservationPatch | Record<string, unknown>): Promise<unknown>;
        /** Delete a reservation. */
        delete(reservationId: string | number): Promise<void>;
    };
    reviews: {
        /** Paginated review list (admin). */
        getAll(opts?: {
            page?: number;
            pageSize?: number;
        }): Promise<ReviewPages>;
        /** Reviews for a specific account. */
        getForAccount(acctId: number, opts?: {
            objectsPerPage?: number;
        }): Promise<Review[]>;
        /** Delete a review. */
        delete(reviewId: number): Promise<void>;
    };
    bookmarks: {
        /** Get bookmarked cars for an account. */
        get(accountId: number): Promise<Record<string, unknown>>;
        /** Save a new VIN list to the account's bookmarks. */
        update(accountId: number, vins: {
            vin: string;
        }[]): Promise<void>;
    };
    auth: {
        /** Validate basic credentials. Returns the HTTP status code. */
        validateCredentials(username: string, password: string): Promise<number>;
        /** Send a magic login link to an email address. */
        sendMagicLink(email: string): Promise<void>;
        /** Register a new account + user. */
        register(data: Record<string, unknown>): Promise<Response>;
        /** Check whether a full account exists for the given email. */
        checkAccount(email: string): Promise<{
            exists: boolean;
        }>;
        /** Look up a user record by email (guest checkout). */
        userLookup(email: string): Promise<Record<string, unknown> | null>;
    };
    payment: {
        /** Create a Stripe payment intent for the current cart. */
        createIntent(data: {
            userInfo: Record<string, unknown> | null;
            cars: {
                vin: string;
                pickUpTime: string;
                dropOffTime: string;
            }[];
        }): Promise<{
            clientSecret: string;
            publishableKey: string;
        }>;
    };
};
export type { Car, CarPages, CarApiParams, ReservationPages, ReservationPatch, UserReservationRaw, Review, ReviewPages, Account, AccountPages, User, UserPages, };
//# sourceMappingURL=browser.d.ts.map