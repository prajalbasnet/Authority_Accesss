package com.project.hamroGunaso.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.project.hamroGunaso.ENUM.OtpPurpose;
import com.project.hamroGunaso.entities.OtpToken;
import com.project.hamroGunaso.entities.User;

import java.time.LocalDateTime;

public interface OtpRepository extends JpaRepository<OtpToken, Long> {

    OtpToken findTopByUserAndPurposeOrderByGeneratedAtDesc(User user, OtpPurpose purpose);

    void deleteAllByUserAndPurposeAndExpiresAtBefore(User user, OtpPurpose purpose, LocalDateTime now);
}

