package com.devhub.dto;

import java.util.List;

public record CodeExplainerResponse(
    String explanation,
    List<String> steps,
    List<CodeHighlight> highlights,
    List<String> improvements,
    String refactoredCode
) {
    public record CodeHighlight(
        String codePart,
        String category, // e.g. "Function", "Logic", "Pattern", "Variables"
        String explanation
    ) {}
}
