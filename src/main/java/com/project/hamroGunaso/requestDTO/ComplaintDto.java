package com.project.hamroGunaso.requestDTO;

import lombok.*;
import org.springframework.web.multipart.MultipartFile;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class ComplaintDto {
    private String text;
    private MultipartFile voiceClip;   // mp3/wav
    private MultipartFile[] mediaFiles;        // optional
    private Double latitude;
    private Double longitude;
    private String fullAddress;
}
