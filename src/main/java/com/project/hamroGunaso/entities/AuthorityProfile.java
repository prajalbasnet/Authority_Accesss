package com.project.hamroGunaso.entities;

import com.project.hamroGunaso.ENUM.AuthorityType;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "authority_profiles")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder

public class AuthorityProfile {

    @Id
    private Long id; // same as user.id

    @OneToOne
    @MapsId
    private User user;

    @Enumerated(EnumType.STRING)
    private AuthorityType authorityType;  // electricity, water etc.

    private String citizenshipNumber;

    private String photo;
    private String citizenshipFrontImage;
    private String citizenshipBackImage;
    private String authorityIdentityCardImage;
}
