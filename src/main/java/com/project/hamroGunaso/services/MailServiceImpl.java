package com.project.hamroGunaso.services;

import com.project.hamroGunaso.entities.User;
import com.project.hamroGunaso.ENUM.OtpPurpose;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

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

            String body = "<p>Hi " + user.getFullName() + ",</p>" +
                    "<p>Your OTP is: <strong>" + otp + "</strong></p>" +
                    "<p>Valid for 5 minutes.</p>";

            helper.setText(body, true);
            mailSender.send(message);
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Failed to send OTP email to " + user.getEmail());
        }
    }

    @Override
    public void sendApprovalEmail(User user) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, false, "UTF-8");

            helper.setFrom("HamroGunaso Team <no-reply@hamrogunaso.com>");
            helper.setTo(user.getEmail());
            helper.setSubject("Your KYC/Authority Profile is Verified – You Can Login");

            String body = "<p>Hi " + user.getFullName() + ",</p>" +
                    "<p>Congratulations! Your KYC/Authority profile has been successfully verified.</p>" +
                    "<p><a href='https://hamrogunaso.com/login' style='padding:10px 20px;background:#4267B2;color:white;text-decoration:none;'>Login Now</a></p>" +
                    "<p>HamroGunaso Team</p>";

            helper.setText(body, true);
            mailSender.send(message);
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Failed to send approval email to " + user.getEmail());
        }
    }

    @Override
    public void sendRejectionEmail(User user, String reason) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, false, "UTF-8");

            helper.setFrom("HamroGunaso Team <no-reply@hamrogunaso.com>");
            helper.setTo(user.getEmail());
            helper.setSubject("Your KYC/Authority Profile was Rejected");

            String body = "<p>Hi " + user.getFullName() + ",</p>" +
                    "<p>Unfortunately, your KYC/Authority profile has been rejected.</p>" +
                    "<p>Reason: <strong>" + reason + "</strong></p>" +
                    "<p>Please re-submit your documents correctly.</p>" +
                    "<p>HamroGunaso Team</p>";

            helper.setText(body, true);
            mailSender.send(message);
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Failed to send rejection email to " + user.getEmail());
        }
    }

    @Override
    public void sendGeneralEmail(User user, String subject, String content) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, false, "UTF-8");

            helper.setFrom("HamroGunaso Team <no-reply@hamrogunaso.com>");
            helper.setTo(user.getEmail());
            helper.setSubject(subject);
            helper.setText(content, true);

            mailSender.send(message);
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Failed to send email to " + user.getEmail());
        }
    }
}
