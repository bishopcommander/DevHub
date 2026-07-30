package com.devhub.analytics.dto;

import java.util.List;

public record DashboardResponse(
    List<StatItem> trackerStats,
    List<FocusPoint> weeklyFocusData,
    String codeSample,
    List<String> explanationSteps,
    List<String> bingoTasks,
    MusicWidget music,
    List<Bar3DNode> visual3dBarNodes
) {
    public record StatItem(String label, String value) {}
    public record FocusPoint(String day, int hours) {}
    public record MusicWidget(String title, String artist, int progressPercent, String mode) {}
    
    public record Bar3DNode(
        String id,
        String label,
        double value,
        double[] position3d, // [x, y, z]
        String color
    ) {}
}
