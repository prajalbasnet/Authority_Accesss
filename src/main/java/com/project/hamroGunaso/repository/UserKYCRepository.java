package com.project.hamroGunaso.repository;

import com.project.hamroGunaso.entities.User;
import com.project.hamroGunaso.entities.UserKYC;
import com.project.hamroGunaso.ENUM.IdentityStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserKYCRepository extends JpaRepository<UserKYC, Long> {

    // Check if a user has at least one verified KYC
    boolean existsByUserAndStatus(User user, IdentityStatus status);

    // Get all KYCs for a user
    List<UserKYC> findByUser(User user);

    // Get all KYCs by status (for admin review)
    List<UserKYC> findByStatus(IdentityStatus status);
}
