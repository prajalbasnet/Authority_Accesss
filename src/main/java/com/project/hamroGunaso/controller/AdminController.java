package com.project.hamroGunaso.controller;


import com.project.hamroGunaso.entities.Authority;
import com.project.hamroGunaso.responseDTO.ApiResponse;
import com.project.hamroGunaso.services.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;

    @GetMapping("/authorities/pending")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<?>> getPendingAuthorities() {
        List<Authority> pending = adminService.getPendingAuthorities();
        return ResponseEntity.ok(new ApiResponse<>(true, "Pending authorities fetched", pending));
    }

    @PostMapping("/authorities/approve/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<?>> approveAuthority(@PathVariable Long id) {
        adminService.approveAuthority(id);
        return ResponseEntity.ok(new ApiResponse<>(true, "Authority approved", null));
    }

    @PostMapping("/authorities/reject/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<?>> rejectAuthority(@PathVariable Long id, @RequestParam String reason) {
        adminService.rejectAuthority(id, reason);
        return ResponseEntity.ok(new ApiResponse<>(true, "Authority rejected", null));
    }
}
