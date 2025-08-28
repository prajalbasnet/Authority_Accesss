package com.project.hamroGunaso.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.project.hamroGunaso.entities.Complaint;

public interface ComplaintRepository extends JpaRepository<Complaint, Long> {
	
}
