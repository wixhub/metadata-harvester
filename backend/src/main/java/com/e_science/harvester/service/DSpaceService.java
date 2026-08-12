package com.e_science.harvester.service;

import com.e_science.harvester.model.Dataset;

/**
 * Service interface for integrating and publishing datasets to the DSpace
 * repository.
 */
public interface DSpaceService {

    /**
     * Publishes a validated dataset to the DSpace repository.
     * 
     * @param dataset    the dataset entity to be published
     * @param rawContent the raw file content
     * @return a DSpace Item Handle ID
     */
    String pushToDspace(Dataset dataset, String rawContent);
}