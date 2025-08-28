package com.project.hamroGunaso.ENUM;

import lombok.Getter;

@Getter
public enum OtpPurpose {
    VERIFY_EMAIL("Verify your email", "Hi %s,\n\nYour OTP to verify your email is: %s\n\nThis OTP is valid for 5 minutes.\n\nHamroGunaso Security Team"),
    RESET_PASSWORD("Reset your password", "Hi %s,\n\nYour OTP to reset your password is: %s\n\nThis OTP is valid for 5 minutes.\n\nHamroGunaso Security Team");

    private final String subject;
    private final String messageTemplate;

    OtpPurpose(String subject, String messageTemplate) {
        this.subject = subject;
        this.messageTemplate = messageTemplate;
    }

    /**
     * Get formatted message for the user
     * @param username User's full name or username
     * @param otp      Generated OTP
     * @return formatted string for email
     */
    public String getFormattedMessage(String username, String otp) {
        return String.format(this.messageTemplate, username, otp);
    }
}
