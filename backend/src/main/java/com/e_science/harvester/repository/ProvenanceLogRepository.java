package com.e_science.harvester.repository;

import com.e_science.harvester.model.ProvenanceLog;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

/**
 * Repository for managing ProvenanceLog entities.
 */
public interface ProvenanceLogRepository extends JpaRepository<ProvenanceLog, Long> {

    /**
     * Find all logs associated with a specific dataset ID.
     * 
     * @param datasetId the dataset ID (Long)
     * @return List of provenance logs
     */
    List<ProvenanceLog> findByDatasetId(Long datasetId);

    /**
     * Count logs by their severity level (e.g., 'ERROR' for failed validations).
     * 
     * @param logLevel the log level string (INFO, ERROR, etc.)
     * @return count of matching logs
     */
    long countByLogLevel(String logLevel);
}