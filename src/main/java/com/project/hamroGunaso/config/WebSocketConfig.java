package com.project.hamroGunaso.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.*;

//WebSocket Config
@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

 @Override
 public void configureMessageBroker(MessageBrokerRegistry registry) {
     registry.enableSimpleBroker("/topic", "/queue"); // topic = broadcast, queue = private
     registry.setUserDestinationPrefix("/user");      // /user/queue/...
     registry.setApplicationDestinationPrefixes("/app");
 }

 @Override
 public void registerStompEndpoints(StompEndpointRegistry registry) {
     registry.addEndpoint("/ws").setAllowedOrigins("*").withSockJS();
 }
}

