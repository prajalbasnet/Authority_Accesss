package com.project.hamroGunaso.services;



import com.project.hamroGunaso.ENUM.OtpPurpose;
import com.project.hamroGunaso.entities.User;

public interface MailService {
    /**
     * Send an OTP email to the user according to purpose
     * @param user  : target user
     * @param otp   : generated OTP
     * @param purpose : OTP purpose (VERIFY_EMAIL, RESET_PASSWORD, etc)
     */
    void sendOtpEmail(User user, String otp, OtpPurpose purpose);
}
