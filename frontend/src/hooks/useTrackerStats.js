import { useState, useEffect } from 'react';

/**
 * Reads the Build-in-Public Tracker data from localStorage and
 * returns live-computed stats + recent logs for the landing page preview.
 */
export function useTrackerStats() {
  const [stats, setStats] = useState(null);
  const [recentLogs, setRecentLogs] = useState([]);

  useEffect(() => {
    function compute() {
      try {
        const rawLogs = localStorage.getItem('devhub_public_logs');
        const rawStreak = localStorage.getItem('devhub_public_streak_state');

        const logs = rawLogs ? JSON.parse(rawLogs) : [];
        const streak = rawStreak
          ? JSON.parse(rawStreak)
          : { currentStreak: 0, longestStreak: 0 };

        // Peak project
        const projectCounts = logs.reduce((acc, l) => {
          acc[l.project] = (acc[l.project] || 0) + 1;
          return acc;
        }, {});
        const peakProject =
          logs.length > 0
            ? Object.entries(projectCounts).sort((a, b) => b[1] - a[1])[0][0]
            : '—';

        // Consistency score (same formula as tracker)
        const consistencyScore =
          logs.length === 0
            ? 0
            : Math.min(100, Math.round((streak.currentStreak / 30) * 100) + 70);

        setStats([
          { label: 'Progress Logs Posted', value: String(logs.length) },
          {
            label: 'Current Streak',
            value: streak.currentStreak > 0 ? `${streak.currentStreak} days 🔥` : '0 days',
          },
          { label: 'Consistency Score', value: `${consistencyScore}%` },
          { label: 'Active Project', value: peakProject },
        ]);

        // Return 3 most recent logs for the live feed
        setRecentLogs(logs.slice(0, 3));
      } catch {
        setStats(null);
        setRecentLogs([]);
      }
    }

    compute();

    // Re-sync whenever localStorage changes (other tabs or dashboard saves)
    window.addEventListener('storage', compute);
    return () => window.removeEventListener('storage', compute);
  }, []);

  return { stats, recentLogs };
}
