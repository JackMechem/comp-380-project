package com.inc.fcr.car.enums;

/**
 * Represents the market/usage class of a vehicle.
 *
 * <p>Used as a filter parameter on the {@code GET /cars} endpoint.</p>
 */
public enum VehicleClass {
    /** Budget-friendly economy vehicles. */
    ECONOMY,
    /** High-end luxury vehicles. */
    LUXURY,
    /** High-performance sports vehicles. */
    PERFORMANCE,
    /** Off-road capable vehicles. */
    OFFROAD,
    /** Full-size vehicles. */
    FULL_SIZE,
    /** Fully electric vehicles. */
    ELECTRIC
}
