package com.inc.fcr;

import io.javalin.Javalin;

public class Main {
    public static void main(String[] args) {
        Javalin j = null;
        // Is this broken version maybe newer not older? we're running Javalin 6.7 not 7.x
//        Javalin app = Javalin.create(config -> {
//            config.routes.get("/", ctx -> ctx.result("Hello World"));
//        }).start(7070);
        Javalin app = Javalin.create(/*config*/)
        .get("/", ctx -> ctx.result("Hello World"))
        .start(7070);

        System.out.println("Hello from stdout java");
    }
}