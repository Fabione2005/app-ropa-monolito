package com.friapp.users.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "users")
@Getter @Setter @NoArgsConstructor
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, unique = true, length = 255)
    private String email;

    @Column(name = "full_name", nullable = false, length = 255)
    private String fullName;

    @Column(name = "avatar_url", length = 500)
    private String avatarUrl;

    @Column(length = 20)
    private String phone;

    @Column(length = 12, unique = true)
    private String rut;

    @Column(name = "rut_verified", nullable = false)
    private boolean rutVerified = false;

    @Column(length = 100)
    private String region;

    @Column(length = 100)
    private String commune;

    @Column(name = "points_balance", nullable = false)
    private int pointsBalance = 0;

    @Column(name = "rating_avg", nullable = false)
    private double ratingAvg = 0.0;

    @Column(name = "rating_count", nullable = false)
    private int ratingCount = 0;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "password_hash", length = 255)
    private String passwordHash;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
