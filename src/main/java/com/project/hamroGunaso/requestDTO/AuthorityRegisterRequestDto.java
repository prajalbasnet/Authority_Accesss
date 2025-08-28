package com.project.hamroGunaso.requestDTO;

import com.project.hamroGunaso.ENUM.AuthorityType;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

@Data
public class AuthorityRegisterRequestDto {

    @NotBlank(message = "Full name is required")
    private String fullName;

    @Email(message = "Invalid email format")
    @NotBlank(message = "Email is required")
    private String email;

    @NotBlank(message = "Password is required")
    @Size(min = 6, message = "Password must be at least 6 characters")
    private String password;

    private AuthorityType authorityType;

    @NotBlank(message = "Citizenship number is required")
    private String citizenshipNumber;

    private MultipartFile profilePhoto;
    private MultipartFile citizenshipFrontImage;
    private MultipartFile citizenshipBackImage;
    private MultipartFile authorityIdentityCardImage;
}
