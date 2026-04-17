package com.inc.fcr.auth;

import jakarta.persistence.*;
import java.time.Instant;

/**
 * JPA entity representing a magic-link login token.
 *
 * <p>Maps to the {@code auth_login_tokens} table. A token is created when a user
 * requests a magic link and is marked verified when they click it. After verification
 * the token acts as a Bearer session credential until {@link #sessionExpiresAt}.</p>
 *
 * <p>The {@code stripe_users} table is not modified — this table only stores the
 * userId foreign key as a plain {@code long}.</p>
 */
@Entity
@Table(name = "auth_login_tokens")
public class LoginToken {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    /** UUID string sent in the magic-link email. */
    @Column(nullable = false, unique = true, length = 36)
    private String token;

    /** ID of the user in {@code stripe_users}. */
    @Column(nullable = false)
    private long userId;

    /** Email address the link was sent to. */
    @Column(nullable = false)
    private String email;

    @Column(nullable = false)
    private Instant createdAt;

    /** When the magic link itself expires (short-lived, e.g. 15 minutes). */
    @Column(nullable = false)
    private Instant expiresAt;

    /** Set when the user clicks the link; {@code null} until then. */
    @Column
    private Instant verifiedAt;

    /** When the session (Bearer token) expires after verification (e.g. 7 days). */
    @Column(nullable = false)
    private Instant sessionExpiresAt;

    /** Required by JPA/Hibernate. */
    public LoginToken() {}

    public long getId() { return id; }

    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }

    public long getUserId() { return userId; }
    public void setUserId(long userId) { this.userId = userId; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }

    public Instant getExpiresAt() { return expiresAt; }
    public void setExpiresAt(Instant expiresAt) { this.expiresAt = expiresAt; }

    public Instant getVerifiedAt() { return verifiedAt; }
    public void setVerifiedAt(Instant verifiedAt) { this.verifiedAt = verifiedAt; }

    public Instant getSessionExpiresAt() { return sessionExpiresAt; }
    public void setSessionExpiresAt(Instant sessionExpiresAt) { this.sessionExpiresAt = sessionExpiresAt; }
}
