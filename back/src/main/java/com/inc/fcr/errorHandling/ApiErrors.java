package com.inc.fcr.errorHandling;

import io.javalin.http.Context;
import io.javalin.openapi.*;

import java.io.PrintWriter;
import java.io.StringWriter;

import com.inc.fcr.car.enums.*;
import org.apache.commons.lang3.StringUtils;

/**
 * Centralizes HTTP error responses for the FCR API.
 *
 * <p>All methods write an {@link ApiErrorResponse} JSON body and set the appropriate
 * HTTP status code on the Javalin {@link Context}. Controllers call these static helpers
 * rather than constructing error responses inline.</p>
 */
public final class ApiErrors {

    /**
     * Sends a {@code 302 Found} redirect response.
     *
     * @param ctx         the Javalin request context
     * @param newLocation the URL to redirect to
     */
    public static void redirectError(Context ctx, String newLocation) { // 302
        ctx.status(302).header("Location", newLocation);
    }

    /**
     * Sends a {@code 400 Bad Request} response indicating malformed entity data.
     *
     * @param ctx the Javalin request context
     * @param e   the validation exception that was caught
     */
    public static void formatError(Context ctx, Exception e) { // 400
        getObjectName(ctx);
        ctx.status(400).json(new ApiErrorResponse(400, "Improper "+getObjectName(ctx)+" Format", "" + e, stackTraceString(e)));
    }

    /**
     * Sends a {@code 400 Bad Request} response indicating invalid query parameters.
     *
     * @param ctx the Javalin request context
     * @param e   the {@link QueryParamException} that was caught
     */
    public static void queryParamError(Context ctx, Exception e) { // 400
        ctx.status(400).json(new ApiErrorResponse(400, "Invalid Query Parameters", "" + e, stackTraceString(e)));
    }

    /**
     * Sends a {@code 404 Not Found} response. The entity name is derived from the request path.
     *
     * @param ctx the Javalin request context
     */
    public static void notFound(Context ctx) { // 404
        ctx.status(404).json(new ApiErrorResponse(404, getObjectName(ctx)+" Not Found", null, null));
    }

    /**
     * Sends a {@code 500 Internal Server Error} response for unexpected exceptions.
     *
     * @param ctx the Javalin request context
     * @param e   the exception that was caught
     */
    public static void serverError(Context ctx, Exception e) { // 500
        ctx.status(500).json(new ApiErrorResponse(500, "Server Error", "" + e, stackTraceString(e)));
    }

    /**
     * Sends a {@code 500 Internal Server Error} response for Hibernate/database failures.
     *
     * @param ctx the Javalin request context
     * @param e   the {@link org.hibernate.HibernateException} that was caught
     */
    public static void databaseError(Context ctx, Exception e) { // 500
        ctx.status(500).json(new ApiErrorResponse(500, "Database Error", "" + e, stackTraceString(e)));
    }

    // Helper functions
    // ----------------

    private static String stackTraceString(Exception e) {
        StringWriter stack = new StringWriter();
        e.printStackTrace(new PrintWriter(stack));
        return stack.toString();
    }

    private static String getObjectName(Context ctx) {
        if (ctx.path().isEmpty() || !ctx.path().contains("/")) return "Object";
        // return path stem capitalized and depluralized
        String pathStem = ctx.path().split("/")[1];
        return StringUtils.capitalize(pathStem.substring(0,pathStem.length()-1));
    }
}
