package com.inc.fcr;

import io.javalin.security.RouteRole;

// Authentication API roles (security)
public enum Role implements RouteRole {
    ANYONE,
    READ,
    WRITE,
    ADMIN
}