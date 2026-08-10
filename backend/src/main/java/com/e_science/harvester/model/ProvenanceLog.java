package com.e_science.harvester.model;

import jakarta.persistence.*;
import java.time.OffsetDateTime;

/**
 * Entity for logging validation errors and import pipeline stages.
 */
@Entity
@Table(name = "provenance_logs")
public class ProvenanceLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "dataset_id", nullable = true)
    private Dataset dataset;

    @Column(nullable = false, length = 100)
    private String stage;

    @Column(name = "log_level", nullable = false, length = 20)
    private String logLevel;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String message;

    @Column(columnDefinition = "TEXT")
    private String details;

    @Column(name = "logged_at", updatable = false)
    private OffsetDateTime loggedAt;

    @PrePersist
    protected void onCreate() {
        this.loggedAt = OffsetDateTime.now();
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Dataset getDataset() {
        return dataset;
    }

    public void setDataset(Dataset dataset) {
        this.dataset = dataset;
    }

    public String getStage() {
        return stage;
    }

    public void setStage(String stage) {
        this.stage = stage;
    }

    public String getLogLevel() {
        return logLevel;
    }

    public void setLogLevel(String logLevel) {
        this.logLevel = logLevel;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getDetails() {
        return details;
    }

    public void setDetails(String details) {
        this.details = details;
    }

    public OffsetDateTime getLoggedAt() {
        return loggedAt;
    }
}