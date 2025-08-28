package com.project.hamroGunaso.services;

import com.project.hamroGunaso.entities.User;
import com.project.hamroGunaso.entities.UserKYC;
import com.project.hamroGunaso.ENUM.IdentityStatus;
import com.project.hamroGunaso.exception.BadRequestException;
import com.project.hamroGunaso.repository.UserKYCRepository;
import com.project.hamroGunaso.repository.UserRepository;
import com.project.hamroGunaso.requestDTO.UserKYCDTO;
import com.project.hamroGunaso.requestDTO.UserKYCRequestDTO;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final UserKYCRepository userKYCRepository;
    private final FileService fileService;

    public UserKYCDTO uploadKYC(Long userId, UserKYCRequestDTO request) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new BadRequestException("User not found"));

        String frontFileName;
        String backFileName;
        String photoFileName;

        try {
            frontFileName = fileService.saveImageFile(request.getFrontImage(), "userkyc/" + userId);
            backFileName = fileService.saveImageFile(request.getBackImage(), "userkyc/" + userId);
            photoFileName = fileService.saveImageFile(request.getUserPhoto(), "userkyc/" + userId);
        } catch (Exception e) {
            throw new BadRequestException("Failed to save KYC images: " + e.getMessage());
        }

        UserKYC userKYC = UserKYC.builder()
                .user(user)
                .documentType("Citizenship")
                .documentFrontImage(frontFileName)
                .documentBackImage(backFileName)
                .userPhoto(photoFileName)
                .status(IdentityStatus.PENDING)
                .submittedAt(LocalDateTime.now())
                .build();

        try {
            userKYCRepository.save(userKYC);
        } catch (Exception e) {
            throw new BadRequestException("Failed to save KYC data: " + e.getMessage());
        }

        return mapToDTO(userKYC);
    }

    private UserKYCDTO mapToDTO(UserKYC userKYC) {
        return UserKYCDTO.builder()
                .id(userKYC.getId())
                .userId(userKYC.getUser().getId())
                .documentType(userKYC.getDocumentType())
                .documentFrontImage(userKYC.getDocumentFrontImage())
                .documentBackImage(userKYC.getDocumentBackImage())
                .userPhoto(userKYC.getUserPhoto())
                .status(userKYC.getStatus())
                .submittedAt(userKYC.getSubmittedAt())
                .verifiedAt(userKYC.getVerifiedAt())
                .build();
    }
}

