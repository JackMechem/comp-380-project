package com.inc.fcr;

import io.javalin.Javalin;
import static io.javalin.apibuilder.ApiBuilder.*;

public class Main {
    public static void main(String[] args) {

        // Initiate API
        Javalin app = Javalin.create(config -> {
            config.router.mount(router -> {
                router.beforeMatched(Auth::handleAccess);
            }).apiBuilder(() -> {
                // Specify default redirect (unspecified endpoint to cars endpoint)
                get("/", ctx -> ctx.redirect("/cars"), Role.ANYONE);
                // Cars endpoint
                path("cars", () -> {
                    get(CarController::getAllCars, Role.ANYONE);
                    post(CarController::createCar, Role.WRITE);
                    path("{id}", () -> {
                        get(CarController::getCar, Role.ANYONE);
                        patch(CarController::updateCar, Role.WRITE);
                        delete(CarController::deleteCar, Role.WRITE);
                    });
                });
            });
        }).start(7070);

        System.out.println("Hello from stdout java");
    }
}