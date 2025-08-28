package com.project.hamroGunaso.controller;

import com.project.hamroGunaso.requestDTO.TextForwardRequestDto;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/webhook-forward")
public class WebhookForwardController {
    private static final Logger logger = LoggerFactory.getLogger(WebhookForwardController.class);
    private static final String WEBHOOK_URL = "http://localhost:5678/webhook-test/d952287b-710e-4611-9049-2fa1edd0bb5f";

    @Autowired
    private RestTemplate restTemplate;

    /**
     * Receives text from frontend and forwards it to the webhook.
     * Returns a JSON response with status and message.
     */
    @PostMapping
    public ResponseEntity<Map<String, Object>> forwardText(@RequestBody TextForwardRequestDto requestDto) {
        Map<String, Object> responseMap = new HashMap<>();
        try {
            logger.info("Received text to forward: {}", requestDto.getText());
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            HttpEntity<TextForwardRequestDto> entity = new HttpEntity<>(requestDto, headers);

            ResponseEntity<String> response = restTemplate.postForEntity(WEBHOOK_URL, entity, String.class);
            logger.info("Webhook response status: {}", response.getStatusCode());
            logger.info("Webhook response body: {}", response.getBody());

            String responseBody = response.getBody();
            if (responseBody == null || responseBody.trim().isEmpty()) {
                responseBody = "Forwarded successfully";
            }
            responseMap.put("status", "success");
            responseMap.put("message", responseBody);
            responseMap.put("webhookStatus", response.getStatusCode().value());
            return ResponseEntity.status(response.getStatusCode()).body(responseMap);
        } catch (Exception e) {
            logger.error("Error forwarding to webhook: {}", e.getMessage(), e);
            responseMap.put("status", "error");
            responseMap.put("message", "Failed to forward: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(responseMap);
        }
    }
}
