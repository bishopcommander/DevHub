package com.devhub.controller;

import com.devhub.dto.LandingResponse;
import com.devhub.service.LandingService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/v1/landing")
public class LandingController {

    private final LandingService landingService;

    public LandingController(LandingService landingService) {
        this.landingService = landingService;
    }

    @GetMapping
    public LandingResponse getLanding() {
        return landingService.getLandingData();
    }
}
