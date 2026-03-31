package com.inc.fcr.errorHandling;

import io.javalin.http.Context;
import io.javalin.openapi.*;

import java.io.PrintWriter;
import java.io.StringWriter;

import com.inc.fcr.car.enums.*;

public final class ApiErrors {

    public static void reDirectError(Context ctx, String message, Exception e) { // 300
        //ctx.status(302).redirect("/new-location");
        ctx.status(302).header("Location", "/new-location");
    }

    public static void badRequest(Context ctx, String message, Exception e) { // 400
        //ctx.status(400).json(new ApiErrorResponse(400, message, "" + e, stackTraceString(e))));
        ctx.status(400).json(new ApiErrorResponse(400, "Bad Request", "" + e, stackTraceString(e)));
    }

    public static void notFound(Context ctx, String message, Exception e) { // 400
        //ctx.status(404).json(new ApiErrorResponse(404, message, null, null));
        ctx.status(404).json(new ApiErrorResponse(404, "Not Found", null, null));
    }

    public static void serverError(Context ctx, String message, Exception e) { // 500
        //ctx.status(500).json(new ApiErrorResponse(500, message, "" + e, stackTraceString(e)));
        ctx.status(500).json(new ApiErrorResponse(500, "Server Error", "" + e, stackTraceString(e)));
    }

    /*could have also just done:

    private static void send(Context ctx, int status, String message, Exception e) {
        ctx.status(status).json(new ApiErrorResponse(status, message, e != null ? e.toString() : null, e != null ? stackTraceString(e) : null));
    }

    and then just fill in when the others call on send*/

    private static String stackTraceString(Exception e) {
        StringWriter stack = new StringWriter();
        e.printStackTrace(new PrintWriter(stack));
        return stack.toString();
    }

}
