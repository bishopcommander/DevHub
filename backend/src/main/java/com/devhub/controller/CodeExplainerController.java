package com.devhub.controller;

import com.devhub.dto.CodeExplainerRequest;
import com.devhub.dto.CodeExplainerResponse;
import com.devhub.service.CodeExplainerService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/v1/code-explainer")
public class CodeExplainerController {

    private final CodeExplainerService codeExplainerService;

    public CodeExplainerController(CodeExplainerService codeExplainerService) {
        this.codeExplainerService = codeExplainerService;
    }

    @PostMapping
    public CodeExplainerResponse getCodeExplanation(@RequestBody CodeExplainerRequest request) {
        return codeExplainerService.explainCode(request);
    }
}
