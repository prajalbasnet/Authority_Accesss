package com.project.hamroGunaso.entities;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

import com.project.hamroGunaso.ENUM.ComplaintCategory;
import com.project.hamroGunaso.ENUM.ComplaintStatus;

@Entity
@Table(name = "complaints")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Complaint {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String transcribedText; // Transcribed complaint

    @Enumerated(EnumType.STRING)
    private ComplaintCategory category;

    @Enumerated(EnumType.STRING)
    private ComplaintStatus status;

    private Integer urgency; // 1-5 scale

    private Double locationLat;
    private Double locationLng;

    @ManyToOne
    @JoinColumn(name = "authority_id")
    private AuthorityProfile authority;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if(status == null) status = ComplaintStatus.PENDING;
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
