package com.inc.fcr;

import io.javalin.http.Context;
import io.javalin.security.RouteRole;
import java.util.*;

enum Role implements RouteRole { ANYONE, USER_READ, USER_WRITE }

// ## API Test class (example) (nonfunctional)
public class UserController {

    // Example data struct for test
    public static class User {
        String name, email;
        User(String name, String email) {
            this.name = name;
            this.email = email;
        }
    }
    private static final Map<String, User> users;
    // Sample data
    static {
        Map tempMap = Map.of(
                randomId(), new User("Alice", "alice@alice.kt"),
                randomId(), new User("Bob", "bob@bob.kt"),
                randomId(), new User("Carol", "carol@carol.kt"),
                randomId(), new User("Dave", "dave@dave.kt")
        );
        users = new HashMap<>(tempMap);
    }
    // ---

    // Sample CRUD methods
    public static void getAllUserIds(Context ctx) {
        ctx.json(users.keySet());
    }
    public static void createUser(Context ctx) {
        users.put(randomId(), ctx.bodyAsClass(User.class));
    }
    public static void getUser(Context ctx) {
        ctx.json(users.get(ctx.pathParam("userId")));
    }
    public static void updateUser(Context ctx) {
        users.put(ctx.pathParam("userId"), ctx.bodyAsClass(User.class));
    }
    public static void deleteUser(Context ctx) {
        users.remove(ctx.pathParam("userId"));
    }
    // helper method
    private static String randomId() {
        return UUID.randomUUID().toString();
    }
    // ---
}