package com.project.hamroGunaso.services;

import com.project.hamroGunaso.ENUM.EmailStatus;
import com.project.hamroGunaso.ENUM.IdentityStatus;
import com.project.hamroGunaso.ENUM.OtpPurpose;
import com.project.hamroGunaso.ENUM.Role;
import com.project.hamroGunaso.config.JwtUtil;
import com.project.hamroGunaso.entities.User;
import com.project.hamroGunaso.exception.BadRequestException;
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
                .emailStatus(EmailStatus.PENDING)
                .identityStatus(IdentityStatus.UNVERIFIED)
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
    public ApiResponse<LoginResponseDTO> login(LoginRequestDTO request){
        try {
            // 1. Fetch user by email
            User user = userRepository.findByEmail(request.getEmail())
                    .orElseThrow(() -> new BadRequestException("Email not registered"));

            // 2. Validate password
            if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
                return new ApiResponse<>(false, "Invalid crenditails", null);
            }

            // 3. Validate role
            Role role = user.getRole();
            switch (role) {
                case USER -> {
                    if (user.getEmailStatus() != EmailStatus.VERIFIED) {
                        return new ApiResponse<>(false, "Email is not verified", null);
                    }
                }
                case AUTHORITY -> {
                    if (user.getEmailStatus() != EmailStatus.VERIFIED) {
                        return new ApiResponse<>(false, "Email is not verified", null);
                    }
                    if (user.getIdentityStatus() != IdentityStatus.VERIFIED) {
                        return new ApiResponse<>(false, "Authority identity is not approved", null);
                    }
                }
                case ADMIN -> {} // No restriction
                default -> {
                    return new ApiResponse<>(false, "Unknown role assigned", null);
                }
            }

            // 4. Generate JWT token
            String token = jwtUtil.generateToken(user.getId(), role);

            // 5. Map to DTO
            UserResponseDTO userResponse = UserResponseDTO.builder()
                  
                    .fullName(user.getFullName())
                    .role(user.getRole())
                    .status(user.getIdentityStatus())
                    .build();

            LoginResponseDTO loginResponse = LoginResponseDTO.builder()
                    .user(userResponse)
                    .token(token)
                    .build();

            return new ApiResponse<>(true, "Login successful", loginResponse);

        } catch (BadRequestException ex) {
            // Email not registered
            return new ApiResponse<>(false, ex.getMessage(), null);
        } catch (Exception ex) {
            // Unexpected errors
            return new ApiResponse<>(false, "Internal server error", null);
        }
    }

    }
