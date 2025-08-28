package com.project.hamroGunaso.services;

import com.project.hamroGunaso.ENUM.EmailStatus;
import com.project.hamroGunaso.ENUM.OtpPurpose;
import com.project.hamroGunaso.config.JwtUtil;
import com.project.hamroGunaso.entities.OtpToken;
import com.project.hamroGunaso.entities.User;
import com.project.hamroGunaso.exception.OtpRateLimitException;
import com.project.hamroGunaso.exception.ResourceNotFoundException;
import com.project.hamroGunaso.repository.OtpRepository;
import com.project.hamroGunaso.repository.UserRepository;
import com.project.hamroGunaso.responseDTO.ApiResponse;
import com.project.hmaroGunaso.util.OtpUtil;

import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class OtpService {

    private final UserRepository userRepo;
    private final OtpRepository otpRepo;
    private final MailService mailService;
    private final JwtUtil jwtUtil;
    private final PasswordEncoder passwordEncoder;

    private ApiResponse<String> buildResponse(boolean success, String message) {
        return ApiResponse.<String>builder()
                .success(success)
                .message(message)
                .data(null)
                .build();
    }	

    @Transactional
    public ApiResponse<String> generateOtpForUsers(String email, OtpPurpose otpPurpose) {
        LocalDateTime now = LocalDateTime.now();
        User user = userRepo.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + email));

        OtpToken latestOtp = otpRepo.findTopByUserAndPurposeOrderByGeneratedAtDesc(user, otpPurpose);
        if (latestOtp != null && Duration.between(latestOtp.getGeneratedAt(), now).getSeconds() < 120) {
            throw new OtpRateLimitException("Please wait before requesting another OTP.");
        }

        String newOtp = OtpUtil.generateRandomOtp(6);

        OtpToken otpToken = OtpToken.builder()
                .otp(newOtp)
                .user(user)
                .purpose(otpPurpose)
                .generatedAt(now)
                .expiresAt(now.plusMinutes(5))
                .used(false)
                .build();

        otpRepo.save(otpToken);
        mailService.sendOtpEmail(user, newOtp, otpPurpose);

        return buildResponse(true, "OTP sent successfully to: " + user.getEmail());
    }

    @Transactional
    public ApiResponse<String> verifyOtp(String email, String otp, OtpPurpose otpPurpose) {
        User user = userRepo.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Email not found: " + email));

        OtpToken latestOtp = otpRepo.findTopByUserAndPurposeOrderByGeneratedAtDesc(user, otpPurpose);
        if (latestOtp == null) {
            return buildResponse(false, "No OTP found for this user");
        }
        if (!latestOtp.getOtp().equals(otp)) return buildResponse(false, "Incorrect OTP");
        if (latestOtp.getExpiresAt().isBefore(LocalDateTime.now())) return buildResponse(false, "OTP expired");
        if (latestOtp.isUsed()) return buildResponse(false, "OTP already used");

        latestOtp.setUsed(true);
        otpRepo.save(latestOtp);

        if (otpPurpose == OtpPurpose.VERIFY_EMAIL) {
            user.setEmailStatus(EmailStatus.VERIFIED);
            userRepo.save(user);
            return buildResponse(true, "Email verified successfully");
        }

        if (otpPurpose == OtpPurpose.RESET_PASSWORD) {
            String resetToken = jwtUtil.generateResetToken(user.getEmail(), user.getRole());
            return ApiResponse.<String>builder()
                    .success(true)
                    .message("Reset token generated")
                    .data(resetToken)
                    .build();
        }

        return buildResponse(false, "Unhandled OTP purpose");
    }

    @Transactional
    public ApiResponse<String> resetPassword(String token, String newPassword) {
        String email;
        try {
            email = jwtUtil.extractRole(token);
        } catch (Exception e) {
            return buildResponse(false, "Reset token is invalid or expired");
        }

        User user = userRepo.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found for token"));

        if (!jwtUtil.validateToken(token, user.getEmail())) {
            return buildResponse(false, "Reset token is invalid or expired");
        }

        user.setPassword(passwordEncoder.encode(newPassword));
        userRepo.save(user);

        return buildResponse(true, "Password reset successfully");
    }
}
