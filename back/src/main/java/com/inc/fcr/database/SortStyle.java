package com.inc.fcr.database;

/**
 * Represents the sort direction used when querying paginated results.
 *
 * <p>Controlled by the {@code sortDir} query parameter (values: {@code asc}, {@code desc}).</p>
 */
public enum SortStyle {
    /** Sort results from lowest to highest. */
    ASCENDING,
    /** Sort results from highest to lowest. */
    DESCENDING
}
