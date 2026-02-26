package com.inc.fcr;

import io.javalin.Javalin;
import static io.javalin.apibuilder.ApiBuilder.*;

public class Main {
    public static void main(String[] args) {

        Javalin app = Javalin.create(config -> {
            config.router.mount(router -> {
                router.beforeMatched(Auth::handleAccess);
            }).apiBuilder(() -> {
                get("/", ctx -> ctx.redirect("/users"), Role.ANYONE);
                path("users", () -> {
                    get(UserController::getAllUserIds, Role.ANYONE);
                    post(UserController::createUser, Role.USER_WRITE);
                    path("{userId}", () -> {
                        get(UserController::getUser, Role.USER_READ);
                        patch(UserController::updateUser, Role.USER_WRITE);
                        delete(UserController::deleteUser, Role.USER_WRITE);
                    });
                });
            });
        }).start(7070);

        System.out.println("Hello from stdout java");
    }
}