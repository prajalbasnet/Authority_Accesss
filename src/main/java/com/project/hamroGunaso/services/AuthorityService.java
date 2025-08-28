package com.project.hamroGunaso.services;

import com.project.hamroGunaso.ENUM.Role;
import com.project.hamroGunaso.entities.Authority;
import com.project.hamroGunaso.exception.BadRequestException;
import com.project.hamroGunaso.repository.AuthorityRepository;
import com.project.hamroGunaso.requestDTO.AuthorityRegisterRequestDto;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AuthorityService {

    private final AuthorityRepository authorityRepository;
    private final BCryptPasswordEncoder passwordEncoder;
    private final FileService fileService;

    // -------------------------------
    // Register Authority
    // -------------------------------
    public Authority registerAuthority(AuthorityRegisterRequestDto dto) {
        if (authorityRepository.findByEmail(dto.getEmail()).isPresent()) {
            throw new BadRequestException("Authority with this email already exists");
        }

        // Save images
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

    // -------------------------------
    // Get all authorities
    // -------------------------------
    public List<Authority> getAllAuthorities() {
        return authorityRepository.findAll();
    }

    // -------------------------------
    // Get authority by ID
    // -------------------------------
    public Authority getAuthorityById(Long id) {
        return authorityRepository.findById(id)
                .orElseThrow(() -> new BadRequestException("Authority not found"));
    }

    // -------------------------------
    // Update authority
    // -------------------------------
    public Authority updateAuthority(Long id, Map<String, Object> updates) {
        Authority authority = authorityRepository.findById(id)
                .orElseThrow(() -> new BadRequestException("Authority not found"));

        if (updates.containsKey("fullName")) {
            authority.setFullName((String) updates.get("fullName"));
        }
        if (updates.containsKey("email")) {
            authority.setEmail((String) updates.get("email"));
        }
        if (updates.containsKey("authorityType")) {
            authority.setAuthorityType((String) updates.get("authorityType"));
        }
        if (updates.containsKey("citizenshipNumber")) {
            authority.setCitizenshipNumber((String) updates.get("citizenshipNumber"));
        }
        // Add more fields if needed

        return authorityRepository.save(authority);
    }

    // -------------------------------
    // Delete authority
    // -------------------------------
    public void deleteAuthority(Long id) {
        Authority authority = authorityRepository.findById(id)
                .orElseThrow(() -> new BadRequestException("Authority not found"));
        authorityRepository.delete(authority);
    }
}
