package com.e_science.harvester.service;

import com.e_science.harvester.model.Dataset;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;

@SpringBootTest
@ActiveProfiles("test")
class DSpaceServiceTest {

    @Autowired
    private DSpaceService dspaceService;

    @Test
    void testPushToDspaceMockSuccess() {
        Dataset dataset = new Dataset();
        dataset.setTitle("Telemetry Ecology Data 2026");
        dataset.setDspaceCollectionId("123456789/test");

        String rawContent = "<dataset>Sample content</dataset>";

        String handle = dspaceService.pushToDspace(dataset, rawContent);

        assertNotNull(handle);
    }

    @Test
    void testPushToDspaceEmptyContentThrowsException() {
        Dataset dataset = new Dataset();
        dataset.setTitle("Empty Dataset");

        assertThrows(IllegalArgumentException.class, () -> {
            dspaceService.pushToDspace(dataset, "");
        });
    }
}