package com.devhub.explainer.controller;

import com.devhub.explainer.dto.CodeExplainerRequest;
import com.devhub.explainer.dto.CodeExplainerResponse;
import com.devhub.explainer.service.CodeExplainerService;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping({"/api/v1/code-explainer", "/v1/code-explainer"})
public class CodeExplainerController {

    private final CodeExplainerService codeExplainerService;

    public CodeExplainerController(CodeExplainerService codeExplainerService) {
        this.codeExplainerService = codeExplainerService;
    }

    @PostMapping
    public CodeExplainerResponse explainCode(@RequestBody CodeExplainerRequest request) {
        return codeExplainerService.explainCode(request);
    }

    @GetMapping("/health")
    public Map<String, Object> health() {
        return Map.of(
            "service", "code-explainer-service",
            "status", "UP",
            "port", 8081,
            "timestamp", System.currentTimeMillis()
        );
    }
}
