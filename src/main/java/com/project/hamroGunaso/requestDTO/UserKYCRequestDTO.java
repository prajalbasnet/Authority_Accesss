package com.project.hamroGunaso.requestDTO;

import lombok.*;
import org.springframework.web.multipart.MultipartFile;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder

public class UserKYCRequestDTO {
    private MultipartFile frontImage;
    private MultipartFile backImage;
    private MultipartFile userPhoto;
}
