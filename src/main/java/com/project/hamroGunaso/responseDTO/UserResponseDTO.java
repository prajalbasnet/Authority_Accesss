package com.project.hamroGunaso.responseDTO;

import com.project.hamroGunaso.ENUM.IdentityStatus;
import com.project.hamroGunaso.ENUM.Role;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserResponseDTO {
	private String fullName;
    private Role role;
    private IdentityStatus status;
}
