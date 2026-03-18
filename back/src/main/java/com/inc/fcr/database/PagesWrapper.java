package com.inc.fcr.database;

public record PagesWrapper(
    Object object,
    int currentPage,
    int totalPages,
    long totalItems
) {}
