package com.project.hamroGunaso.repository;

import com.project.hamroGunaso.entities.Authority;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface AuthorityRepository extends JpaRepository<Authority, Long> {
    Optional<Authority> findByEmail(String email);

	List<Authority> findByIdentityVerifiedFalse();
}
