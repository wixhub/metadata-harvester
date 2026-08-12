package com.e_science.harvester.service;

import com.e_science.harvester.model.Dataset;
import com.e_science.harvester.model.ProvenanceLog;
import com.e_science.harvester.repository.DatasetRepository;
import com.e_science.harvester.repository.ProvenanceLogRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.logging.Logger;

/**
 * Service handling dataset file ingestion, validation, and publication
 * pipeline.
 */
@Service
public class IngestionService {

    private static final Logger LOGGER = Logger.getLogger(IngestionService.class.getName());

    private final DatasetRepository datasetRepository;
    private final ProvenanceLogRepository provenanceLogRepository;
    private final DatasetValidator datasetValidator;
    private final DSpaceService dspaceService; // Inject DSpaceService

    public IngestionService(DatasetRepository datasetRepository,
            ProvenanceLogRepository provenanceLogRepository,
            DatasetValidator datasetValidator,
            DSpaceService dspaceService) {
        this.datasetRepository = datasetRepository;
        this.provenanceLogRepository = provenanceLogRepository;
        this.datasetValidator = datasetValidator;
        this.dspaceService = dspaceService;
    }

    public String processIngestion(MultipartFile file) throws IOException {
        if (file == null) {
            throw new IllegalArgumentException("File cannot be null");
        }

        String filename = file.getOriginalFilename() != null ? file.getOriginalFilename() : "unknown";

        try {
            // Run Enterprise Validation
            datasetValidator.validateDatasetFile(file);

            String content = new String(file.getBytes(), StandardCharsets.UTF_8);

            if (content.isEmpty()) {
                throw new IllegalArgumentException("File cannot be empty");
            }

            String format;
            int recordCount = 0;

            if (filename.endsWith(".xml")) {
                parseMovebankXml(content);
                format = "MOVEBANK_XML";
                recordCount = (int) content.lines().count() / 2;
            } else if (filename.endsWith(".zip") || filename.endsWith(".json")) {
                parseDarwinCoreOrJson(content);
                format = filename.endsWith(".zip") ? "DWC_A" : "JSON_SCHEMA";
                recordCount = (int) content.lines().count();
            } else {
                throw new IllegalArgumentException("Unsupported file format");
            }

            // Prepare Dataset entity before pushing
            Dataset dataset = new Dataset();
            dataset.setTitle(filename);
            dataset.setFormat(format);
            dataset.setRecordCount(Math.max(1, recordCount));
            dataset.setStatus("PROCESSED");
            dataset.setDescription("Imported from uploaded file: " + filename);

            // Push dataset to DSpace using DSpaceService and get real/mock Handle ID
            String dspaceHandle = dspaceService.pushToDspace(dataset, content);
            dataset.setDspaceItemId(dspaceHandle);

            // Save successful dataset to database
            datasetRepository.save(dataset);

            // Log successful pipeline stage
            logEvent(null, "INGESTION_PIPELINE", "INFO",
                    "Dataset successfully processed and published to DSpace: " + filename, null);

            LOGGER.info("Dataset successfully processed and saved with DSpace ID: " + dspaceHandle);
            return "Dataset successfully accepted and published to DSpace: " + filename;

        } catch (Exception e) {
            // Log pipeline failure into provenance_logs
            logEvent(null, "VALIDATION_STAGE", "ERROR", "Validation/Ingestion failed for file: " + filename,
                    e.getMessage());

            LOGGER.warning("Validation/Pipeline failed: " + e.getMessage());
            throw e;
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