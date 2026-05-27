package com.devhub.dto;

import java.util.List;

public record StackDeciderRequest(
    String idea,
    boolean tailorGitHub,
    List<String> gitHubLanguages
) {}
