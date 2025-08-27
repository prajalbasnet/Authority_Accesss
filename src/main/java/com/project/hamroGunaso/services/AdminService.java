package com.project.hamroGunaso.services;

import com.project.hamroGunaso.entities.Authority;
import com.project.hamroGunaso.exception.BadRequestException;
import com.project.hamroGunaso.repository.AuthorityRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final AuthorityRepository authorityRepository;

    // Fetch all authorities waiting for identity verification
    public List<Authority> getPendingAuthorities() {
        return authorityRepository.findByIdentityVerifiedFalse();
    }

    // Approve authority
    public void approveAuthority(Long id) {
        Authority authority = authorityRepository.findById(id)
                .orElseThrow(() -> new BadRequestException("Authority not found"));
        authority.setIdentityVerified(true);
        authorityRepository.save(authority);
    }

    // Reject authority (optional)
    public void rejectAuthority(Long id, String reason) {
        Authority authority = authorityRepository.findById(id)
                .orElseThrow(() -> new BadRequestException("Authority not found"));
        authority.setActive(false);
        authorityRepository.save(authority);
        // Optional: send notification to authority with reason
    }
}
