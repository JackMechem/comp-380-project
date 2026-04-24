package com.inc.fcr.utils;

import io.javalin.http.Context;
import io.javalin.http.Handler;

/**
 * Utility class for timing function executions.
 */
public abstract class TimeIt {

    /**
     * Wraps an API handler to measure and log its execution time.
     *
     * @param func the handler to time
     * @param name the name of the API for logging
     * @return a new handler that times the original
     */
    public static Handler timeThisAPI(Handler func, String name) {
        return (ctx) -> {
            System.out.println("-- "+ name +" Execution time Start... --");
            long startTime = System.nanoTime();
            func.handle(ctx); // Run API function
            long endTime = System.nanoTime();
            long duration = endTime - startTime;
            System.out.println("-- "+ name +" Execution time: " + duration / 1000000 + " ms --");
        };
    }
}
