package com.devhub.explainer.dto;

import java.util.List;

public record CodeExplainerResponse(
    String explanation,
    List<String> executionSteps,
    List<CodeHighlight> syntaxHighlights,
    List<String> optimizationTips,
    String refactoredCode,
    ComplexityMetrics complexity,
    List<Graph3DNode> visual3dGraphNodes
) {
    public record CodeHighlight(
        String codeSnippet,
        String type,
        String explanation
    ) {}

    public record ComplexityMetrics(
        String timeComplexity,
        String spaceComplexity,
        int estimatedOperations,
        String memoryPattern
    ) {}

    public record Graph3DNode(
        String id,
        String label,
        String nodeType,
        double[] position3d, // [x, y, z]
        String color,
        String details
    ) {}
}
