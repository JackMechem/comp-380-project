/**
 * Server-side FCR API client.
 * Import ONLY from server components, server actions, or API route handlers.
 * Never import from client components — use browserApi instead.
 *
 * Reads from environment variables at call time:
 *   NEXT_PUBLIC_API_BASE_URL  — public/catalogue base URL
 *   API_BASE_URL              — private/admin base URL
 *   API_KEY                   — shared API key
 *   REVALIDATE_SECONDS        — ISR revalidation interval (default: 60)
 *
 * Usage:
 *   import { serverApi } from 'fcr-client/server';
 *   const cars = await serverApi.cars.getFiltered({ pageSize: 20 });
 */
import type { Car, CarPages, CarApiParams, CarEnums, Review } from "./types";
export declare const serverApi: {
    cars: {
        getFiltered(params: CarApiParams): Promise<CarPages>;
        getById(vin: string): Promise<Car>;
        getMakes(): Promise<string[]>;
        getAll(opts?: {
            page?: number;
            pageSize?: number;
            sessionToken?: string;
        }): Promise<CarPages>;
    };
    enums: {
        getAll(): Promise<CarEnums>;
    };
    reservations: {
        list(sessionToken: string, opts?: {
            pageSize?: number;
            parseFullObjects?: boolean;
            userId?: number;
        }): Promise<unknown[]>;
    };
    users: {
        getById(userId: number, sessionToken: string): Promise<Record<string, unknown> | null>;
    };
    accounts: {
        getById(acctId: number, sessionToken: string, opts?: {
            parseFullObjects?: boolean;
        }): Promise<Record<string, unknown> | null>;
    };
    reviews: {
        getForCar(vin: string): Promise<Review[]>;
    };
};
//# sourceMappingURL=server.d.ts.map