package com.inc.fcr.database;

/**
 * Immutable record wrapping a paginated query result.
 *
 * <p>Returned by all {@code getAll} endpoints to provide pagination metadata
 * alongside the actual result data.</p>
 *
 * @param data        The page of results — either a {@code List} of entities or
 *                    a {@code List<Map<String, Object>>} when field selection is active.
 * @param currentPage The 1-based index of the current page.
 * @param totalPages  The total number of pages available for the current query.
 * @param totalItems  The total number of matching records across all pages.
 */
public record PagesWrapper(
    Object data,
    int currentPage,
    int totalPages,
    long totalItems
) {}
