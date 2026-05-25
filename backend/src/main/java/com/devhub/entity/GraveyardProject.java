package com.devhub.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "graveyard_projects")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GraveyardProject {
    
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    @Column(name = "project_name", nullable = false)
    private String projectName;
    
    @Column(name = "description", columnDefinition = "TEXT")
    private String description;
    
    @Column(name = "language")
    private String language;
    
    @Column(name = "github_url")
    private String githubUrl;
    
    @Column(name = "project_type")
    private String projectType; // side-project, work, learning
    
    @Column(name = "start_date", nullable = false)
    private LocalDate startDate;
    
    @Column(name = "end_date", nullable = false)
    private LocalDate endDate;
    
    @Column(name = "hours_spent")
    private Integer hoursSpent;
    
    @Column(name = "status", nullable = false)
    private String status; // abandoned, active, completed
    
    @Column(name = "revived_at")
    private LocalDateTime revivedAt;
    
    @Column(name = "revive_count")
    private Integer reviveCount;
    
    @Column(name = "reflection_notes", columnDefinition = "TEXT")
    private String reflectionNotes;
    
    @Column(name = "lessons_learned", columnDefinition = "TEXT")
    private String lessonsLearned;
    
    @Column(name = "what_i_would_do_differently", columnDefinition = "TEXT")
    private String whatIWouldDoDifferently;
    
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    @Column(name = "archived_at")
    private LocalDateTime archivedAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        status = "abandoned";
        reviveCount = 0;
        hoursSpent = 0;
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
    
    public Integer getDurationDays() {
        return (int) java.time.temporal.ChronoUnit.DAYS.between(startDate, endDate);
    }
}
