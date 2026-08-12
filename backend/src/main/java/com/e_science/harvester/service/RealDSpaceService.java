package com.e_science.harvester.service;

import com.e_science.harvester.model.Dataset;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.logging.Logger;

/**
 * Production implementation of DSpaceService that performs real HTTP requests
 * to DSpace REST API via WebClient.
 * Activated with 'dspace-prod' profile: SPRING_PROFILES_ACTIVE=dspace-prod
 */
@Service
@Profile("dspace-prod")
public class RealDSpaceService implements DSpaceService {

    private static final Logger LOGGER = Logger.getLogger(RealDSpaceService.class.getName());

    private final WebClient dspaceWebClient;

    public RealDSpaceService(WebClient.Builder webClientBuilder,
            @Value("${dspace.api.base-url}") String baseUrl,
            @Value("${dspace.api.token}") String token) {
        this.dspaceWebClient = webClientBuilder
                .baseUrl(baseUrl)
                .defaultHeader("Authorization", "Bearer " + token)
                .build();
    }

    @Override
    public String pushToDspace(Dataset dataset, String rawContent) {
        LOGGER.info("Publishing dataset to real DSpace repository: " + dataset.getTitle());

        if (rawContent == null || rawContent.isBlank()) {
            throw new IllegalArgumentException("Cannot push empty dataset content to DSpace");
        }

        try {
            // POST request to create an item in a target DSpace collection
            DspaceItemResponse response = dspaceWebClient.post()
                    .uri("/core/collections/{id}/items", dataset.getDspaceCollectionId())
                    .bodyValue(dataset)
                    .retrieve()
                    .bodyToMono(DspaceItemResponse.class)
                    .block();

            if (response != null && response.getHandle() != null) {
                LOGGER.info("Successfully published to DSpace. Handle: " + response.getHandle());
                return response.getHandle();
            } else {
                throw new RuntimeException("Failed to retrieve DSpace Handle from response");
            }

        } catch (Exception e) {
            LOGGER.severe("Error communicating with DSpace REST API: " + e.getMessage());
            throw new RuntimeException("DSpace publication failed", e);
        }
    }

    /**
     * DTO class for mapping DSpace REST API JSON response.
     */
    public static class DspaceItemResponse {
        private String id;
        private String handle;
        private String name;

        public String getId() {
            return id;
        }

        public void setId(String id) {
            this.id = id;
        }

        public String getHandle() {
            return handle;
        }

        public void setHandle(String handle) {
            this.handle = handle;
        }

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }
    }
}