package com.inc.fcr.car.enums;

/**
 * Represents the fuel/energy source of a vehicle.
 *
 * <p>Used as a filter parameter on the {@code GET /cars} endpoint.</p>
 */
public enum FuelType {
    /** Gasoline/petrol powered. */
    GASOLINE,
    /** Diesel powered. */
    DIESEL,
    /** Fully electric. */
    ELECTRIC,
    /** Hybrid gasoline-electric. */
    HYBRID
}
