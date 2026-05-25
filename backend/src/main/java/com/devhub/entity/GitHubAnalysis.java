package com.devhub.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "github_analyses")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GitHubAnalysis {
    
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    @Column(name = "analyzed_at")
    private LocalDateTime analyzedAt;
    
    @Column(name = "total_repos")
    private Integer totalRepos;
    
    @Column(name = "total_commits")
    private Integer totalCommits;
    
    @Column(name = "consistency_score")
    private Integer consistencyScore;
    
    @Column(name = "language_diversity_score")
    private Double languageDiversityScore;
    
    @Column(name = "peak_coding_hour")
    private Integer peakCodingHour;
    
    @Column(name = "peak_coding_day")
    private String peakCodingDay;
    
    @Column(name = "average_commits_per_day")
    private Double averageCommitsPerDay;
    
    @Column(name = "last_30_days_commits")
    private Integer last30DaysCommits;
    
    @Column(name = "last_90_days_commits")
    private Integer last90DaysCommits;
    
    @Column(name = "last_365_days_commits")
    private Integer last365DaysCommits;
    
    @Column(name = "commit_streak_days")
    private Integer commitStreakDays;
    
    @Column(name = "max_streak_days")
    private Integer maxStreakDays;
    
    @Column(name = "status")
    private String status; // analyzing, completed, failed
    
    @Column(name = "error_message")
    private String errorMessage;
    
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        status = "analyzing";
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
