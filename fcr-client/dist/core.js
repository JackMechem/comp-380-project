"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiError = void 0;
exports.buildQuery = buildQuery;
exports.parseResponse = parseResponse;
/**
 * Serializes a params object to a URL query string.
 * - null/undefined values are omitted
 * - Arrays are joined with commas
 */
function buildQuery(params) {
    const qs = new URLSearchParams();
    for (const [key, val] of Object.entries(params)) {
        if (val == null)
            continue;
        if (Array.isArray(val)) {
            if (val.length > 0)
                qs.set(key, val.join(","));
        }
        else {
            qs.set(key, String(val));
        }
    }
    return qs.toString();
}
/** Thrown when an API response has a non-2xx status code. */
class ApiError extends Error {
    constructor(status, message) {
        super(message);
        this.name = "ApiError";
        this.status = status;
    }
}
exports.ApiError = ApiError;
/** Throws ApiError if the response is not ok, otherwise returns parsed JSON. */
async function parseResponse(res) {
    if (!res.ok) {
        const text = await res.text().catch(() => res.statusText);
        throw new ApiError(res.status, text);
    }
    return res.json();
}
