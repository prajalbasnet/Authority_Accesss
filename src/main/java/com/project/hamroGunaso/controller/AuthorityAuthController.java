package com.project.hamroGunaso.controller;


import com.project.hamroGunaso.entities.Authority;
import com.project.hamroGunaso.requestDTO.AuthorityRegisterRequestDto;
import com.project.hamroGunaso.responseDTO.ApiResponse;
import com.project.hamroGunaso.services.AuthorityService;

import org.springframework.http.MediaType;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth/authority")
@RequiredArgsConstructor

public class AuthorityAuthController {

    private final AuthorityService authorityService;

    // Authority registration
    @PostMapping(value = "/register", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> registerAuthority(@ModelAttribute AuthorityRegisterRequestDto dto) {
        Authority saved = authorityService.registerAuthority(dto);
        return ResponseEntity.ok(new ApiResponse<>(true, "Authority registered successfully", saved));
    }


    // Fetch own profile (optional)
    @GetMapping("/me")
    public ResponseEntity<?> getProfile(Authentication auth) {
    	Long authId = Long.parseLong(auth.getName());
        Authority auths = authorityService.getAuthorityById(authId);
        return ResponseEntity.ok(new ApiResponse<>(true, "Authority profile fetched", auths));
    }
}
