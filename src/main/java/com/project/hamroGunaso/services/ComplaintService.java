package com.project.hamroGunaso.services;

import com.project.hamroGunaso.entities.Complaint;
import com.project.hamroGunaso.entities.User;
import com.project.hamroGunaso.exception.BadRequestException;
import com.project.hamroGunaso.repository.ComplaintRepository;
import com.project.hamroGunaso.repository.UserRepository;
import com.project.hamroGunaso.requestDTO.ComplaintDto;
import com.project.hamroGunaso.responseDTO.ApiResponse;
import com.project.hamroGunaso.responseDTO.WebhookPayload;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
@Service
@RequiredArgsConstructor
@Slf4j
public class ComplaintService {

    private final ComplaintRepository complaintRepository;
    private final WebhookService webhookService;
    private final FileService fileService;
    private final UserRepository userRepository;

    public ApiResponse<Complaint> saveComplaint(Long userId, ComplaintDto dto) {
     
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new IllegalArgumentException("User not found"));

            String voicePath = null;
            if (dto.getVoiceClip() != null && !dto.getVoiceClip().isEmpty()) {
                voicePath = fileService.saveAudioFile(dto.getVoiceClip(), "complaints/voice");
            }
            
            List<String> savedMediaPaths = new ArrayList<>();
            if (dto.getMediaFiles() != null && dto.getMediaFiles().length > 0) {
                for (MultipartFile file : dto.getMediaFiles()) {
                    if (!file.isEmpty()) {
                        String filePath;
                        String contentType = file.getContentType();
                        if (contentType.startsWith("image/")) {
                            filePath = fileService.saveImageFile(file, "complaints/media");
                        } else if (contentType.startsWith("video/")) {
                            filePath = fileService.saveVideoFile(file, "complaints/media");
                        } else {
                            throw new BadRequestException("Unsupported media type: " + contentType);
                        }
                        savedMediaPaths.add(filePath);
                    }
                }
            }


            Complaint complaint = Complaint.builder()
                    .transcribedText(dto.getText())
                    .voicePath(voicePath)
                    .mediaPaths(savedMediaPaths)
                    .latitude(dto.getLatitude())
                    .longitude(dto.getLongitude())
                    .fullAddress(dto.getFullAddress())
                    .user(user)
                    .createdAt(LocalDateTime.now())
                    .build();

            Complaint saved = complaintRepository.save(complaint);

            // webhook send safe
            try {
                WebhookPayload payload = buildWebhookPayload(saved, user);
                webhookService.sendComplaintWebhook(payload);
            } catch (Exception ex) {
                log.error("Webhook push failed for complaint {}: {}", saved.getId(), ex.getMessage());
            }

            return ApiResponse.<Complaint>builder()
                    .success(true)
                    .message("Complaint registered successfully")
                    .data(saved)
                    .build();
    }

    private WebhookPayload buildWebhookPayload(Complaint saved, User user) {
        WebhookPayload payload = new WebhookPayload();
        payload.setUserId(user.getId());
        payload.setComplaintId(saved.getId());
        payload.setText(saved.getTranscribedText());
        payload.setVoiceUrl(saved.getVoicePath());
        Map<String, Double> loc = new HashMap<>();
        loc.put("lat", saved.getLatitude());
        loc.put("lng", saved.getLongitude());
        payload.setLocation(loc);
        payload.setTimestamp(saved.getCreatedAt());
        return payload;
    }
}
