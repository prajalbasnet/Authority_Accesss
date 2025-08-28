package com.project.hamroGunaso.services;



import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

import java.util.Map;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.project.hamroGunaso.ENUM.Role;
import com.project.hamroGunaso.entities.AuthorityProfile;
import com.project.hamroGunaso.entities.User;
import com.project.hamroGunaso.exception.BadRequestException;
import com.project.hamroGunaso.repository.AuthorityProfileRepository;
import com.project.hamroGunaso.repository.UserRepository;
import com.project.hamroGunaso.requestDTO.AuthorityRegisterRequestDto;
import com.project.hamroGunaso.responseDTO.ApiResponse;

@Service
@RequiredArgsConstructor
public class AuthorityService {

    private final AuthorityProfileRepository authorityRepository;
    private final UserRepository userRepo;
    private final BCryptPasswordEncoder passwordEncoder;
    private final FileService fileService;

    // Authority registration
    @Transactional
    public ApiResponse<Map<String, String>> registerAuthority(AuthorityRegisterRequestDto dto) {
       
    	if (userRepo.findByEmail(dto.getEmail()).isPresent()) {
            throw new BadRequestException("Email already exists");
        }

        // Create user record
        User user = User.builder()
                .fullName(dto.getFullName())
                .email(dto.getEmail())
                .password(passwordEncoder.encode(dto.getPassword()))
                .role(Role.AUTHORITY)
                .build();

        userRepo.save(user);

        // Save authority profile
        AuthorityProfile profile = AuthorityProfile.builder()
                .user(user)
                .authorityType(dto.getAuthorityType())
                .citizenshipNumber(dto.getCitizenshipNumber())
                .photo(fileService.saveImageFile(dto.getProfilePhoto(), "profile"))
                .citizenshipFrontImage(fileService.saveImageFile(dto.getCitizenshipFrontImage(), "citizenship"))
                .citizenshipBackImage(fileService.saveImageFile(dto.getCitizenshipBackImage(), "citizenship"))
                .authorityIdentityCardImage(fileService.saveImageFile(dto.getAuthorityIdentityCardImage(), "idcard"))
                .build();

        authorityRepository.save(profile);

        return new ApiResponse<>(true, "Authority registered successfully. Please verify your email.",
                Map.of("email", user.getEmail()));
    }


    // Optional: Authority fetch own profile
    public AuthorityProfile getAuthorityById(Long id) {
        return authorityRepository.findById(id)
                .orElseThrow(() -> new BadRequestException("Authority not found"));
    }
}

