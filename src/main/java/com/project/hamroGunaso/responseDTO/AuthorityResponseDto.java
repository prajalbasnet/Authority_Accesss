package com.project.hamroGunaso.responseDTO;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor

public class AuthorityResponseDto {
    private Long id;
    private String fullName;
    private String email;
    private String authorityType;
    private boolean verified;

}
