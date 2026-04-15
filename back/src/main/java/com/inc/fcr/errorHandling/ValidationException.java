package com.inc.fcr.errorHandling;

/**
 * Thrown when entity data fails validation in a setter or business-logic check.
 *
 * <p>Caught by controller methods and mapped to a 400 response via
 * {@link ApiErrors#formatError(io.javalin.http.Context, Exception)},
 * or to a 404 response in delete handlers when the entity is not found.</p>
 */
public class ValidationException extends Exception {
    /**
     * Constructs a new ValidationException with the given detail message.
     *
     * @param str a human-readable description of the validation failure
     */
    public ValidationException(String str) {
        super(str);
    }
}
