package com.project.hamroGunaso.entities;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

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
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;
    
    @Column(nullable = false, columnDefinition = "TEXT")
    private String transcribedText; // Transcribed complaint

    @Enumerated(EnumType.STRING)
    private ComplaintCategory category;

    @Enumerated(EnumType.STRING)
    private ComplaintStatus status;

    private Integer urgency; // 1-5 scale

    private String voicePath;   // file path to stored voice clip
    private String photoPath;   // if only one photo
    
    // OR for multiple photos
    @ElementCollection
    private List<String> mediaPaths;  // store multiple photo/video file paths


    private Double latitude;
    private Double longitude;
    
    private String fullAddress;
    
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
