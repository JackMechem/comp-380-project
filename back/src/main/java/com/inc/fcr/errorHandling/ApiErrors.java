package com.inc.fcr.errorHandling;

import io.javalin.http.Context;
import io.javalin.openapi.*;

import java.io.PrintWriter;
import java.io.StringWriter;

import com.inc.fcr.car.enums.*;

public final class ApiErrors {

    public static void redirectError(Context ctx, String newLocation) { // 302
        ctx.status(302).header("Location", newLocation);
    }

    public static void formatError(Context ctx, Exception e) { // 400
        ctx.status(400).json(new ApiErrorResponse(400, "Improper Object Format", "" + e, stackTraceString(e)));
    }

    public static void queryParamError(Context ctx, Exception e) { // 400
        ctx.status(400).json(new ApiErrorResponse(400, "Invalid Query Parameters", "" + e, stackTraceString(e)));
    }

    public static void notFound(Context ctx) { // 404
        ctx.status(404).json(new ApiErrorResponse(404, "Object Not Found", null, null));
    }

    public static void serverError(Context ctx, Exception e) { // 500
        ctx.status(500).json(new ApiErrorResponse(500, "Server Error", "" + e, stackTraceString(e)));
    }

    public static void databaseError(Context ctx, Exception e) { // 500
        ctx.status(500).json(new ApiErrorResponse(500, "Database Error", "" + e, stackTraceString(e)));
    }

    private static String stackTraceString(Exception e) {
        StringWriter stack = new StringWriter();
        e.printStackTrace(new PrintWriter(stack));
        return stack.toString();
    }

}
