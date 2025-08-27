package com.project.hamroGunaso.controller;

import com.project.hamroGunaso.requestDTO.UserKYCDTO;
import com.project.hamroGunaso.requestDTO.UserKYCRequestDTO;
import com.project.hamroGunaso.responseDTO.ApiResponse;

import com.project.hamroGunaso.services.UserService;
import lombok.RequiredArgsConstructor;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @PostMapping(value = "/kyc", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<UserKYCDTO>> uploadKYC(Authentication auth,
                                                              @ModelAttribute UserKYCRequestDTO dto) {
        Long userId = Long.parseLong(auth.getName()); // NumberFormatException auto-handled
        UserKYCDTO responseDTO = userService.uploadKYC(userId, dto);
        return ResponseEntity.ok(ApiResponse.<UserKYCDTO>builder()
                .success(true)
                .message("KYC submitted successfully. Pending verification.")
                .data(responseDTO)
                .build());
    }

}
