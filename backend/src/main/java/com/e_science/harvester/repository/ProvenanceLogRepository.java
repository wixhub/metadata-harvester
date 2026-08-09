package com.e_science.harvester.repository;

import com.e_science.harvester.model.ProvenanceLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

/**
 * Repository for managing ProvenanceLog entities.
 */
@Repository
public interface ProvenanceLogRepository extends JpaRepository<ProvenanceLog, Long> {

    /**
     * Find all logs associated with a specific dataset ID.
     * 
     * @param datasetId the dataset UUID
     * @return List of provenance logs
     */
    List<ProvenanceLog> findByDatasetId(UUID datasetId);
}