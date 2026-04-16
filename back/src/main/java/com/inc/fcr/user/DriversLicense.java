package com.inc.fcr.user;

/**
 * Immutable record representing a driver's license stored on a {@link User}.
 *
 * <p>Serialized to JSON and stored in the {@code driversLicense} column of the
 * {@code stripe_users} table via
 * {@link com.inc.fcr.database.Converters.JsonDriversLicenseConverter}.</p>
 *
 * @param driversLicense The license number string (e.g., "D1234567").
 * @param state          The issuing state abbreviation (e.g., "IL").
 * @param expirationDate Unix epoch seconds representing the license expiration date.
 * @param dateOfBirth    Unix epoch seconds representing the license holder's date of birth.
 */
public record DriversLicense(
        String driversLicense,
        String state,
        long expirationDate,
        long dateOfBirth
) {
}
