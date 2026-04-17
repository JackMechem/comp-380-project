package com.inc.fcr.auth;

import com.inc.fcr.mail.MailController;
import com.inc.fcr.user.User;
import com.inc.fcr.utils.HibernateUtil;
import io.javalin.http.BadRequestResponse;
import io.javalin.http.Context;
import io.javalin.http.NotFoundResponse;
import org.hibernate.Session;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Map;
import java.util.UUID;

/**
 * Handles magic-link email authentication.
 *
 * <p>Two endpoints:</p>
 * <ul>
 *   <li>{@code POST /auth/magic-link} — looks up a user by email, creates a
 *       {@link LoginToken}, and emails them a one-time login link.</li>
 *   <li>{@code GET /auth/verify/{token}} — validates the token, marks it
 *       verified, and returns a session credential the client can use as a
 *       {@code Authorization: Bearer} header on subsequent requests.</li>
 * </ul>
 *
 * <p>The {@code stripe_users} table is never modified by this flow.</p>
 */
public class AuthController {

    /** How long the emailed link stays valid. */
    private static final long LINK_TTL_MINUTES = 15;
    /** How long the session (Bearer token) stays valid after verification. */
    private static final long SESSION_TTL_DAYS = 7;

    /**
     * {@code POST /auth/magic-link}
     *
     * <p>Expects a JSON body with an {@code email} field. If the email belongs to a
     * known user a magic link is emailed to them. Always responds {@code 200} so
     * callers cannot enumerate registered addresses.</p>
     *
     * @param ctx the Javalin request context
     */
    public static void requestMagicLink(Context ctx) {
        @SuppressWarnings("unchecked")
        Map<String, Object> body = ctx.bodyAsClass(Map.class);
        Object rawEmail = body.get("email");
        if (rawEmail == null) throw new BadRequestResponse("email is required");
        String email = rawEmail.toString().trim();
        if (email.isBlank()) throw new BadRequestResponse("email is required");

        try (Session session = HibernateUtil.getSessionFactory().openSession()) {
            User user = session.createQuery("FROM User WHERE email = :email", User.class)
                    .setParameter("email", email)
                    .uniqueResult();

            if (user != null) {
                Instant now = Instant.now();
                LoginToken lt = new LoginToken();
                lt.setToken(UUID.randomUUID().toString());
                lt.setUserId(user.getUserId());
                lt.setEmail(email);
                lt.setCreatedAt(now);
                lt.setExpiresAt(now.plus(LINK_TTL_MINUTES, ChronoUnit.MINUTES));
                lt.setSessionExpiresAt(now.plus(SESSION_TTL_DAYS, ChronoUnit.DAYS));

                var tx = session.beginTransaction();
                session.persist(lt);
                tx.commit();

                MailController.sendMagicLink(email, user.getFirstName(), lt.getToken());
            }
        }

        // Always 200 — do not reveal whether the email exists
        ctx.status(200).json(Map.of("message", "If that email is registered, a login link has been sent."));
    }

    /**
     * {@code GET /auth/verify/{token}}
     *
     * <p>Validates the magic-link token: it must exist, not yet be verified, and not
     * be expired. On success it is marked verified and the session credential is
     * returned so the client can authenticate future requests with
     * {@code Authorization: Bearer <token>}.</p>
     *
     * @param ctx the Javalin request context
     * @throws NotFoundResponse if the token is invalid, already used, or expired
     */
    public static void verifyToken(Context ctx) {
        String tokenStr = ctx.pathParam("token");

        try (Session session = HibernateUtil.getSessionFactory().openSession()) {
            LoginToken lt = session.createQuery("FROM LoginToken WHERE token = :token", LoginToken.class)
                    .setParameter("token", tokenStr)
                    .uniqueResult();

            if (lt == null) throw new NotFoundResponse("Invalid or expired token");
            if (lt.getVerifiedAt() != null) throw new NotFoundResponse("Token has already been used");
            if (Instant.now().isAfter(lt.getExpiresAt())) throw new NotFoundResponse("Token has expired");

            var tx = session.beginTransaction();
            lt.setVerifiedAt(Instant.now());
            session.merge(lt);
            tx.commit();

            ctx.status(200).json(Map.of(
                    "token", lt.getToken(),
                    "userId", lt.getUserId(),
                    "sessionExpiresAt", lt.getSessionExpiresAt().toString()
            ));
        }
    }
}
