package com.inc.fcr.mail;

import com.resend.Resend;
import com.resend.services.emails.model.CreateEmailOptions;

/**
 * Sends transactional emails for the FCR rental system using the Resend API.
 *
 * <p>Requires the {@code RESEND_API_KEY} environment variable to be set.
 * The sender address is controlled by {@code MAIL_FROM} (defaults to
 * {@code onboarding@resend.dev} if not set).</p>
 *
 * <p>If {@code RESEND_API_KEY} is absent, email sending is silently skipped
 * and a warning is printed to stderr.</p>
 */
public class MailController {

    /** Resend API key read from the {@code RESEND_API_KEY} environment variable. */
    private static final String API_KEY = System.getenv("RESEND_API_KEY");

    /** Sender email address read from the {@code MAIL_FROM} environment variable. */
    private static final String MAIL_FROM = System.getenv("MAIL_FROM");

    private MailController() {
    }

    public static String getDefaultFrom() {
        return (MAIL_FROM != null && !MAIL_FROM.isBlank())
                ? MAIL_FROM
                : "onboarding@resend.dev";
    }

    public static void send(EmailComposer composer) {
        if (composer == null) {
            throw new IllegalArgumentException("EmailComposer is required");
        }
        send(composer.toEmail());
    }

    public static void send(Email email) {
        if (email == null) {
            throw new IllegalArgumentException("Email is required");
        }

        if (API_KEY == null || API_KEY.isBlank()) {
            System.err.println("Mail: RESEND_API_KEY not set — skipping email");
            return;
        }

        try {
            Resend resend = new Resend(API_KEY);

            CreateEmailOptions.Builder builder = CreateEmailOptions.builder()
                    .from(email.getFrom())
                    .to(email.getTo())
                    .subject(email.getSubject());

            if (email.getHtml() != null && !email.getHtml().isBlank()) {
                builder.html(email.getHtml());
            }

            if (email.getText() != null && !email.getText().isBlank()) {
                builder.text(email.getText());
            }

            resend.emails().send(builder.build());
            System.out.println("Mail: sent to " + email.getTo());

        } catch (Exception e) {
            System.err.println("Mail: failed to send email — " + e.getMessage());
            e.printStackTrace();
        }
    }
}