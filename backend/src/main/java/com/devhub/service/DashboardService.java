package com.devhub.service;

import com.devhub.dto.DashboardResponse;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DashboardService {

    public DashboardResponse getDashboardData() {
        String codeSample = "function rankSession(session) {\n" +
            "  const flowBonus = session.deepWorkMinutes > 90 ? 15 : 6;\n" +
            "  const streakBonus = session.streakDays * 2;\n\n" +
            "  return {\n" +
            "    score: session.baseScore + flowBonus + streakBonus,\n" +
            "    tip: session.distractions > 2 ? 'Try Focus Mode' : 'Great momentum',\n" +
            "  };\n" +
            "}";

        return new DashboardResponse(
            List.of(
                new DashboardResponse.StatItem("Hours Coded", "42h"),
                new DashboardResponse.StatItem("Current Streak", "11 days"),
                new DashboardResponse.StatItem("Tasks Closed", "27"),
                new DashboardResponse.StatItem("Focus Score", "89%")
            ),
            List.of(
                new DashboardResponse.FocusPoint("Mon", 4),
                new DashboardResponse.FocusPoint("Tue", 6),
                new DashboardResponse.FocusPoint("Wed", 5),
                new DashboardResponse.FocusPoint("Thu", 7),
                new DashboardResponse.FocusPoint("Fri", 8),
                new DashboardResponse.FocusPoint("Sat", 6),
                new DashboardResponse.FocusPoint("Sun", 6)
            ),
            codeSample,
            List.of(
                "The function computes an overall productivity score for one coding session.",
                "It awards a higher bonus when deep work exceeds 90 minutes.",
                "Streak consistency adds incremental points to reinforce daily coding habits.",
                "It returns both a numeric score and a tailored focus tip based on distractions."
            ),
            List.of(
                "Ship 1 feature", "Write tests", "No social scroll", "Refactor module", "Solve 2 bugs",
                "Pair review", "Clean TODOs", "Keyboard-only hour", "Read docs", "Update README",
                "Pomodoro x4", "Close 3 issues", "Optimize query", "Focus playlist", "Learn new API",
                "Ship micro-fix", "Deep work 120m", "Practice DSA", "Write changelog", "Cut one meeting",
                "Code journal", "Review PRs", "Fix lint debt", "Tidy components", "Celebrate win"
            ),
            new DashboardResponse.MusicWidget("Lo-Fi Compile Sessions", "Deep Focus Collective", 67, "Deep Focus")
        );
    }
}
