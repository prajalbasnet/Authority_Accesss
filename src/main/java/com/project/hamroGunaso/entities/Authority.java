package com.project.hamroGunaso.entities;

import com.project.hamroGunaso.ENUM.AuthorityType;
import com.project.hamroGunaso.ENUM.Role;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "authorities")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Authority {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // common fields (same as User)
    @Column(nullable = false)
    private String fullName;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    @Enumerated(EnumType.STRING)
    private Role role = Role.AUTHORITY;  // fixed role

    // authority specific fields
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AuthorityType authorityType;  // electricity, water etc.

    @Column(nullable = false)
    private String citizenshipNumber;

    private String photo; // profile photo

    // document uploads
    private String citizenshipFrontImage;
    private String citizenshipBackImage;
    private String authorityIdentityCardImage;

    private boolean emailVerified = false;   // after OTP
    private boolean identityVerified = false; // admin approval
    private boolean active = true;
}
