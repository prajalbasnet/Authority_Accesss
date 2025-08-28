package com.project.hamroGunaso.services;

import com.project.hamroGunaso.ENUM.IdentityStatus;
import com.project.hamroGunaso.entities.AuthorityProfile;
import com.project.hamroGunaso.entities.User;
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
    private final NotificationService notificationService;
    private final MailService mailService;

    // ---------------- User KYC ----------------
    public List<UserKYC> getPendingUsersKYC() {
        return userKYCRepository.findByStatus(IdentityStatus.PENDING);
    }

    public void approveUserKYC(Long kycId) {
        UserKYC userKYC = userKYCRepository.findById(kycId)
                .orElseThrow(() -> new BadRequestException("User KYC not found"));

        User user = userKYC.getUser();
        user.setIdentityStatus(IdentityStatus.VERIFIED);
        userKYCRepository.save(userKYC);

        // Notify and Email
        String message = "Your KYC has been approved. You can now access full features.";
        notificationService.sendNotification(user, "KYC Approved", message);
        mailService.sendApprovalEmail(user);
    }

    public void rejectUserKYC(Long kycId, String reason) {
        UserKYC userKYC = userKYCRepository.findById(kycId)
                .orElseThrow(() -> new BadRequestException("User KYC not found"));

        User user = userKYC.getUser();
        user.setIdentityStatus(IdentityStatus.REJECTED);
        userKYCRepository.save(userKYC);

        // Notify and Email
        String message = "Your KYC has been rejected. Reason: " + reason;
        notificationService.sendNotification(user, "KYC Rejected", message);
        mailService.sendRejectionEmail(user, reason);
    }

    // ---------------- Authority ----------------
    public List<AuthorityProfile> getPendingAuthorities() {
        return authorityRepository.findByUser_IdentityStatus(IdentityStatus.PENDING);
    }

    public void approveAuthority(Long id) {
        AuthorityProfile authority = authorityRepository.findById(id)
                .orElseThrow(() -> new BadRequestException("Authority not found"));

        User user = authority.getUser();
        user.setIdentityStatus(IdentityStatus.VERIFIED);
        authorityRepository.save(authority);

        String message = "Your Authority profile has been approved.";
        notificationService.sendNotification(user, "Authority Approved", message);
        mailService.sendApprovalEmail(user);
    }

    public void rejectAuthority(Long id, String reason) {
        AuthorityProfile authority = authorityRepository.findById(id)
                .orElseThrow(() -> new BadRequestException("Authority not found"));

        User user = authority.getUser();
        user.setIdentityStatus(IdentityStatus.REJECTED);
        authorityRepository.save(authority);

        String message = "Your Authority profile has been rejected. Reason: " + reason;
        notificationService.sendNotification(user, "Authority Rejected", message);
        mailService.sendRejectionEmail(user, reason);
    }
}
