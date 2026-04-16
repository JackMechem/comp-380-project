package com.inc.fcr.errorHandling;

/**
 * Thrown when an HTTP request contains invalid or unrecognized query parameters.
 *
 * <p>Caught by controller methods and mapped to a 400 response via
 * {@link ApiErrors#queryParamError(io.javalin.http.Context, Exception)}.</p>
 */
public class QueryParamException extends Exception {
    /**
     * Constructs a new QueryParamException with the given detail message.
     *
     * @param str a human-readable description of the invalid parameter
     */
    public QueryParamException(String str) {
        super(str);
    }
}
