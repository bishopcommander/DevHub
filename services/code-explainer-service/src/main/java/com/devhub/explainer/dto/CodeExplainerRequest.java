package com.devhub.explainer.dto;

public record CodeExplainerRequest(
    String code,
    String language,
    String level
) {}
