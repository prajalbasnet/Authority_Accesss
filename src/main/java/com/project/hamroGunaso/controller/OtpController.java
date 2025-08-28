
package com.project.hamroGunaso.controller;

import com.project.hamroGunaso.ENUM.OtpPurpose;
import com.project.hamroGunaso.requestDTO.EmailDto;
import com.project.hamroGunaso.requestDTO.OtpVerifyDto;
import com.project.hamroGunaso.requestDTO.PasswordResetDto;
import com.project.hamroGunaso.responseDTO.ApiResponse;
import com.project.hamroGunaso.services.OtpService;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/otp")
@RequiredArgsConstructor
public class OtpController {

    // Utility method to ensure non-empty ApiResponse
    private ResponseEntity<ApiResponse<?>> nonEmptyApiResponse(ApiResponse<?> body, int status) {
        if (body == null) {
            body = ApiResponse.builder()
                    .success(true)
                    .message("Operation completed")
                    .data(null)
                    .build();
        }
        return ResponseEntity.status(status).body(body);
    }

    private final OtpService otpService;

    @Operation(summary = "Send OTP to user email for VERIFY_EMAIL or RESET_PASSWORD")
    @PostMapping("/send/{purpose}")
    public ResponseEntity<ApiResponse<?>> sendOtp(
            @PathVariable String purpose,
            @Valid @RequestBody EmailDto dto) {

        OtpPurpose otpPurpose;
        try {
            otpPurpose = OtpPurpose.valueOf(purpose.toUpperCase());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.<String>builder()
                            .success(false)
                            .message("Invalid OTP purpose: " + purpose)
                            .data(null)
                            .build());
        }

        ApiResponse<?> resp = otpService.generateOtpForUsers(dto.getEmail(), otpPurpose);
        return nonEmptyApiResponse(resp, 200);
    }

    @Operation(summary = "Verify OTP sent to user email")
    @PostMapping("/verify/{purpose}")
    public ResponseEntity<ApiResponse<?>> verifyOtp(
            @PathVariable String purpose,
            @Valid @RequestBody OtpVerifyDto dto) {

        OtpPurpose otpPurpose;
        try {
            otpPurpose = OtpPurpose.valueOf(purpose.toUpperCase());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.<String>builder()
                            .success(false)
                            .message("Invalid OTP purpose: " + purpose)
                            .data(null)
                            .build());
        }

        ApiResponse<?> resp = otpService.verifyOtp(dto.getEmail(), dto.getOtp(), otpPurpose);
        return nonEmptyApiResponse(resp, 200);
    }

    @Operation(summary = "Reset password after OTP verification using reset token")
    @PostMapping("/reset-password")
    public ResponseEntity<ApiResponse<?>> resetPassword(
            @Valid @RequestBody PasswordResetDto dto) {

        ApiResponse<?> resp = otpService.resetPassword(dto.getToken(), dto.getNewPassword());
        return nonEmptyApiResponse(resp, 200);
    }
}
