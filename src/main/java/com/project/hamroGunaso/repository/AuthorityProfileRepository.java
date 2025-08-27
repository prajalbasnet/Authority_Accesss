package com.project.hamroGunaso.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.project.hamroGunaso.ENUM.IdentityStatus;
import com.project.hamroGunaso.entities.AuthorityProfile;
import com.project.hamroGunaso.entities.User;

import java.util.List;
import java.util.Optional;

@Repository
public interface AuthorityProfileRepository extends JpaRepository<AuthorityProfile, Long> {

    // Fetch by user
    Optional<AuthorityProfile> findByUser(User user);

    // Fetch all authorities whose User has specific identity status
    List<AuthorityProfile> findByUser_IdentityStatus(IdentityStatus status);
}
