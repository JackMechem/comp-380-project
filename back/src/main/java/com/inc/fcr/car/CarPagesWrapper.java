package com.inc.fcr.car;

import java.util.List;

public record CarPagesWrapper(
    List<Car> cars,
    int currentPage,
    int totalPages,
    long totalItems
) {}
