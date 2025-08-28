package com.project.hamroGunaso.repository;

import com.project.hamroGunaso.entities.Notification;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

public interface NotificationRepository extends JpaRepository<Notification, Long> {

    Page<Notification> findByUserIdOrderByCreatedAtDesc(Long userId, Pageable pageable);

    Page<Notification> findByUserIdAndIsSeenFalseOrderByCreatedAtDesc(Long userId, Pageable pageable);

    Long countByUserIdAndIsSeenFalse(Long userId);

    @Modifying
    @Transactional
    @Query("UPDATE Notification n SET n.seen = true WHERE n.id IN :ids AND n.user.id = :userId")
    void markAsSeen(List<Long> ids, Long userId);
}
