package com.project.hamroGunaso.services;

import com.project.hamroGunaso.ENUM.IdentityStatus;
import com.project.hamroGunaso.entities.AuthorityProfile;
import com.project.hamroGunaso.entities.UserKYC;
import com.project.hamroGunaso.exception.BadRequestException;
import com.project.hamroGunaso.repository.AuthorityProfileRepository;
import com.project.hamroGunaso.repository.UserKYCRepository;
import com.project.hamroGunaso.repository.UserRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;


@Service
@RequiredArgsConstructor
public class AdminService {

    private final UserRepository userRepository;
    private final UserKYCRepository userKYCRepository;
    private final AuthorityProfileRepository authorityRepository;

    // ---------------- User KYC ----------------
    public List<UserKYC> getPendingUsersKYC() {
        return userKYCRepository.findByStatus(IdentityStatus.PENDING);
    }

    public void approveUserKYC(Long kycId) {
        UserKYC userKYC = userKYCRepository.findById(kycId)
                .orElseThrow(() -> new BadRequestException("User KYC not found"));
        userKYC.getUser().setIdentityStatus(IdentityStatus.VERIFIED);
        userKYCRepository.save(userKYC); // cascade updates user
        // Optional: send notification
    }

    public void rejectUserKYC(Long kycId, String reason) {
        UserKYC userKYC = userKYCRepository.findById(kycId)
                .orElseThrow(() -> new BadRequestException("User KYC not found"));
        userKYC.getUser().setIdentityStatus(IdentityStatus.REJECTED);
        userKYCRepository.save(userKYC);
        // Optional: send notification with reason
    }

    // ---------------- Authority ----------------
    public List<AuthorityProfile> getPendingAuthorities() {
        return authorityRepository.findByUser_IdentityStatus(IdentityStatus.PENDING);
    }

    public void approveAuthority(Long id) {
        AuthorityProfile authorityProfile = authorityRepository.findById(id)
                .orElseThrow(() -> new BadRequestException("Authority not found"));
        authorityProfile.getUser().setIdentityStatus(IdentityStatus.VERIFIED);
        authorityRepository.save(authorityProfile);
        // Optional: send notification
    }

    public void rejectAuthority(Long id, String reason) {
        AuthorityProfile authorityProfile = authorityRepository.findById(id)
                .orElseThrow(() -> new BadRequestException("Authority not found"));
        authorityProfile.getUser().setIdentityStatus(IdentityStatus.REJECTED);
        authorityRepository.save(authorityProfile);
        // Optional: send notification with reason
    }
}


