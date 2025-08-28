package com.project.hamroGunaso.requestDTO;


import com.project.hamroGunaso.ENUM.IdentityStatus;
import lombok.*;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserKYCDTO {
	private Long id;
    private Long userId;
    private String documentType;
    private String documentFrontImage;
    private String documentBackImage;
    private String userPhoto;
    private IdentityStatus status;
    private LocalDateTime submittedAt;
    private LocalDateTime verifiedAt;
}
