package com.devhub.dto;

import java.util.List;

public record StackDeciderResponse(
    String idea,
    String estimatedComplexity, // "Low" | "Medium" | "High"
    String rationale,
    TechnologySuggestion frontend,
    TechnologySuggestion backend,
    TechnologySuggestion database,
    List<String> warnings,
    List<String> overengineeringAlternatives,
    String tailorStatus
) {
    public record TechnologySuggestion(
        String name,
        String reason,
        List<String> pros,
        List<String> cons
    ) {}
}
