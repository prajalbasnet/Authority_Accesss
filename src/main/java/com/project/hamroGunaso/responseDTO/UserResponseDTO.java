package com.project.hamroGunaso.responseDTO;

import com.project.hamroGunaso.ENUM.Role;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserResponseDTO {
    private Long id;
    private String fullName;
    private String email;
    private Role role;
}
