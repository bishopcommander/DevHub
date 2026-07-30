package com.devhub.decider.dto;

import java.util.List;

public record StackDeciderResponse(
    String idea,
    String estimatedComplexity,
    String rationale,
    TechnologySuggestion frontend,
    TechnologySuggestion backend,
    TechnologySuggestion database,
    List<String> warnings,
    List<String> overengineeringAlternatives,
    String tailorStatus,
    List<Galaxy3DNode> visual3dGalaxyNodes
) {
    public record TechnologySuggestion(
        String name,
        String reason,
        List<String> pros,
        List<String> cons
    ) {}

    public record Galaxy3DNode(
        String id,
        String name,
        String category, // frontend, backend, database
        double[] position3d, // [x, y, z]
        String color,
        double radius
    ) {}
}
