package com.project.hamroGunaso.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.project.hamroGunaso.entities.User;

public interface UserRepository  extends JpaRepository<User, Long>{
  Optional<User> findByEmail(String email);
  Optional<User> findByOauthProviderAndOauthId(String provider, String oauthId);
}
