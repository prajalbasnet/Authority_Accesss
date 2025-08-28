package com.project.hamroGunaso.controller;

import com.project.hamroGunaso.requestDTO.*;
import com.project.hamroGunaso.responseDTO.ApiResponse;
import com.project.hamroGunaso.services.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @Operation(summary = "Register a new user",
               description = "Registers a new user with default USER role and sends OTP for email verification")
    @PostMapping("/register")
    public ResponseEntity<ApiResponse<?>> register(@Valid @RequestBody RegisterRequestDTO request) {
        ApiResponse<?> response = authService.register(request);
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "Login user",
               description = "Login with email and password to receive JWT token (email must be verified)")
    @PostMapping("/login")
    public ResponseEntity<ApiResponse<?>> login(@Valid @RequestBody LoginRequestDTO request) {
        ApiResponse<?> response = authService.login(request);
        return ResponseEntity.ok(response);
    }
}
