package com.e_science.harvester.controller;

import com.e_science.harvester.repository.ProvenanceLogRepository;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/metrics")
public class MetricsController {

    private final ProvenanceLogRepository provenanceLogRepository;

    public MetricsController(ProvenanceLogRepository provenanceLogRepository) {
        this.provenanceLogRepository = provenanceLogRepository;
    }

    @GetMapping("/failed-validations")
    public long getFailedValidationsCount() {
        // Returns the exact count of 'ERROR' logs stored in provenance_logs
        return provenanceLogRepository.countByLogLevel("ERROR");
    }
}