package com.e_science.harvester.model;

import jakarta.persistence.*;
import java.time.OffsetDateTime;
import java.util.UUID;

/**
 * Entity representing telemetry datasets with DSpace Item style identifiers.
 */
@Entity
@Table(name = "datasets")
public class Dataset {

    @Id
    @GeneratedValue
    private UUID id;

    @Column(name = "dspace_item_id", unique = true, length = 255)
    private String dspaceItemId;

    // This field for DSpace target collection ID used in RealDSpaceService
    @Column(name = "dspace_collection_id", length = 255)
    private String dspaceCollectionId;

    @Column(nullable = false, length = 512)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false, length = 50)
    private String status;

    // Format of the ingested metadata (e.g. MOVEBANK_XML, DWC_A, JSON_SCHEMA)
    @Column(length = 50)
    private String format;

    // Total count of telemetry records parsed and validated within the dataset
    @Column(name = "record_count")
    private Integer recordCount;

    @Column(name = "created_at", updatable = false)
    private OffsetDateTime createdAt;

    @Column(name = "updated_at")
    private OffsetDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = OffsetDateTime.now();
        this.updatedAt = OffsetDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = OffsetDateTime.now();
    }

    // Getters and Setters
    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getDspaceItemId() {
        return dspaceItemId;
    }

    public void setDspaceItemId(String dspaceItemId) {
        this.dspaceItemId = dspaceItemId;
    }

    public String getDspaceCollectionId() {
        return dspaceCollectionId;
    }

    public void setDspaceCollectionId(String dspaceCollectionId) {
        this.dspaceCollectionId = dspaceCollectionId;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getFormat() {
        return format;
    }

    public void setFormat(String format) {
        this.format = format;
    }

    public Integer getRecordCount() {
        return recordCount;
    }

    public void setRecordCount(Integer recordCount) {
        this.recordCount = recordCount;
    }

    public OffsetDateTime getCreatedAt() {
        return createdAt;
    }

    public OffsetDateTime getUpdatedAt() {
        return updatedAt;
    }
}