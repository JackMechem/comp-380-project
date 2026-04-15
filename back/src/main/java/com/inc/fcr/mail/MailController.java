package com.inc.fcr.mail;

import com.resend.Resend;
import com.resend.services.emails.model.CreateEmailOptions;

public class MailController {

    private static final String API_KEY = System.getenv("RESEND_API_KEY");
    private static final String DEFAULT_FROM = System.getenv("MAIL_FROM") != null
            ? System.getenv("MAIL_FROM")
            : "onboarding@resend.dev";

    public static void sendEmail(Email email) {
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
            System.out.println("Mail: email sent to " + email.getTo());

        } catch (Exception e) {
            System.err.println("Mail: failed to send email — " + e.getMessage());
            e.printStackTrace();
        }
    }

    public static String getDefaultFrom() {
        return DEFAULT_FROM;
    }
}