package com.inc.fcr;

import io.javalin.http.Context;
import io.javalin.http.Header;
import io.javalin.http.UnauthorizedResponse;
import io.javalin.security.RouteRole;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;

public class Auth {

    // Authentication starts here
    public static void handleAccess(Context ctx) {
        Set<RouteRole> permittedRoles = ctx.routeRoles();
        // check if context requires (permitted) roles
        if (permittedRoles.contains(Role.ANYONE)) {return;} // anyone can access
        if (userRoles(ctx).stream().anyMatch(permittedRoles::contains)) {return;} // user has required role
        // else auth error
        ctx.header(Header.WWW_AUTHENTICATE, "Basic");
        throw new UnauthorizedResponse();
    }

    // Authenticate user/access roles (returns list of roles)
    public static List<Role> userRoles(Context ctx) {
        return Optional.ofNullable(ctx.basicAuthCredentials())
                .map(credentials -> userRolesMap
                        .getOrDefault(new Pair(credentials.getUsername(), credentials.getPassword()), List.of()))
                .orElse(List.of());
    }

    // ---- TEMP ----
    // Authentication test samples
    // To be replaced with API keys and/or user logins later
    static class Pair {
        String a, b;
        Pair(String a, String b) {this.a=a; this.b=b;}
    }
    private static final Map<Pair, List<Role>> userRolesMap = Map.of(
            new Pair("ali", "intentionallyInsecurePassword#1"), List.of(Role.READ),
            new Pair("bob", "intentionallyInsecurePassword#2"), List.of(Role.READ, Role.WRITE),
            new Pair("jim", "intentionallyInsecurePassword#3"), List.of(Role.READ, Role.WRITE, Role.ADMIN)
    );
}
