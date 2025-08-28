package com.project.hamroGunaso.services;

import com.project.hamroGunaso.entities.User;
import com.project.hamroGunaso.ENUM.OtpPurpose;

public interface MailService {
    void sendOtpEmail(User user, String otp, OtpPurpose purpose);
    void sendApprovalEmail(User user);   // KYC/Authority approved
    void sendRejectionEmail(User user, String reason); // KYC/Authority rejected
    void sendGeneralEmail(User user, String subject, String content);
}
