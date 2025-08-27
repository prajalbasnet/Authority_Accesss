package com.project.hamroGunaso.entities;

import com.project.hamroGunaso.ENUM.IdentityStatus;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "user_kyc")
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserKYC {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Link to User
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    
    private String documentType;

    // URLs for uploaded files
    private String documentFrontImage;    // front side of citizenship
    private String documentBackImage;     // back side of citizenship
    private String userPhoto;             // user’s photo if required

    // Verification status
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private IdentityStatus status; 

    // Audit fields
    private LocalDateTime submittedAt = LocalDateTime.now();
    private LocalDateTime verifiedAt;
}
