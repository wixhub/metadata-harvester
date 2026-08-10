package com.e_science.harvester.service;

import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;

/**
 * Validator component to ensure uploaded scientific datasets meet
 * structural requirements (Movebank / Darwin Core standards) before ingestion.
 */
@Component
public class DatasetValidator {

    /**
     * Validates the uploaded file content to prevent empty or malformed datasets
     * from entering the database and DSpace repository.
     *
     * @param file the multipart file uploaded by the user
     * @throws IllegalArgumentException if the file is invalid or lacks required
     *                                  telemetry data
     */
    public void validateDatasetFile(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("Validation failed: The uploaded file is empty.");
        }

        String filename = file.getOriginalFilename();
        if (filename == null) {
            throw new IllegalArgumentException("Validation failed: Invalid file name.");
        }

        try {
            String content = readFileContent(file);

            if (filename.endsWith(".xml")) {
                validateXmlContent(content);
            } else if (filename.endsWith(".json")) {
                validateJsonContent(content);
            } else {
                throw new IllegalArgumentException(
                        "Validation failed: Unsupported file format (.txt or other unsupported types).");
            }

        } catch (IOException e) {
            throw new IllegalArgumentException("Validation failed: Could not read file content.", e);
        }
    }

    /**
     * Reads the text content from the uploaded MultipartFile.
     */
    private String readFileContent(MultipartFile file) throws IOException {
        StringBuilder sb = new StringBuilder();
        try (BufferedReader reader = new BufferedReader(
                new InputStreamReader(file.getInputStream(), StandardCharsets.UTF_8))) {
            String line;
            while ((line = reader.readLine()) != null) {
                sb.append(line).append("\n");
            }
        }
        return sb.toString();
    }

    /**
     * Enforces strict Movebank XML structure requirements.
     * Ensures the file contains actual telemetry data tags, not just a dataset
     * title.
     */
    private void validateXmlContent(String content) {
        // Basic root tag check
        if (!content.contains("<movebank>")) {
            throw new IllegalArgumentException("XML Validation failed: Missing root <movebank> tag.");
        }

        // Strict enterprise rule: Must contain telemetry tracking data elements
        if (!content.contains("<telemetry>") && !content.contains("<track>") && !content.contains("<eventDate>")) {
            throw new IllegalArgumentException(
                    "XML Validation failed: Dataset lacks required telemetry or Darwin Core tracking elements.");
        }
    }

    /**
     * Enforces structure requirements for JSON datasets.
     */
    private void validateJsonContent(String content) {
        // Basic check for JSON format and telemetry/records array
        if (!content.trim().startsWith("{") && !content.trim().startsWith("[")) {
            throw new IllegalArgumentException("JSON Validation failed: Invalid JSON structure.");
        }

        if (!content.contains("telemetry") && !content.contains("records") && !content.contains("data")) {
            throw new IllegalArgumentException("JSON Validation failed: Dataset lacks required telemetry records.");
        }
    }
}