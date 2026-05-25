import { useState, useEffect, useCallback } from 'react';

// ─── Helpers ────────────────────────────────────────────────────────────────

const GH_API = 'https://api.github.com';

async function ghFetch(path, token) {
  const headers = { Accept: 'application/vnd.github.v3+json' };
  if (token && token.trim().length > 0 && !token.includes('simulated')) {
    headers['Authorization'] = `token ${token}`;
  }
  const res = await fetch(`${GH_API}${path}`, { headers });
  if (!res.ok) throw new Error(`GitHub API error ${res.status} on ${path}`);
  return res.json();
}

// Fetch up to `pages` pages of a paginated endpoint
async function ghFetchAll(path, token, pages = 3) {
  const separator = path.includes('?') ? '&' : '?';
  const results = [];
  for (let p = 1; p <= pages; p++) {
    const data = await ghFetch(`${path}${separator}per_page=100&page=${p}`, token);
    if (!Array.isArray(data) || data.length === 0) break;
    results.push(...data);
    if (data.length < 100) break;
  }
  return results;
}

// ─── Analysis functions ──────────────────────────────────────────────────────

function analyzeLanguages(repos) {
  const counts = {};
  for (const r of repos) {
    if (r.language) counts[r.language] = (counts[r.language] || 0) + 1;
  }
  const total = Object.values(counts).reduce((a, b) => a + b, 0) || 1;
  return Object.entries(counts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 8)
    .map(([lang, count]) => ({ lang, count, pct: Math.round((count / total) * 100) }));
}

function analyzeCommitPatterns(commits) {
  const byHour = Array(24).fill(0);
  const byDay = { Sun: 0, Mon: 0, Tue: 0, Wed: 0, Thu: 0, Fri: 0, Sat: 0 };
  const dayKeys = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const byWeek = {}; // ISO week string → count

  for (const c of commits) {
    const date = new Date(c.commit?.author?.date || c.date);
    if (isNaN(date)) continue;
    byHour[date.getHours()]++;
    byDay[dayKeys[date.getDay()]]++;

    // group by YYYY-WW
    const startOfYear = new Date(date.getFullYear(), 0, 1);
    const week = Math.ceil(((date - startOfYear) / 86400000 + startOfYear.getDay() + 1) / 7);
    const key = `${date.getFullYear()}-W${String(week).padStart(2, '0')}`;
    byWeek[key] = (byWeek[key] || 0) + 1;
  }

  // Peak hour band
  const maxHour = byHour.indexOf(Math.max(...byHour));
  let timeLabel = 'afternoon';
  if (maxHour >= 22 || maxHour < 4) timeLabel = 'late night 🌙';
  else if (maxHour >= 18) timeLabel = 'evening';
  else if (maxHour >= 12) timeLabel = 'afternoon';
  else if (maxHour >= 6) timeLabel = 'morning';

  // Peak day
  const peakDay = Object.entries(byDay).sort(([, a], [, b]) => b - a)[0][0];

  // Weekly sparkline (last 12 weeks)
  const sortedWeeks = Object.entries(byWeek)
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-12)
    .map(([week, count]) => ({ week, count }));

  // Hourly bar data for chart
  const hourlyData = byHour.map((count, hour) => ({
    hour: `${hour}:00`,
    commits: count,
  }));

  const dailyData = Object.entries(byDay).map(([day, commits]) => ({ day, commits }));

  return { byHour, byDay, timeLabel, peakDay, sortedWeeks, hourlyData, dailyData };
}

function detectAbandonedRepos(repos) {
  const cutoff = new Date();
  cutoff.setMonth(cutoff.getMonth() - 6); // 6 months inactive
  return repos.filter(r => {
    if (r.fork) return false; // skip forks
    const pushed = new Date(r.pushed_at);
    return pushed < cutoff && !r.archived;
  });
}

