package com.project.hamroGunaso.responseDTO;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.Map;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class WebhookPayload {
    private Long userId;
    private Long complaintId;
    private String text;
    private String voiceUrl;   // optional, if you saved file
    private Map<String, Double> location; // {"lat": 27.7, "lng": 85.3}
    private LocalDateTime timestamp;
}
