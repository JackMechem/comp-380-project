package com.inc.fcr;

import io.javalin.Javalin;

public class Main {
    public static void main(String[] args) {
        Javalin j = null;
//        Object app = Javalin.create(config -> {
//            config.routes.get("/", ctx -> ctx.result("Hello World"));
//        }).start(7070);

        System.out.println("Hello from stdout java");
    }
}