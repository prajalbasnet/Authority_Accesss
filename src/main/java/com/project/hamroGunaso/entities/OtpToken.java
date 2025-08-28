package com.project.hamroGunaso.entities;
import lombok.*;

import jakarta.persistence.*;
import java.time.LocalDateTime;

import com.project.hamroGunaso.ENUM.OtpPurpose;

@Entity
@Table(name = "otp_table")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OtpToken {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    private String otp;
    private boolean used;
    private LocalDateTime generatedAt;
    private LocalDateTime expiresAt;

    @Enumerated(EnumType.STRING)
    private OtpPurpose purpose;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
}

