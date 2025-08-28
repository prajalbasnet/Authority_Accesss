package com.project.hamroGunaso.entities;

import com.project.hamroGunaso.ENUM.Role;
import com.project.hamroGunaso.ENUM.EmailStatus;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Full name is required")
    private String fullName;

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    @Column(unique = true, nullable = false)
    private String email;

    private String password; // nullable for OAuth users

    private String oauthProvider; // e.g., "google"
    private String oauthId;       // e.g., Google subject ID

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EmailStatus EmailStatus;

    @Column(updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
}
