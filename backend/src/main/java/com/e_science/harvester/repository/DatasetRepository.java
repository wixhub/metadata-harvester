package com.e_science.harvester.repository;

import com.e_science.harvester.model.Dataset;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

/**
 * Repository for managing Dataset entities.
 */
@Repository
public interface DatasetRepository extends JpaRepository<Dataset, UUID> {

    /**
     * Find a dataset by its DSpace Item identifier.
     * 
     * @param dspaceItemId the DSpace item ID
     * @return Optional of Dataset
     */
    Optional<Dataset> findByDspaceItemId(String dspaceItemId);
}