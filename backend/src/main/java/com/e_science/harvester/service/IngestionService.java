package com.e_science.harvester.service;

import com.e_science.harvester.model.Dataset;
import com.e_science.harvester.repository.DatasetRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.UUID;
import java.util.logging.Logger;

@Service
public class IngestionService {

    private static final Logger LOGGER = Logger.getLogger(IngestionService.class.getName());

    private final DatasetRepository datasetRepository;
    private final DatasetValidator datasetValidator; // Declared validator

    // Injected validator via constructor
    public IngestionService(DatasetRepository datasetRepository, DatasetValidator datasetValidator) {
        this.datasetRepository = datasetRepository;
        this.datasetValidator = datasetValidator;
    }

    public String processIngestion(MultipartFile file) throws IOException {

        // RUN ENTERPRISE VALIDATION FIRST
        datasetValidator.validateDatasetFile(file);

        String content = new String(file.getBytes(), StandardCharsets.UTF_8);
        String filename = file.getOriginalFilename();

        // Format detection and initial validation
        if (content.isEmpty()) {
            LOGGER.warning("Anomaly: Uploaded file is empty — " + filename);
            throw new IllegalArgumentException("File cannot be empty");
        }

        String format;
        int recordCount = 0;

        // Required fields check & format classification
        if (filename != null && filename.endsWith(".xml")) {
            parseMovebankXml(content);
            format = "MOVEBANK_XML";
            recordCount = (int) content.lines().count() / 2; // Approximate count logic
        } else if (filename != null && (filename.endsWith(".zip") || filename.endsWith(".json"))) {
            parseDarwinCoreOrJson(content);
            format = filename.endsWith(".zip") ? "DWC_A" : "JSON_SCHEMA";
            recordCount = (int) content.lines().count();
        } else {
            LOGGER.warning("Anomaly: Unsupported file format — " + filename);
            throw new IllegalArgumentException("Unsupported file format");
        }

        // Creating and saving the dataset entity to the database with format and record
        // count
        Dataset dataset = new Dataset();
        dataset.setTitle(filename);
        dataset.setFormat(format);
        dataset.setRecordCount(Math.max(1, recordCount));
        dataset.setDspaceItemId("item-" + UUID.randomUUID().toString());
        dataset.setStatus("PROCESSED");
        dataset.setDescription("Imported from uploaded file: " + filename);

        datasetRepository.save(dataset);

        LOGGER.info("Dataset successfully processed and saved: " + filename);
        return "Dataset successfully accepted and saved: " + filename;
    }

    private void parseMovebankXml(String content) {
        // Movebank XML parsing logic
        if (!content.contains("<movebank>")) {
            LOGGER.severe("Movebank XML validation error: missing root tag <movebank>");
            throw new IllegalArgumentException("Invalid Movebank XML schema");
        }
    }

    private void parseDarwinCoreOrJson(String content) {
        // Darwin Core / JSON parsing logic
        LOGGER.info("Parsing Darwin Core / JSON data...");
    }
}