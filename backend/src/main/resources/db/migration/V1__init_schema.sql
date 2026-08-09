-- =================================================================
-- V1: Initial database schema for telemetry datasets and import logs
-- =================================================================

-- Table for storing telemetry datasets (DSpace Item style metadata)
CREATE TABLE datasets (
    id UUID PRIMARY KEY,
    dspace_item_id VARCHAR(255) UNIQUE,
    title VARCHAR(512) NOT NULL,
    description TEXT,
    status VARCHAR(50) NOT NULL,
    created_at TIMESTAMP
    WITH
        TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP
    WITH
        TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Index for faster lookup by DSpace Item ID
CREATE INDEX idx_datasets_dspace_item_id ON datasets (dspace_item_id);

-- Table for logging validation errors and import stages (provenance)
CREATE TABLE provenance_logs (
    id BIGSERIAL PRIMARY KEY,
    dataset_id UUID REFERENCES datasets (id) ON DELETE CASCADE,
    stage VARCHAR(100) NOT NULL,
    log_level VARCHAR(20) NOT NULL, -- e.g., INFO, WARN, ERROR
    message TEXT NOT NULL,
    details TEXT,
    logged_at TIMESTAMP
    WITH
        TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Index for tracking logs by dataset
CREATE INDEX idx_provenance_logs_dataset_id ON provenance_logs (dataset_id);