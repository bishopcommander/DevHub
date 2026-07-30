package com.devhub.decider.controller;

import com.devhub.decider.dto.StackDeciderRequest;
import com.devhub.decider.dto.StackDeciderResponse;
import com.devhub.decider.service.StackDeciderService;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping({"/api/v1/stack-decider", "/v1/stack-decider"})
public class StackDeciderController {

    private final StackDeciderService stackDeciderService;

    public StackDeciderController(StackDeciderService stackDeciderService) {
        this.stackDeciderService = stackDeciderService;
    }

    @PostMapping
    public StackDeciderResponse decideStack(@RequestBody StackDeciderRequest request) {
        return stackDeciderService.decideStack(request);
    }

    @GetMapping("/health")
    public Map<String, Object> health() {
        return Map.of(
            "service", "stack-decider-service",
            "status", "UP",
            "port", 8082,
            "timestamp", System.currentTimeMillis()
        );
    }
}
