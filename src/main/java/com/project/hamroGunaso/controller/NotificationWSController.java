package com.project.hamroGunaso.controller;

import com.project.hamroGunaso.entities.Notification;
import com.project.hamroGunaso.services.NotificationService;
import lombok.RequiredArgsConstructor;

import java.security.Principal;
import java.util.List;
import java.util.Map;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.simp.annotation.SendToUser;
import org.springframework.stereotype.Controller;



@Controller
@RequiredArgsConstructor
public class NotificationWSController {
 private final NotificationService notificationService;
 private final SimpMessagingTemplate messagingTemplate;

 @MessageMapping("/notifications/fetch")
 @SendToUser("/queue/notifications")
 public List<Notification> fetchNotifications(Principal principal) {
     Long userId = Long.parseLong(principal.getName());
     return notificationService.getNotifications(userId);
 }

 @MessageMapping("/notifications/seen")
 public void markAsSeen(List<Long> ids, Principal principal) {
     Long userId = Long.parseLong(principal.getName());
     notificationService.markAsSeen(ids, userId);

     messagingTemplate.convertAndSendToUser(
             userId.toString(),
             "/queue/notifications",
             Map.of("type", "SEEN_UPDATED", "ids", ids)
     );
 }
}

