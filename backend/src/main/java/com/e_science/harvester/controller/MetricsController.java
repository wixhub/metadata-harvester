package com.e_science.harvester.controller;

import com.e_science.harvester.model.ProvenanceLog;
import com.e_science.harvester.repository.ProvenanceLogRepository;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/metrics")
public class MetricsController {

    private final ProvenanceLogRepository provenanceLogRepository;

    public MetricsController(ProvenanceLogRepository provenanceLogRepository) {
        this.provenanceLogRepository = provenanceLogRepository;
    }

    /**
     * Returns the exact count of 'ERROR' logs stored in provenance_logs
     */
    @GetMapping("/failed-validations")
    public long getFailedValidationsCount() {
        return provenanceLogRepository.countByLogLevel("ERROR");
    }

    /**
     * Returns a list of 'ERROR' logs to display in the dashboard table when the
     * failed card is clicked
     */
    @GetMapping("/failed-validations/list")
    public List<ProvenanceLog> getFailedValidationsList() {
        // Fetch all logs with 'ERROR' status/level from the repository
        return provenanceLogRepository.findByLogLevel("ERROR");
    }
}