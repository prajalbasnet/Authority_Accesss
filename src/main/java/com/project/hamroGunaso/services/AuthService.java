package com.project.hamroGunaso.services;

import com.project.hamroGunaso.ENUM.EmailStatus;
import com.project.hamroGunaso.ENUM.OtpPurpose;
import com.project.hamroGunaso.ENUM.Role;
import com.project.hamroGunaso.config.JwtUtil;
import com.project.hamroGunaso.entities.User;
import com.project.hamroGunaso.exception.BadRequestException;
import com.project.hamroGunaso.exception.ResourceNotFoundException;
import com.project.hamroGunaso.repository.UserRepository;
import com.project.hamroGunaso.requestDTO.*;
import com.project.hamroGunaso.responseDTO.ApiResponse;
import com.project.hamroGunaso.responseDTO.LoginResponseDTO;
import com.project.hamroGunaso.responseDTO.UserResponseDTO;

import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Map;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final OtpService otpService;

    /**
     * Register new user
     */
    @Transactional
    public ApiResponse<Map<String, String>> register(RegisterRequestDTO request) {

        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new BadRequestException("Email already exists");
        }

        User user = User.builder()
                .fullName(request.getFullName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(Role.USER)
                .EmailStatus(EmailStatus.PENDING)
                .build();

        userRepository.save(user);

        // Send verification OTP after registration
        otpService.generateOtpForUsers(user.getEmail(), OtpPurpose.VERIFY_EMAIL);

        return new ApiResponse<>(true,
                "User registered successfully. Please verify your email.",
                Map.of("email", user.getEmail()));
    }

    /**
     * Login user
     */
    @Transactional(readOnly = true)
    public ApiResponse<LoginResponseDTO> login(LoginRequestDTO request) {

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new BadRequestException("Invalid credentials");
        }

        // Email verification check
        if (user.getEmailStatus() != EmailStatus.VERIFIED) {
            throw new BadRequestException("Please verify your email before logging in");
        }

        String token = jwtUtil.generateToken(user.getEmail(), user.getRole());

        LoginResponseDTO loginResponse = LoginResponseDTO.builder()
                .token(token)
                .user(UserResponseDTO.builder()
                        .id(user.getId())
                        .fullName(user.getFullName())
                        .email(user.getEmail())
                        .role(user.getRole())
                        .build())
                .build();

        return new ApiResponse<>(true, "Login successful", loginResponse);
    }
}
