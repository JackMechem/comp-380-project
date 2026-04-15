package com.inc.fcr.car.enums;

/**
 * Represents the cylinder/motor layout of a vehicle's powertrain.
 *
 * <ul>
 *   <li>{@link #V}            - V-configuration engine (e.g., V6, V8)</li>
 *   <li>{@link #INLINE}       - Inline/straight engine (e.g., I4, I6)</li>
 *   <li>{@link #FLAT}         - Horizontally-opposed (boxer) engine</li>
 *   <li>{@link #SINGLE_MOTOR} - Single electric motor</li>
 *   <li>{@link #DUAL_MOTOR}   - Dual electric motor</li>
 * </ul>
 */
public enum EngineLayout {
    /** V-configuration engine. */
    V,
    /** Inline (straight) engine. */
    INLINE,
    /** Horizontally-opposed (boxer) engine. */
    FLAT,
    /** Single electric motor. */
    SINGLE_MOTOR,
    /** Dual electric motor. */
    DUAL_MOTOR
}
