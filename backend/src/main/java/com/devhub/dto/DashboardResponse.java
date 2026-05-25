package com.devhub.dto;

import java.util.List;

public record DashboardResponse(
    List<StatItem> trackerStats,
    List<FocusPoint> weeklyFocusData,
    String codeSample,
    List<String> explanationSteps,
    List<String> bingoTasks,
    MusicWidget music
) {
    public record StatItem(String label, String value) {}
    public record FocusPoint(String day, int hours) {}
    public record MusicWidget(String title, String artist, int progressPercent, String mode) {}
}
