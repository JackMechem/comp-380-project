package com.inc.fcr.payment;

/**
 * Represents the method of payment used for a reservation.
 *
 * <p>Stripe-initiated payments are recorded as {@link #CREDIT}.
 * Other types support manual or internal payment workflows.</p>
 */
public enum PaymentType {
    /** Cash payment. */
    CASH,
    /** Credit card payment (default for Stripe-processed payments). */
    CREDIT,
    /** Debit card payment. */
    DEBIT,
    /** Check payment. */
    CHECK,
    /** Internal service/comp payment. */
    SERVICE,
    /** Invoice-based payment. */
    INVOICE
}