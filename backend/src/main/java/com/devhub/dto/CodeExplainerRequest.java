package com.devhub.dto;

public record CodeExplainerRequest(
    String code,
    String language,
    String level
) {}
