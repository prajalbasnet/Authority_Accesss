package com.project.hamroGunaso.controller;

import com.project.hamroGunaso.services.AuthorityService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/authorities")
@RequiredArgsConstructor
public class AuthorityController {

    private final AuthorityService authorityService;

    @GetMapping
    public ResponseEntity<?> getAllAuthorities() {
        return ResponseEntity.ok(authorityService.getAllAuthorities());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getAuthorityById(@PathVariable Long id) {
        return ResponseEntity.ok(authorityService.getAuthorityById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateAuthority(@PathVariable Long id, @RequestBody Map<String, Object> updates) {
        return ResponseEntity.ok(authorityService.updateAuthority(id, updates));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteAuthority(@PathVariable Long id) {
        authorityService.deleteAuthority(id);
        return ResponseEntity.ok().build();
    }
}
