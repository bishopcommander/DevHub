package com.devhub.controller;

import com.devhub.dto.StackDeciderRequest;
import com.devhub.dto.StackDeciderResponse;
import com.devhub.service.StackDeciderService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/v1/stack-decider")
public class StackDeciderController {

    private final StackDeciderService stackDeciderService;

    public StackDeciderController(StackDeciderService stackDeciderService) {
        this.stackDeciderService = stackDeciderService;
    }

    @PostMapping
    public StackDeciderResponse getStackSuggestion(@RequestBody StackDeciderRequest request) {
        return stackDeciderService.decideStack(request);
    }
}
