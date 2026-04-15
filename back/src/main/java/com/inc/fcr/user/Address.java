package com.inc.fcr.user;

/**
 * Immutable record representing a physical address stored on a {@link User}.
 *
 * <p>Serialized to JSON and stored in the {@code address} column of the
 * {@code stripe_users} table via {@link com.inc.fcr.database.Converters.JsonAddressConverter}.</p>
 *
 * @param buildingNumber The building/house number (e.g., "123").
 * @param streetName     The street name (e.g., "Main St").
 * @param city           The city name.
 * @param state          The two-letter state abbreviation (e.g., "IL").
 * @param zipCode        The postal/ZIP code.
 */
public record Address(
        String buildingNumber,
        String streetName,
        String city,
        String state,
        String zipCode) {
}
