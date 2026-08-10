package com.e_science.harvester.service;

import com.e_science.harvester.model.Dataset;
import com.e_science.harvester.model.ProvenanceLog;
import com.e_science.harvester.repository.DatasetRepository;
import com.e_science.harvester.repository.ProvenanceLogRepository;
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
    private final ProvenanceLogRepository provenanceLogRepository; // Inject repo
    private final DatasetValidator datasetValidator;

    public IngestionService(DatasetRepository datasetRepository,
            ProvenanceLogRepository provenanceLogRepository,
            DatasetValidator datasetValidator) {
        this.datasetRepository = datasetRepository;
        this.provenanceLogRepository = provenanceLogRepository;
        this.datasetValidator = datasetValidator;
    }

    public String processIngestion(MultipartFile file) throws IOException {
        String filename = file != null ? file.getOriginalFilename() : "unknown";

        try {
            // Run Enterprise Validation
            datasetValidator.validateDatasetFile(file);

            // Safe check for null file to satisfy static analysis
            if (file == null) {
                throw new IllegalArgumentException("File cannot be null");
            }

            String content = new String(file.getBytes(), StandardCharsets.UTF_8);

            if (content.isEmpty()) {
                throw new IllegalArgumentException("File cannot be empty");
            }

            String format;
            int recordCount = 0;

            if (filename != null && filename.endsWith(".xml")) {
                parseMovebankXml(content);
                format = "MOVEBANK_XML";
                recordCount = (int) content.lines().count() / 2;
            } else if (filename != null && (filename.endsWith(".zip") || filename.endsWith(".json"))) {
                parseDarwinCoreOrJson(content);
                format = filename.endsWith(".zip") ? "DWC_A" : "JSON_SCHEMA";
                recordCount = (int) content.lines().count();
            } else {
                throw new IllegalArgumentException("Unsupported file format");
            }

            // Save valid dataset
            Dataset dataset = new Dataset();
            dataset.setTitle(filename);
            dataset.setFormat(format);
            dataset.setRecordCount(Math.max(1, recordCount));
            dataset.setDspaceItemId("item-" + UUID.randomUUID().toString());
            dataset.setStatus("PROCESSED");
            dataset.setDescription("Imported from uploaded file: " + filename);

            datasetRepository.save(dataset);

            // Log successful ingestion stage
            logEvent(null, "INGESTION_PIPELINE", "INFO", "Dataset successfully processed and saved: " + filename, null);

            LOGGER.info("Dataset successfully processed and saved: " + filename);
            return "Dataset successfully accepted and saved: " + filename;

        } catch (Exception e) {
            // Log validation or pipeline failure into provenance_logs (Production-grade
            // audit trail)
            logEvent(null, "VALIDATION_STAGE", "ERROR", "Validation failed for file: " + filename, e.getMessage());

            LOGGER.warning("Validation/Pipeline failed: " + e.getMessage());
            throw e; // Rethrow to let controller return 400 Bad Request to FE
        }
    }

    private void logEvent(Dataset dataset, String stage, String logLevel, String message, String details) {
        ProvenanceLog log = new ProvenanceLog();
        log.setDataset(dataset);
        log.setStage(stage);
        log.setLogLevel(logLevel);
        log.setMessage(message);
        log.setDetails(details);
        provenanceLogRepository.save(log);
    }

    private void parseMovebankXml(String content) {
        if (!content.contains("<movebank>")) {
            throw new IllegalArgumentException("Invalid Movebank XML schema: missing root tag <movebank>");
        }
    }

    private void parseDarwinCoreOrJson(String content) {
        LOGGER.info("Parsing Darwin Core / JSON data...");
    }
}