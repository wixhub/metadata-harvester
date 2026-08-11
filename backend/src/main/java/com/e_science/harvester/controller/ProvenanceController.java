package com.e_science.harvester.controller;

import com.e_science.harvester.model.ProvenanceLog;
import com.e_science.harvester.repository.ProvenanceLogRepository;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * Controller for retrieving audit and provenance logs.
 */
@RestController
@RequestMapping("/api/v1/provenance")
public class ProvenanceController {

    private final ProvenanceLogRepository provenanceLogRepository;

    public ProvenanceController(ProvenanceLogRepository provenanceLogRepository) {
        this.provenanceLogRepository = provenanceLogRepository;
    }

    /**
     * Retrieve all error logs for monitoring and debugging purposes.
     * 
     * @return List of error provenance logs
     */
    @GetMapping("/errors")
    public List<ProvenanceLog> getErrorLogs() {
        // Fetch logs matching ERROR level
        return provenanceLogRepository.findAll()
                .stream()
                .filter(log -> "ERROR".equals(log.getLogLevel()))
                .toList();
    }
}