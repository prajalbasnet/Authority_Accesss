package com.project.hamroGunaso.services;


import com.project.hamroGunaso.ENUM.Role;
import com.project.hamroGunaso.entities.Authority;
import com.project.hamroGunaso.exception.BadRequestException;
import com.project.hamroGunaso.repository.AuthorityRepository;
import com.project.hamroGunaso.requestDTO.AuthorityRegisterRequestDto;

import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;


@Service
@RequiredArgsConstructor
public class AuthorityService {

    private final AuthorityRepository authorityRepository;
    private final BCryptPasswordEncoder passwordEncoder;
    private final FileService fileService;

    // Authority registration
    public Authority registerAuthority(AuthorityRegisterRequestDto dto) {
        if (authorityRepository.findByEmail(dto.getEmail()).isPresent()) {
            throw new BadRequestException("Authority with this email already exists");
        }

        // ✅ only allow images for photos & IDs
        String profilePhoto = fileService.saveImageFile(dto.getProfilePhoto(), "profile");
        String citizenshipFront = fileService.saveImageFile(dto.getCitizenshipFrontImage(), "citizenship");
        String citizenshipBack = fileService.saveImageFile(dto.getCitizenshipBackImage(), "citizenship");
        String idCard = fileService.saveImageFile(dto.getAuthorityIdentityCardImage(), "idcard");

        Authority authority = Authority.builder()
                .fullName(dto.getFullName())
                .email(dto.getEmail())
                .password(passwordEncoder.encode(dto.getPassword()))
                .authorityType(dto.getAuthorityType())
                .citizenshipNumber(dto.getCitizenshipNumber())
                .photo(profilePhoto)
                .citizenshipFrontImage(citizenshipFront)
                .citizenshipBackImage(citizenshipBack)
                .authorityIdentityCardImage(idCard)
                .role(Role.AUTHORITY)
                .build();

        return authorityRepository.save(authority);
    }

    // Optional: Authority fetch own profile
    public Authority getAuthorityById(Long id) {
        return authorityRepository.findById(id)
                .orElseThrow(() -> new BadRequestException("Authority not found"));
    }
}

