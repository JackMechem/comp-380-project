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
    
    public static void handleAccess(Context ctx) {
        Set<RouteRole> permittedRoles = ctx.routeRoles();
        if (permittedRoles.contains(Role.ANYONE)) {
            return; // anyone can access
        }
        if (userRoles(ctx).stream().anyMatch(permittedRoles::contains)) {
            return; // user has role required to access
        }
        ctx.header(Header.WWW_AUTHENTICATE, "Basic");
        throw new UnauthorizedResponse();
    }

    static class Pair {
        String a, b;
        Pair(String a, String b) {
            this.a=a; this.b=b;
        }
    }
    private static final Map<Pair, List<Role>> userRolesMap = Map.of(
            new Pair("alice", "weak-1234"), List.of(Role.USER_READ),
            new Pair("bob", "weak-123456"), List.of(Role.USER_READ, Role.USER_WRITE)
    );

    public static List<Role> userRoles(Context ctx) {
        return Optional.ofNullable(ctx.basicAuthCredentials())
                .map(credentials -> userRolesMap.getOrDefault(new Pair(credentials.getUsername(), credentials.getPassword()), List.of()))
                .orElse(List.of());
    }
}
