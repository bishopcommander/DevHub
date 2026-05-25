package com.devhub.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {
    
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    
    @Column(unique = true, nullable = false)
    private Long githubId;
    
    @Column(unique = true, nullable = false)
    private String githubUsername;
    
    private String githubName;
    private String githubAvatarUrl;
    private String githubBio;
    private String githubCompany;
    private String githubLocation;
    private String githubBlog;
    
    @Column(name = "github_public_repos")
    private Integer publicRepos;
    
    @Column(name = "github_followers")
    private Integer followers;
    
    @Column(name = "github_following")
    private Integer following;
    
    @Column(name = "github_access_token", length = 512)
    private String accessToken;
    
    @Column(name = "token_expires_at")
    private LocalDateTime tokenExpiresAt;
    
    private String email;
    
    @Column(name = "is_active")
    private Boolean isActive;
    
    @Column(name = "last_login")
    private LocalDateTime lastLogin;
    
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        isActive = true;
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
