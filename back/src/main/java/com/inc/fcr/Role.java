package com.inc.fcr;

import io.javalin.security.RouteRole;

/**
 * Defines the access control roles used throughout the FCR API.
 *
 * <p>Roles are assigned to routes and compared against the authenticated user's
 * roles in {@link Auth#handleAccess(io.javalin.http.Context)}.</p>
 *
 * <ul>
 *   <li>{@link #ANYONE} - No authentication required; public access.</li>
 *   <li>{@link #READ}   - Authenticated read-only access.</li>
 *   <li>{@link #WRITE}  - Authenticated read/write access (create/update).</li>
 *   <li>{@link #ADMIN}  - Full access including destructive operations (delete).</li>
 * </ul>
 */
public enum Role implements RouteRole {
    /** Public access — no credentials required. */
    ANYONE,
    /** Read-only authenticated access. */
    READ,
    /** Read and write authenticated access. */
    WRITE,
    /** Full administrative access, including delete operations. */
    ADMIN
}