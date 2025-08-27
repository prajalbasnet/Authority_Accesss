package com.project.hamroGunaso.controller;


import com.project.hamroGunaso.responseDTO.ApiResponse;
import com.project.hamroGunaso.services.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;

    // ---------------- User KYC ----------------
    @GetMapping("/users/pending-kyc")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<?>> getPendingUsersKYC() {
        var pending = adminService.getPendingUsersKYC();
        return ResponseEntity.ok(new ApiResponse<>(true, "Pending user KYCs fetched", pending));
    }

    @PostMapping("/users/approve-kyc/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<?>> approveUserKYC(@PathVariable Long id) {
        adminService.approveUserKYC(id);
        return ResponseEntity.ok(new ApiResponse<>(true, "User KYC approved", null));
    }

    @PostMapping("/users/reject-kyc/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<?>> rejectUserKYC(@PathVariable Long id, @RequestParam String reason) {
        adminService.rejectUserKYC(id, reason);
        return ResponseEntity.ok(new ApiResponse<>(true, "User KYC rejected", null));
    }

    // ---------------- Authority ----------------
    @GetMapping("/authorities/pending")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<?>> getPendingAuthorities() {
        var pending = adminService.getPendingAuthorities();
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
