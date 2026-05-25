package com.devhub.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "stack_recommendations")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StackRecommendation {
    
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;
    
    @Column(name = "project_idea", columnDefinition = "TEXT", nullable = false)
    private String projectIdea;
    
    @Column(name = "project_type", nullable = false)
    private String projectType;
    
    @Column(name = "primary_goal", nullable = false)
    private String primaryGoal;
    
    @Column(name = "scale", nullable = false)
    private String scale;
    
    @Column(name = "preferred_languages", columnDefinition = "TEXT")
    private String preferredLanguages; // JSON array stored as string
    
    @Column(name = "budget")
    private String budget;
    
    @Column(name = "frontend_framework")
    private String frontendFramework;
    
    @Column(name = "frontend_language")
    private String frontendLanguage;
    
    @Column(name = "frontend_reasoning", columnDefinition = "TEXT")
    private String frontendReasoning;
    
    @Column(name = "backend_runtime")
    private String backendRuntime;
    
    @Column(name = "backend_framework")
    private String backendFramework;
    
    @Column(name = "backend_language")
    private String backendLanguage;
    
    @Column(name = "backend_reasoning", columnDefinition = "TEXT")
    private String backendReasoning;
    
    @Column(name = "database_primary")
    private String databasePrimary;
    
    @Column(name = "database_cache")
    private String databaseCache;
    
    @Column(name = "database_reasoning", columnDefinition = "TEXT")
    private String databaseReasoning;
    
    @Column(name = "complexity_level")
    private String complexityLevel;
    
    @Column(name = "complexity_reasoning", columnDefinition = "TEXT")
    private String complexityReasoning;
    
    @Column(name = "time_to_first_version")
    private String timeToFirstVersion;
    
    @Column(name = "estimated_days")
    private Integer estimatedDays;
    
    @Column(name = "is_saved")
    private Boolean isSaved;
    
    @Column(name = "saved_project_name")
    private String savedProjectName;
    
    @Column(name = "saved_notes", columnDefinition = "TEXT")
    private String savedNotes;
    
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        isSaved = false;
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
