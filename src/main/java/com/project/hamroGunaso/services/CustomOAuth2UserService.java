package com.project.hamroGunaso.services;

import com.project.hamroGunaso.entities.User;
import com.project.hamroGunaso.ENUM.Role;
import com.project.hamroGunaso.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;

@Service
@RequiredArgsConstructor
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

    private final UserRepository userRepository;

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2User oauthUser = super.loadUser(userRequest);

        String email = oauthUser.getAttribute("email");
        User user = userRepository.findByEmail(email)
                .orElseGet(() -> userRepository.save(User.builder()
                        .fullName(oauthUser.getAttribute("name"))
                        .email(email)
                        .password("") // No password for OAuth2
                        .role(Role.USER)
                        .build()));


        return new CustomOAuth2User(user, oauthUser.getAttributes());
    }
}
