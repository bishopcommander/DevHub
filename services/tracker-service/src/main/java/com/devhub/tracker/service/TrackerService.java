package com.devhub.tracker.service;

import com.devhub.tracker.dto.TrackerResponse;
import com.devhub.tracker.dto.TrackerResponse.BingoAchievement3DNode;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class TrackerService {

    private static final List<String> BINGO_TASKS = List.of(
        "Ship 1 feature", "Write tests", "No social scroll", "Refactor module", "Solve 2 bugs",
        "Pair review", "Clean TODOs", "Keyboard-only hour", "Read docs", "Update README",
        "Pomodoro x4", "Close 3 issues", "Optimize query", "Focus playlist", "Learn new API",
        "Ship micro-fix", "Deep work 120m", "Practice DSA", "Write changelog", "Cut one meeting",
        "Code journal", "Review PRs", "Fix lint debt", "Tidy components", "Celebrate win"
    );

    private static final String[][] CATEGORIES = {
        {"shipping", "#38bdf8"},
        {"habits", "#10b981"},
        {"focus", "#a855f7"},
        {"learning", "#f59e0b"},
        {"shipping", "#fb7185"},
        {"habits", "#34d399"},
        {"focus", "#818cf8"},
        {"learning", "#e879f9"},
        {"shipping", "#38bdf8"},
        {"habits", "#10b981"},
        {"focus", "#a855f7"},
        {"learning", "#f59e0b"},
        {"shipping", "#fbbf24"}, // FREE center
        {"habits", "#fb7185"},
        {"focus", "#34d399"},
        {"learning", "#818cf8"},
        {"shipping", "#e879f9"},
        {"habits", "#38bdf8"},
        {"focus", "#10b981"},
        {"learning", "#a855f7"},
        {"shipping", "#f59e0b"},
        {"habits", "#fb7185"},
        {"focus", "#34d399"},
        {"learning", "#818cf8"},
        {"shipping", "#e879f9"}
    };

    public TrackerResponse getTrackerData() {
        List<BingoAchievement3DNode> nodes = new ArrayList<>();

        // 5x5 Bingo board => Map to 3D cube positions
        for (int row = 0; row < 5; row++) {
            for (int col = 0; col < 5; col++) {
                int idx = row * 5 + col;
                boolean isFreeCenter = (idx == 12);
                String taskLabel = isFreeCenter ? "FREE ☕" : BINGO_TASKS.get(idx < 12 ? idx : idx - 1);
                String[] catColor = CATEGORIES[idx];

                double x = (col - 2) * 1.4;
                double y = (2 - row) * 1.4;
                double z = 0;

                nodes.add(new BingoAchievement3DNode(
                    "task_" + idx,
                    taskLabel,
                    catColor[0],
                    new double[]{x, y, z},
                    catColor[1],
                    isFreeCenter
                ));
            }
        }

        return new TrackerResponse(BINGO_TASKS, nodes);
    }
}
