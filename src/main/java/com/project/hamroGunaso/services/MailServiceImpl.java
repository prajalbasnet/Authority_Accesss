package com.project.hamroGunaso.services;

import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import com.project.hamroGunaso.ENUM.OtpPurpose;
import com.project.hamroGunaso.entities.User;

import lombok.RequiredArgsConstructor;
import jakarta.mail.internet.MimeMessage;

@Service
@RequiredArgsConstructor
public class MailServiceImpl implements MailService {

    private final JavaMailSender mailSender;

    @Override
    public void sendOtpEmail(User user, String otp, OtpPurpose purpose) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, false, "UTF-8");

            helper.setFrom("HamroGunaso Security <security@hamrogunaso.com>");
            helper.setTo(user.getEmail());
            helper.setSubject(purpose.getSubject());

            // Facebook-style email body
            String emailBody = "<div style=\"font-family:Arial,sans-serif;max-width:600px;margin:auto;padding:20px;border:1px solid #ddd;\">" +
                    "<h2 style=\"color:#4267B2;\">HamroGunaso</h2>" +
                    "<p>Hi <strong>" + user.getFullName() + "</strong>,</p>" +
                    "<p>Your OTP for <strong>" + purpose.getSubject() + "</strong> is:</p>" +
                    "<h1 style=\"color:#333;\">" + otp + "</h1>" +
                    "<p>This OTP is valid for 5 minutes. Please do not share it with anyone.</p>" +
                    "<hr>" +
                    "<p style=\"font-size:12px;color:#999;\">HamroGunaso Security Team</p>" +
                    "</div>";

            helper.setText(emailBody, true); // true = HTML content

            mailSender.send(message);
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Failed to send OTP email to " + user.getEmail());
        }
    }
}
