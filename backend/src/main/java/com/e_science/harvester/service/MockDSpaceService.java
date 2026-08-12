package com.e_science.harvester.service;

import com.e_science.harvester.model.Dataset;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Service;

import java.util.UUID;
import java.util.logging.Logger;

/**
 * Mock implementation of DSpaceService for development and testing.
 */
@Service
@Profile({ "default", "local", "test" })
public class MockDSpaceService implements DSpaceService {

    private static final Logger LOGGER = Logger.getLogger(MockDSpaceService.class.getName());

    @Value("${dspace.api.base-url:http://localhost-mock}")
    private String dspaceApiBaseUrl;

    public MockDSpaceService() {
        // Default constructor for Mock mode
    }

    @Override
    public String pushToDspace(Dataset dataset, String rawContent) {
        LOGGER.info("[DSpace Mock] Target URL from config: " + dspaceApiBaseUrl);
        LOGGER.info("[DSpace Mock] Preparing to push dataset: " + dataset.getTitle());

        if (rawContent == null || rawContent.isBlank()) {
            throw new IllegalArgumentException("Cannot push empty dataset content to DSpace");
        }

        try {
            Thread.sleep(100);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }

        String mockDspaceHandle = "123456789/" + UUID.randomUUID().toString().substring(0, 8);
        LOGGER.info("[DSpace Mock] Successfully submitted. Assigned DSpace Item ID: " + mockDspaceHandle);

        return mockDspaceHandle;
    }
}