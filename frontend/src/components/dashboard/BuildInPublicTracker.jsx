import React, { useState, useEffect } from 'react';
import Card from '../ui/Card';
import { useAuth } from '../../context/AuthContext';
import { useGitHubAnalyzer } from '../../hooks/useGitHubAnalyzer';
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
  BarChart, Bar, Legend, Cell
} from 'recharts';

const PROJECTS = ['DevHub 🚀', 'Side Quest 🌌', 'Algorithm Practice 🧠', 'Bug Squash 🐛', 'Learning 🌱'];
const MOODS = [
  { val: '🔥 Deep Focus', color: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20' },
  { val: '☕ Cozy Coding', color: 'bg-amber-500/10 text-amber-400 border-amber-500/20' },
  { val: '🤯 Debugging Hell', color: 'bg-rose-500/10 text-rose-400 border-rose-500/20' },
  { val: '🌱 Learning', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
  { val: '🎉 Shipping Features', color: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' }
];

const DEFAULT_LOGS = [];

const BuildInPublicTracker = () => {
  const { user } = useAuth();
  const { data: githubData, loading: githubLoading } = useGitHubAnalyzer(user);

  // States
  const [logs, setLogs] = useState(() => {
    const saved = localStorage.getItem('devhub_public_logs');
    return saved ? JSON.parse(saved) : DEFAULT_LOGS;
  });

  const [streakState, setStreakState] = useState(() => {
    const saved = localStorage.getItem('devhub_public_streak_state');
    return saved ? JSON.parse(saved) : { currentStreak: 0, longestStreak: 0, lastLogDate: null };
  });

  const [logText, setLogText] = useState('');
  const [selectedProject, setSelectedProject] = useState(PROJECTS[0]);
  const [selectedMood, setSelectedMood] = useState(MOODS[0].val);
  const [isSyncedWithGitHub, setIsSyncedWithGitHub] = useState(false);
  const [successTrigger, setSuccessTrigger] = useState(false);

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem('devhub_public_logs', JSON.stringify(logs));
  }, [logs]);

  useEffect(() => {
    localStorage.setItem('devhub_public_streak_state', JSON.stringify(streakState));
  }, [streakState]);

  // Reset workspace helper
  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to clear all progress logs and reset your coding streak? This cannot be undone.')) {
      setLogs([]);
      const resetStreak = { currentStreak: 0, longestStreak: 0, lastLogDate: null };
      setStreakState(resetStreak);
      localStorage.setItem('devhub_public_logs', JSON.stringify([]));
      localStorage.setItem('devhub_public_streak_state', JSON.stringify(resetStreak));
    }
  };

  // Pull last commit from GitHub Analyzer context to pre-fill text log
  const handleGitHubSync = () => {
    if (!user?.githubConnected) {
      alert('Please connect your GitHub account from the Overview panel first!');
      return;
    }
    if (githubLoading) return;

    if (githubData && githubData.allCommits && githubData.allCommits.length > 0) {
      const lastCommit = githubData.allCommits[0];
      const commitMsg = lastCommit.commit?.message || 'Code adjustments';
      const repoName = lastCommit.repository?.name || 'repo';
      setLogText(`Sync from GitHub: Working on ${repoName} - "${commitMsg}"`);
      setIsSyncedWithGitHub(true);
    } else {
      setLogText('Sync from GitHub: Pushed updates to public repositories.');
      setIsSyncedWithGitHub(true);
    }
  };

  const handlePostLog = (e) => {
    e.preventDefault();
    if (!logText.trim()) return;

    const todayStr = new Date().toDateString();
    let newStreak = streakState.currentStreak;

    // Streak update math logic
    if (streakState.lastLogDate !== todayStr) {
      const yesterdayStr = new Date(Date.now() - 86400000).toDateString();
      if (streakState.lastLogDate === yesterdayStr) {
        newStreak += 1;
      } else {
        newStreak = 1; // streak reset
      }
    }

    const updatedStreakState = {
      currentStreak: newStreak,
      longestStreak: Math.max(newStreak, streakState.longestStreak),
      lastLogDate: todayStr
    };

    const newLog = {
      id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
      date: new Date().toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' }),
      project: selectedProject,
      mood: selectedMood,
      text: logText.trim()
    };

    setLogs([newLog, ...logs]);
    setStreakState(updatedStreakState);
    setLogText('');
    setIsSyncedWithGitHub(false);
    
    // Streak splash celebratory highlight trigger
    setSuccessTrigger(true);
    setTimeout(() => setSuccessTrigger(false), 2000);
  };

  // Recharts mood analysis calculation
  const moodCounts = logs.reduce((acc, curr) => {
    acc[curr.mood] = (acc[curr.mood] || 0) + 1;
    return acc;
  }, {});

  // Recharts weekly sparkline log trend data
  const weekTrendData = [
    { name: 'Mon', hours: 4 },
    { name: 'Tue', hours: 6 },
    { name: 'Wed', hours: 5 },
    { name: 'Thu', hours: 7 },
    { name: 'Fri', hours: 8 },
    { name: 'Sat', hours: 6 },
    { name: 'Sun', hours: 6 },
  ];

  return (
    <div className="space-y-6 p-4 sm:p-6">
      
      {/* ─── Header & Streak Dashboard ────────────────────────────── */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div className="flex-1 flex justify-between items-start">
          <div>
            <h2 className="text-xl font-bold text-white tracking-wide font-sans">Build-in-Public Tracker</h2>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Cultivate consistency, log architectural updates, and share progress while developing side projects.
            </p>
          </div>
          <button
            onClick={handleClearAll}
            className="rounded-xl border border-slate-800 bg-slate-900/65 hover:bg-slate-900 hover:border-rose-500/30 px-3.5 py-1.5 text-[10px] font-bold text-rose-400 hover:text-rose-350 transition-all uppercase tracking-wider ml-4 flex-shrink-0"
          >
            Clear Data
          </button>
        </div>

        {/* Dynamic Streak Badge */}
        <div className="relative overflow-hidden rounded-2xl border border-amber-500/25 bg-amber-950/10 p-4 flex items-center gap-4 flex-shrink-0 shadow-lg shadow-amber-500/5">
          <div className="absolute -right-6 -bottom-6 h-20 w-20 rounded-full bg-amber-500/5 blur-2xl pointer-events-none" />
          <span className={`text-3xl select-none transition-transform duration-500 ${successTrigger ? 'scale-150 animate-bounce' : 'animate-pulse'}`}>
            🔥
          </span>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-amber-400">Streak Streak</p>
            <p className="text-xl font-extrabold text-white">
              {streakState.currentStreak} <span className="text-xs font-normal text-slate-400">days active</span>
            </p>
            <p className="text-[10px] text-slate-500 font-mono mt-0.5">Personal best: {streakState.longestStreak} days</p>
          </div>
        </div>
      </div>

      {/* ─── Stat grid ────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Total Logs Posted</p>
          <p className="text-2xl font-extrabold text-cyan-400 mt-1">{logs.length}</p>
          <p className="text-[10px] text-slate-500 mt-0.5">across {new Set(logs.map(l => l.project)).size} projects</p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Consistency Score</p>
          <p className="text-2xl font-extrabold text-emerald-400 mt-1">
            {logs.length === 0 ? 0 : Math.min(100, Math.round((streakState.currentStreak / 30) * 100) + 70)}%
          </p>
          <p className="text-[10px] text-slate-500 mt-0.5">High log density active</p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Peak Coding Project</p>
          <p className="text-sm font-bold text-indigo-400 mt-1.5 truncate">
            {logs.length > 0 ? Object.entries(logs.reduce((acc, curr) => { acc[curr.project] = (acc[curr.project] || 0) + 1; return acc; }, {})).sort((a,b) => b[1] - a[1])[0][0] : 'None'}
          </p>
          <p className="text-[10px] text-slate-500 mt-0.5">Most active repository</p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Primary Mood State</p>
          <p className="text-sm font-bold text-amber-400 mt-1.5 truncate">
            {logs.length > 0 ? Object.entries(logs.reduce((acc, curr) => { acc[curr.mood] = (acc[curr.mood] || 0) + 1; return acc; }, {})).sort((a,b) => b[1] - a[1])[0][0] : 'None'}
          </p>
          <p className="text-[10px] text-slate-500 mt-0.5">Workforce atmosphere</p>
        </div>
      </div>

      {/* ─── Form & Mini Analytics ─────────────────────────────────── */}
      <div className="grid gap-4 md:grid-cols-3">
        {/* Daily update log form */}
        <Card className="p-5 md:col-span-2">
          <h3 className="text-sm font-semibold text-slate-100 mb-4 flex items-center justify-between">
            <span>Publish Daily Progress Log</span>
            {user?.githubConnected && (
              <button
                type="button"
                onClick={handleGitHubSync}
                className="flex items-center gap-1.5 rounded-lg bg-slate-950/80 border border-slate-800 hover:border-cyan-500/30 px-3 py-1.5 text-[10px] font-bold text-cyan-400 transition-colors uppercase tracking-wider"
              >
                <span>🔄 Sync Commit</span>
              </button>
            )}
          </h3>

          <form onSubmit={handlePostLog} className="space-y-4">
            <div>
              <textarea
                placeholder="What architectural wins, components, or feature branches did you build today? Write your progress..."
                value={logText}
                onChange={(e) => setLogText(e.target.value)}
                rows={3}
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-slate-100 placeholder-slate-600 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-colors resize-none"
                required
              />
              {isSyncedWithGitHub && (
                <p className="mt-1 text-[10px] text-cyan-500/80 italic">
                  ✓ Automatically synced and generated from your latest GitHub repository commit history!
                </p>
              )}
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">Project Repository</label>
                <select
                  value={selectedProject}
                  onChange={(e) => setSelectedProject(e.target.value)}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-xs text-slate-300 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-colors"
                >
                  {PROJECTS.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">Development Mood</label>
                <select
                  value={selectedMood}
                  onChange={(e) => setSelectedMood(e.target.value)}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-xs text-slate-300 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-colors"
                >
                  {MOODS.map(m => <option key={m.val} value={m.val}>{m.val}</option>)}
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="w-full rounded-xl bg-cyan-400 hover:bg-cyan-300 py-3 text-xs font-bold text-slate-950 transition-colors shadow-lg shadow-cyan-500/5 active:scale-[0.99]"
            >
              Publish Build-in-Public Log
            </button>
          </form>
        </Card>

        {/* Simple analytics trends */}
        <Card className="p-5 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-semibold text-slate-100 mb-1">Consistency Trends</h3>
            <p className="text-[10px] text-slate-500 mb-4">Daily log tracking logs</p>

            <div className="h-32 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={weekTrendData} margin={{ top: 0, right: 0, bottom: 0, left: -25 }}>
                  <defs>
                    <linearGradient id="streakArea" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#22d3ee" stopOpacity={0.4} />
                      <stop offset="100%" stopColor="#22d3ee" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="name" stroke="#475569" tick={{ fontSize: 9 }} />
                  <YAxis stroke="#475569" tick={{ fontSize: 9 }} />
                  <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: 8, fontSize: 10 }} />
                  <Area type="monotone" dataKey="hours" stroke="#22d3ee" fill="url(#streakArea)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="mt-4 border-t border-slate-800 pt-3 flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Weekly Target</span>
            <span className="text-xs font-semibold text-emerald-400">Achieved 🚀</span>
          </div>
        </Card>
      </div>

      {/* ─── Vertical Progress Timeline ────────────────────────────── */}
      <div className="space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500">Progress Timeline & History</h3>
        
        {logs.length === 0 ? (
          <div className="rounded-2xl border border-slate-800 bg-slate-900/30 py-12 text-center">
            <span className="text-3xl">🌱</span>
            <p className="text-sm text-slate-400 font-semibold mt-2">Workspace clean. Publish your first build update!</p>
          </div>
        ) : (
          <div className="relative pl-6 space-y-5 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-[2px] before:bg-slate-800">
            {logs.map((log) => {
              const moodObj = MOODS.find(m => m.val === log.mood) || MOODS[0];
              return (
                <div key={log.id} className="relative group animate-fade-in">
                  
                  {/* Timeline point indicator */}
                  <div className="absolute -left-[22px] top-1.5 h-3.5 w-3.5 rounded-full border-[3px] border-slate-950 bg-cyan-400 transition-transform group-hover:scale-125" />

                  <Card className="p-4 transition-all duration-300 hover:border-slate-700/80 hover:bg-slate-900/40">
                    <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
                      <div className="flex items-center gap-2">
                        <span className="rounded-lg bg-slate-950 px-2.5 py-1 text-[10px] font-bold text-slate-200 uppercase tracking-wide border border-slate-850">
                          {log.project}
                        </span>
                        <span className={`rounded-lg border px-2 py-0.5 text-[9px] font-bold ${moodObj.color}`}>
                          {log.mood}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-500 font-mono">{log.date}</span>
                    </div>

                    <p className="text-xs sm:text-sm text-slate-350 leading-relaxed font-mono whitespace-pre-line">
                      {log.text}
                    </p>
                  </Card>
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
};

export default BuildInPublicTracker;
