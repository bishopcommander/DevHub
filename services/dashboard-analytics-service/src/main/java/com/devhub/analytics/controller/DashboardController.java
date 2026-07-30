package com.devhub.analytics.controller;

import com.devhub.analytics.dto.DashboardResponse;
import com.devhub.analytics.service.DashboardService;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping({"/api/v1/dashboard", "/v1/dashboard"})
public class DashboardController {

    private final DashboardService dashboardService;

    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    @GetMapping
    public DashboardResponse getDashboard() {
        return dashboardService.getDashboardData();
    }

    @GetMapping("/health")
    public Map<String, Object> health() {
        return Map.of(
            "service", "dashboard-analytics-service",
            "status", "UP",
            "port", 8083,
            "timestamp", System.currentTimeMillis()
        );
    }
}
