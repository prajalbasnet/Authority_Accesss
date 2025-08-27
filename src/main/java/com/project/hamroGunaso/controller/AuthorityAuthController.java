package com.project.hamroGunaso.controller;

import com.project.hamroGunaso.entities.AuthorityProfile;
import com.project.hamroGunaso.requestDTO.AuthorityRegisterRequestDto;
import com.project.hamroGunaso.responseDTO.ApiResponse;
import com.project.hamroGunaso.services.AuthorityService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth/authority")
@RequiredArgsConstructor
public class AuthorityAuthController {

    private final AuthorityService authorityService;

    @PostMapping(value = "/register", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> registerAuthority(@ModelAttribute AuthorityRegisterRequestDto dto) {
        ApiResponse<Map<String, String>> saved = authorityService.registerAuthority(dto);
        return ResponseEntity.ok(saved);
    }

    @GetMapping("/me")
    public ResponseEntity<?> getProfile(Authentication auth) {
        Long authId = Long.parseLong(auth.getName());
        AuthorityProfile auths = authorityService.getAuthorityById(authId);
        return ResponseEntity.ok(new ApiResponse<>(true, "Authority profile fetched", auths));
    }
}
