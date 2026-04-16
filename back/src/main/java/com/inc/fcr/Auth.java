package com.inc.fcr;

import io.javalin.http.Context;
import io.javalin.http.Header;
import io.javalin.http.UnauthorizedResponse;
import io.javalin.security.RouteRole;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;

/**
 * Handles HTTP Basic authentication and role-based access control for the FCR API.
 *
 * <p>This class is registered as a Javalin {@code beforeMatched} handler in {@link Main}.
 * Every incoming request passes through {@link #handleAccess(Context)} before reaching
 * its route handler.</p>
 *
 * <p><strong>Note:</strong> The credential store ({@link #userRolesMap}) is a temporary
 * hard-coded map and is intended to be replaced with a proper authentication mechanism
 * (API keys or user logins) in the future.</p>
 */
public class Auth {

    /**
     * Javalin {@code beforeMatched} handler that enforces role-based access control.
     *
     * <p>If the matched route permits {@link Role#ANYONE}, the request passes through
     * immediately. Otherwise, the caller's Basic auth credentials are checked against
     * {@link #userRolesMap}. A {@code 401 Unauthorized} response is sent if the user
     * has no matching role.</p>
     *
     * @param ctx the Javalin request context
     * @throws UnauthorizedResponse if the caller lacks a required role
     */
    public static void handleAccess(Context ctx) {
        Set<RouteRole> permittedRoles = ctx.routeRoles();
        // check if context requires (permitted) roles
        if (permittedRoles.contains(Role.ANYONE)) {
            return;
        } // anyone can access
        if (userRoles(ctx).stream().anyMatch(permittedRoles::contains)) {
            return;
        } // user has required role
          // else auth error
        ctx.header(Header.WWW_AUTHENTICATE, "Basic");
        throw new UnauthorizedResponse();
    }

    /**
     * Route handler for {@code GET /auth/validate}.
     *
     * <p>Returns {@code 200 OK} if the provided Basic auth credentials are valid,
     * or {@code 401 Unauthorized} otherwise. Useful for login checks from clients.</p>
     *
     * @param ctx the Javalin request context
     * @throws UnauthorizedResponse if credentials are missing or invalid
     */
    public static void validateCredentials(Context ctx) {
        if (!userRoles(ctx).isEmpty()) {
            ctx.status(200);
        } else {
            ctx.header(Header.WWW_AUTHENTICATE, "Basic");
            throw new UnauthorizedResponse();
        }
    }

    /**
     * Returns the list of {@link Role}s associated with the Basic auth credentials
     * present in the request, or an empty list if credentials are absent or unrecognized.
     *
     * @param ctx the Javalin request context
     * @return a non-null list of roles granted to the caller
     */
    public static List<Role> userRoles(Context ctx) {
        return Optional.ofNullable(ctx.basicAuthCredentials())
                .map(credentials -> userRolesMap
                        .getOrDefault(new Pair(credentials.getUsername(), credentials.getPassword()), List.of()))
                .orElse(List.of());
    }

    // ---- TEMP ----
    // Authentication test samples — to be replaced with API keys and/or user logins later.

    /**
     * Simple username/password pair used as the key in {@link #userRolesMap}.
     *
     * <p>Intentionally minimal; equality and hashing are based on both fields.</p>
     */
    static class Pair {
        String a, b;

        Pair(String a, String b) {
            this.a = a;
            this.b = b;
        }
        @Override
        public boolean equals(Object o) {
            if (this == o) return true;
            if (!(o instanceof Pair)) return false;
            Pair p = (Pair) o;
            return a.equals(p.a) && b.equals(p.b);
        }
        @Override
        public int hashCode() {
            return 31 * a.hashCode() + b.hashCode();
        }
    }

    private static final Map<Pair, List<Role>> userRolesMap = Map.of(
            new Pair("ali", "intentionallyInsecurePassword#1"), List.of(Role.READ),
            new Pair("bob", "intentionallyInsecurePassword#2"), List.of(Role.READ, Role.WRITE),
            new Pair("jim", "intentionallyInsecurePassword#3"), List.of(Role.READ, Role.WRITE, Role.ADMIN)
    );
}
