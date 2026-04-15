package com.inc.fcr.errorHandling;

/**
 * Immutable record representing a standardized API error response body.
 *
 * <p>Serialized to JSON and returned by all error handler methods in {@link ApiErrors}.</p>
 *
 * @param status      The HTTP status code (e.g., 400, 404, 500).
 * @param error       A short human-readable error label (e.g., "Car Not Found").
 * @param message     A concise description of the error, may be {@code null}.
 * @param fullMessage The full exception stack trace string, may be {@code null}.
 */
public record ApiErrorResponse(int status, String error, String message, String fullMessage) {
}
