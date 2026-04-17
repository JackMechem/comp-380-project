package com.inc.fcr.mail.util;

import com.inc.fcr.mail.Email;
import com.inc.fcr.mail.EmailComposer;
import com.inc.fcr.mail.MailController;

public class WelcomeEmail implements EmailComposer {

    private final String toEmail;
    private final String firstName;

    public WelcomeEmail(String toEmail, String firstName) {
        this.toEmail = toEmail;
        this.firstName = firstName;
    }

    @Override
    public Email toEmail() {
        return new Email.Builder()
                .from(MailController.getDefaultFrom())
                .to(toEmail)
                .subject("Welcome to Fast Car Rentals!")
                .html(buildHtml())
                .text(buildText())
                .build();
    }

    private String buildHtml() {
        String safeFirstName = firstName != null ? firstName : "Customer";

        StringBuilder sb = new StringBuilder();
        sb.append("<div style='font-family: sans-serif; max-width: 600px; margin: auto;'>");
        sb.append("<h2>Welcome to Fast Car Rentals!</h2>");
        sb.append("<p>Hi ").append(safeFirstName).append(",</p>");
        sb.append("<p>We're excited to have you with us!</p>");
        sb.append("<hr/>");
        sb.append("<p>If you have any questions, feel free to contact our support team.</p>");
        sb.append("<p>— Fast Car Rentals</p>");
        sb.append("</div>");
        return sb.toString();
    }

    private String buildText() {
        String safeFirstName = firstName != null ? firstName : "Customer";

        StringBuilder sb = new StringBuilder();
        sb.append("Welcome to Fast Car Rentals!\n\n");
        sb.append("Hi ").append(safeFirstName).append(",\n\n");
        sb.append("We're excited to have you with us.\n");
        sb.append("You can now browse vehicles and make reservations.\n\n");
        sb.append("If you need help, contact our support team.\n\n");
        sb.append("— Fast Car Rentals");
        return sb.toString();
    }
}