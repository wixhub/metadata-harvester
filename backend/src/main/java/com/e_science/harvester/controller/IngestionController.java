package com.e_science.harvester.controller;

import com.e_science.harvester.model.Dataset;
import com.e_science.harvester.repository.DatasetRepository;
import com.e_science.harvester.service.IngestionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/v1")
@Tag(name = "Ingestion API", description = "Endpoints for dataset upload, validation, and retrieval")
public class IngestionController {

    private final IngestionService ingestionService;
    private final DatasetRepository datasetRepository;

    public IngestionController(IngestionService ingestionService, DatasetRepository datasetRepository) {
        this.ingestionService = ingestionService;
        this.datasetRepository = datasetRepository;
    }

    @Operation(summary = "Upload a dataset file", description = "Accepts Movebank XML or Darwin Core files for ingestion and validation")
    @ApiResponse(responseCode = "200", description = "File successfully processed and saved")
    @ApiResponse(responseCode = "400", description = "Validation error or empty file")
    @PostMapping(value = "/ingest", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<String> ingestData(@RequestParam("file") MultipartFile file) {
        try {
            String result = ingestionService.processIngestion(file);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Processing error: " + e.getMessage());
        }
    }

    @Operation(summary = "Get a paginated list of datasets", description = "Returns a pageable list of all ingested datasets from the database")
    @GetMapping("/datasets")
    public ResponseEntity<Page<Dataset>> getDatasets(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        Pageable pageable = PageRequest.of(page, size);
        Page<Dataset> datasetsPage = datasetRepository.findAll(pageable);
        return ResponseEntity.ok(datasetsPage);
    }
}