function generateInsights(repos, commits, patterns, languages) {
  const insights = [];
  const totalRepos = repos.filter(r => !r.fork).length;
  const abandoned = detectAbandonedRepos(repos);
  const abandonPct = totalRepos > 0 ? Math.round((abandoned.length / totalRepos) * 100) : 0;

  if (abandonPct >= 50)
    insights.push(`🪦 You abandon **${abandonPct}%** of your projects — classic developer graveyard energy.`);
  else if (abandonPct >= 25)
    insights.push(`⚠️ About **${abandonPct}%** of your repos haven't been touched in 6+ months.`);
  else
    insights.push(`✅ You maintain **${100 - abandonPct}%** of your repos actively — impressive consistency!`);

  if (patterns.timeLabel)
    insights.push(`🕐 Your peak coding time is **${patterns.timeLabel}** — you're a ${patterns.timeLabel.includes('night') ? 'night owl' : 'daytime developer'}.`);

  if (patterns.peakDay)
    insights.push(`📅 **${patterns.peakDay}** is your most productive day of the week.`);

  if (languages.length > 0)
    insights.push(`💻 Your primary language is **${languages[0].lang}** (${languages[0].pct}% of repos).`);

  const starred = repos.filter(r => r.stargazers_count > 0);
  if (starred.length > 0) {
    const top = starred.sort((a, b) => b.stargazers_count - a.stargazers_count)[0];
    insights.push(`⭐ Your most popular repo is **${top.name}** with ${top.stargazers_count} star${top.stargazers_count !== 1 ? 's' : ''}.`);
  }

  const avgCommits = repos.length > 0 ? Math.round(commits.length / repos.length) : 0;
  if (avgCommits > 20)
    insights.push(`🔥 You average **${avgCommits} commits per repo** — highly engaged developer.`);
  else if (avgCommits < 5)
    insights.push(`💡 You average only **${avgCommits} commits per repo** — consider deeper dives into fewer projects.`);

  return insights;
}

// ─── Main Hook ───────────────────────────────────────────────────────────────

export function useGitHubAnalyzer(user) {
  const [state, setState] = useState({
    loading: false,
    error: null,
    data: null,
  });

  const analyze = useCallback(async () => {
    if (!user?.githubConnected || !user?.githubUsername) return;

    setState({ loading: true, error: null, data: null });

    try {
      const username = user.githubUsername;
      const token = user.githubToken || '';

      // Parallel fetch: profile + repos
      const [profile, repos] = await Promise.all([
        ghFetch(`/users/${username}`, token),
        ghFetchAll(`/users/${username}/repos?sort=pushed`, token, 3),
      ]);

      // Fetch recent commits from top 5 non-fork repos
      const topRepos = repos
        .filter(r => !r.fork)
        .sort((a, b) => new Date(b.pushed_at) - new Date(a.pushed_at))
        .slice(0, 5);

      const commitResults = await Promise.allSettled(
        topRepos.map(r => ghFetchAll(`/repos/${username}/${r.name}/commits?author=${username}`, token, 2))
      );

      const allCommits = commitResults
        .filter(r => r.status === 'fulfilled')
        .flatMap(r => r.value);

      const languages = analyzeLanguages(repos);
      const patterns = analyzeCommitPatterns(allCommits);
      const abandoned = detectAbandonedRepos(repos);
      const insights = generateInsights(repos, allCommits, patterns, languages);

      // Top repos by stars
      const topByStars = [...repos]
        .filter(r => !r.fork)
        .sort((a, b) => b.stargazers_count - a.stargazers_count)
        .slice(0, 5);

      // Recent activity (last 10 pushed repos)
      const recentRepos = [...repos]
        .sort((a, b) => new Date(b.pushed_at) - new Date(a.pushed_at))
        .slice(0, 10);

      setState({
        loading: false,
        error: null,
        data: {
          profile,
          repos,
          allCommits,
          languages,
          patterns,
          abandoned,
          insights,
          topByStars,
          recentRepos,
          totalRepos: repos.filter(r => !r.fork).length,
          totalForks: repos.filter(r => r.fork).length,
          totalStars: repos.reduce((s, r) => s + r.stargazers_count, 0),
          totalCommitsAnalyzed: allCommits.length,
        },
      });
    } catch (err) {
      setState({ loading: false, error: err.message, data: null });
    }
  }, [user?.githubUsername, user?.githubToken]);

  // Auto-analyze whenever user connects GitHub
  useEffect(() => {
    if (user?.githubConnected) analyze();
  }, [analyze, user?.githubConnected]);

  return { ...state, refetch: analyze };
}
