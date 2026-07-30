package com.devhub.tracker.controller;

import com.devhub.tracker.dto.TrackerResponse;
import com.devhub.tracker.service.TrackerService;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping({"/api/v1/tracker", "/v1/tracker"})
public class TrackerController {

    private final TrackerService trackerService;

    public TrackerController(TrackerService trackerService) {
        this.trackerService = trackerService;
    }

    @GetMapping
    public TrackerResponse getTrackerData() {
        return trackerService.getTrackerData();
    }

    @GetMapping("/health")
    public Map<String, Object> health() {
        return Map.of(
            "service", "tracker-service",
            "status", "UP",
            "port", 8084,
            "timestamp", System.currentTimeMillis()
        );
    }
}
