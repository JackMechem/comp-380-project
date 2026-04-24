export type QueryValue = string | number | boolean | string[] | number[] | undefined | null;
/**
 * Serializes a params object to a URL query string.
 * - null/undefined values are omitted
 * - Arrays are joined with commas
 */
export declare function buildQuery(params: Record<string, QueryValue>): string;
/** Thrown when an API response has a non-2xx status code. */
export declare class ApiError extends Error {
    readonly status: number;
    constructor(status: number, message: string);
}
/** Throws ApiError if the response is not ok, otherwise returns parsed JSON. */
export declare function parseResponse<T>(res: Response): Promise<T>;
//# sourceMappingURL=core.d.ts.map