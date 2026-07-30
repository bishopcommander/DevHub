package com.devhub.tracker.dto;

import java.util.List;

public record TrackerResponse(
    List<String> bingoTasks,
    List<BingoAchievement3DNode> visual3dAchievementNodes
) {
    public record BingoAchievement3DNode(
        String id,
        String label,
        String category, // habit, shipping, learning, focus
        double[] position3d,
        String color,
        boolean isSpecial // free space, bingo etc.
    ) {}
}
