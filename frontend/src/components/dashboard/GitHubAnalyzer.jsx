import React, { useState, useEffect, useMemo } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  CartesianGrid
} from 'recharts';
import { useAuth } from '../../context/AuthContext';
import { useGitHubAnalyzer } from '../../hooks/useGitHubAnalyzer';
import Card from '../ui/Card';

// ─── Language colour palette ─────────────────────────────────────────────────
const LANG_COLORS = {
  JavaScript: '#f7df1e', TypeScript: '#3178c6', Python: '#3572A5',
  Java: '#b07219', 'C++': '#f34b7d', Go: '#00ADD8', Rust: '#dea584',
  Ruby: '#701516', PHP: '#4F5D95', CSS: '#563d7c', HTML: '#e34c26',
  Swift: '#ffac45', Kotlin: '#A97BFF', Dart: '#00B4AB', Shell: '#89e051',
  default: '#64748b',
};
const langColor = (lang) => LANG_COLORS[lang] || LANG_COLORS.default;

// ─── Reason Tag styling ──────────────────────────────────────────────────────
const REASON_METADATA = {
  'lost interest': { label: 'Lost Interest 🥱', color: 'bg-slate-500/10 text-slate-400 border-slate-500/20' },
  'too complex': { label: 'Too Complex 🧠', color: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' },
  'no time': { label: 'No Time ⏰', color: 'bg-amber-500/10 text-amber-400 border-amber-500/20' },
  'tutorial hell': { label: 'Tutorial Hell 🎦', color: 'bg-rose-500/10 text-rose-400 border-rose-500/20' },
  'shiny object syndrome': { label: 'Shiny Object Syndrome ✨', color: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20' },
  'refactor loop': { label: 'Refactor Loop 🔁', color: 'bg-purple-500/10 text-purple-400 border-purple-500/20' }
};

// ─── Sub-components ──────────────────────────────────────────────────────────
const StatCard = ({ label, value, sub, accent = 'cyan' }) => {
  const accentMap = { cyan: 'text-cyan-400', indigo: 'text-indigo-400', emerald: 'text-emerald-400', rose: 'text-rose-400', amber: 'text-amber-400' };
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 flex flex-col gap-1">
      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">{label}</p>
      <p className={`text-2xl font-extrabold ${accentMap[accent] || 'text-cyan-400'}`}>{value}</p>
      {sub && <p className="text-[11px] text-slate-500">{sub}</p>}
    </div>
  );
};

const InsightCard = ({ text }) => {
  const parts = text.split(/\*\*(.*?)\*\*/g);
  return (
    <div className="rounded-xl border border-slate-800/60 bg-slate-900/40 px-4 py-3 text-sm text-slate-300 leading-relaxed">
      {parts.map((part, i) =>
        i % 2 === 1
          ? <span key={i} className="font-bold text-white">{part}</span>
          : <span key={i}>{part}</span>
      )}
    </div>
  );
};

const SkeletonBlock = ({ h = 'h-6', w = 'w-full' }) => (
  <div className={`${h} ${w} animate-pulse rounded-lg bg-slate-800/60`} />
);

const LoadingSkeleton = () => (
  <div className="space-y-6 p-1">
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {[...Array(4)].map((_, i) => <SkeletonBlock key={i} h="h-20" />)}
    </div>
    <SkeletonBlock h="h-48" />
    <div className="grid grid-cols-2 gap-3">
      <SkeletonBlock h="h-36" />
      <SkeletonBlock h="h-36" />
    </div>
  </div>
);

// ─── Main Component ──────────────────────────────────────────────────────────
const GitHubAnalyzer = () => {
  const { user, connectGitHub, disconnectGitHub } = useAuth();
  const { loading, error, data, refetch } = useGitHubAnalyzer(user);
  const [activeChart, setActiveChart] = useState('hourly'); // 'hourly' | 'daily' | 'weekly'
  const [showGraveyardStudio, setShowGraveyardStudio] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Graveyard specific state
  const [graveyard, setGraveyard] = useState(() => {
    const saved = localStorage.getItem('devhub_graveyard_projects');
    return saved ? JSON.parse(saved) : [];
  });

  // Save graveyard to localStorage
  useEffect(() => {
    localStorage.setItem('devhub_graveyard_projects', JSON.stringify(graveyard));
  }, [graveyard]);

  // Form states
  const [showAddForm, setShowAddForm] = useState(false);
  const [formName, setFormName] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formTech, setFormTech] = useState('');
  const [formStart, setFormStart] = useState('');
  const [formEnd, setFormEnd] = useState('');
  const [formReason, setFormReason] = useState('shiny object syndrome');
  const [formNotes, setFormNotes] = useState('');
  const [buryCandidateRepo, setBuryCandidateRepo] = useState(null);

  // Stats Calculations
  const graveyardStats = useMemo(() => {
    if (graveyard.length === 0) {
      return { avgLifespan: 0, topReason: 'None', totalCustom: 0, totalGithub: 0 };
    }

    let totalDays = 0;
    const reasonsMap = {};
    let githubCount = 0;

    graveyard.forEach(p => {
      const start = new Date(p.startDate);
      const end = new Date(p.abandonedDate);
      const diff = Math.max(0, Math.ceil((end - start) / 86400000));
      totalDays += diff;

      reasonsMap[p.reason] = (reasonsMap[p.reason] || 0) + 1;
      if (p.isGithubRepo) githubCount++;
    });

    const sortedReasons = Object.entries(reasonsMap).sort((a, b) => b[1] - a[1]);
    const topReason = sortedReasons.length > 0 ? sortedReasons[0][0] : 'None';

    return {
      avgLifespan: Math.round(totalDays / graveyard.length),
      topReason,
      totalCustom: graveyard.length - githubCount,
      totalGithub: githubCount
    };
  }, [graveyard]);

  // Failure reasons chart data
  const reasonChartData = useMemo(() => {
    const counts = {
      'lost interest': 0,
      'too complex': 0,
      'no time': 0,
      'tutorial hell': 0,
      'shiny object syndrome': 0,
      'refactor loop': 0
    };

    graveyard.forEach(p => {
      if (counts[p.reason] !== undefined) {
        counts[p.reason]++;
      }
    });

    return Object.entries(counts).map(([reason, count]) => ({
      name: REASON_METADATA[reason]?.label.split(' ')[0] || reason,
      fullName: REASON_METADATA[reason]?.label || reason,
      count
    }));
  }, [graveyard]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 4000);
  };

  // Add/Bury operations
  const handleBuryProject = (e) => {
    e.preventDefault();
    if (!formName.trim()) return;

    const newTombstone = {
      id: buryCandidateRepo ? `github-${buryCandidateRepo.id}` : `custom-${Date.now()}`,
      name: formName.trim(),
      description: formDesc.trim(),
      techStack: formTech.trim(),
      startDate: formStart || new Date(Date.now() - 86400000 * 30).toISOString().split('T')[0],
      abandonedDate: formEnd || new Date().toISOString().split('T')[0],
      reason: formReason,
      notes: formNotes.trim(),
      isGithubRepo: !!buryCandidateRepo,
      githubUrl: buryCandidateRepo ? buryCandidateRepo.html_url : undefined
    };

    setGraveyard([newTombstone, ...graveyard]);
    showToast(`🪦 Successfully buried project "${newTombstone.name}" in the graveyard.`);

    // Reset Form
    setFormName('');
    setFormDesc('');
    setFormTech('');
    setFormStart('');
    setFormEnd('');
    setFormReason('shiny object syndrome');
    setFormNotes('');
    setBuryCandidateRepo(null);
    setShowAddForm(false);
  };

  const handleReviveProject = (id, name) => {
    setGraveyard(graveyard.filter(p => p.id !== id));
    showToast(`⚡ Project "${name}" has been resurrected! Code cycles activated.`);
  };

  const handleOpenBuryCandidate = (repo) => {
    setBuryCandidateRepo(repo);
    setFormName(repo.name);
    setFormDesc(repo.description || 'Auto-imported inactive GitHub repository');
    setFormTech(repo.language || 'N/A');
    setFormStart(new Date(repo.created_at).toISOString().split('T')[0]);
    setFormEnd(new Date(repo.pushed_at).toISOString().split('T')[0]);
    setShowAddForm(true);
  };

  // Candidates for GitHub Burying (not yet in graveyard)
  const buryCandidates = useMemo(() => {
    if (!data?.abandoned) return [];
    return data.abandoned.filter(repo => !graveyard.some(g => g.id === `github-${repo.id}`));
  }, [data?.abandoned, graveyard]);

  // ── Not connected state ──
  if (!user?.githubConnected) {
    return (
      <div className="flex flex-col items-center justify-center gap-6 py-24 px-8 text-center">
        <div className="grid h-20 w-20 place-content-center rounded-3xl bg-slate-800/60 border border-slate-700">
          <svg className="h-10 w-10 fill-slate-400" viewBox="0 0 24 24">
            <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482C19.138 20.193 22 16.437 22 12.017 22 6.484 17.522 2 12 2z" />
          </svg>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white">GitHub Analyzer</h2>
          <p className="mt-2 max-w-sm text-sm text-slate-400">
            Connect your GitHub account from the Overview tab to unlock deep analysis of your repositories, commits, and coding patterns.
          </p>
        </div>
      </div>
    );
  }

  // ── Loading state ──
  if (loading) {
    return (
      <div className="p-4 sm:p-6">
        <div className="mb-6 flex items-center gap-3">
          <div className="h-9 w-9 animate-spin rounded-full border-[3px] border-cyan-400 border-t-transparent" />
          <div>
            <p className="text-sm font-semibold text-slate-200">Analyzing GitHub profile…</p>
            <p className="text-[11px] text-slate-500 font-mono">Fetching repos, commits & patterns for @{user.githubUsername}</p>
          </div>
        </div>
        <LoadingSkeleton />
      </div>
    );
  }

  // ── Error state ──
  if (error) {
    const isAuthError = error.includes('401') || error.toLowerCase().includes('unauthorized');
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-20 px-8 text-center max-w-md mx-auto">
        <div className="text-4xl">⚠️</div>
        <div>
          <p className="text-sm font-semibold text-rose-300">
            {isAuthError ? 'GitHub Authentication Failed' : 'Analysis Failed'}
          </p>
          <p className="mt-2 text-xs text-slate-500 leading-relaxed">
            {isAuthError
              ? 'Your GitHub Access Token is invalid or has expired. Please disconnect and link again with a valid token.'
              : error}
          </p>
        </div>
        <div className="flex gap-3 mt-2">
          {isAuthError ? (
            <button
              onClick={disconnectGitHub}
              className="rounded-xl bg-rose-500 hover:bg-rose-400 px-5 py-2.5 text-xs font-bold text-slate-950 transition-colors"
            >
              Disconnect & Reconnect
            </button>
          ) : (
            <button
              onClick={refetch}
              className="rounded-xl bg-slate-800 hover:bg-slate-700 px-5 py-2.5 text-xs font-semibold text-slate-200 transition-colors"
            >
              Retry Analysis
            </button>
          )}
        </div>
      </div>
    );
  }

  if (!data) return null;

  const {
    profile, languages, patterns, insights, abandoned,
    totalRepos, totalStars, totalCommitsAnalyzed,
    topByStars, recentRepos,
  } = data;

  const chartData = activeChart === 'hourly'
    ? patterns.hourlyData
    : activeChart === 'daily'
      ? patterns.dailyData
      : patterns.sortedWeeks.map(w => ({ day: w.week, commits: w.count }));

  const chartKey = activeChart === 'hourly' ? 'hour' : 'day';

  // ─── Graveyard Studio Sub-View Layout ──────────────────────────────────────
  if (showGraveyardStudio) {
    return (
      <div className="space-y-6 p-4 sm:p-6 relative animate-fade-in">
        
        {toastMessage && (
          <div className="fixed top-5 right-5 z-50 rounded-xl border border-rose-500/35 bg-slate-900 px-5 py-3 text-xs text-rose-300 font-semibold shadow-2xl backdrop-blur-md">
            {toastMessage}
          </div>
        )}

        {/* Studio Header */}
        <div className="flex items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div>
            <h2 className="text-xl font-bold text-white tracking-wide font-sans flex items-center gap-2">
              <span>Project Graveyard Studio</span>
              <span className="text-lg">🪦</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Self-reflect on projects you laid to rest, evaluate failure reasons, and resurrect side quests.
            </p>
          </div>
          <button
            onClick={() => { setShowGraveyardStudio(false); setShowAddForm(false); }}
            className="rounded-xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-xs font-bold text-cyan-400 hover:text-cyan-300 transition-colors"
          >
            ← Back to Analyzer
          </button>
        </div>

        {/* Stats Summary Panel */}
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          <StatCard label="Total Buried" value={graveyard.length} sub={`${graveyardStats.totalGithub} GitHub · ${graveyardStats.totalCustom} Custom`} accent="rose" />
          <StatCard label="Avg Lifespan" value={graveyard.length > 0 ? `${graveyardStats.avgLifespan} days` : '0 days'} sub="start → last activity" accent="cyan" />
          <StatCard label="Primary Cause of Death" value={REASON_METADATA[graveyardStats.topReason]?.label || 'None'} sub="most common failure rate" accent="amber" />
          <StatCard label="GitHub Candidates" value={buryCandidates.length} sub="dormant repos (6mo+ inactive)" accent="indigo" />
        </div>

        {/* Stats charts */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="p-5 md:col-span-2">
            <h3 className="text-sm font-semibold text-slate-100 mb-4">Abandonment Failure Reasons</h3>
            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={reasonChartData} margin={{ top: 0, right: 0, bottom: 0, left: -20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                  <XAxis dataKey="name" stroke="#475569" tick={{ fontSize: 10 }} />
                  <YAxis stroke="#475569" tick={{ fontSize: 10 }} />
                  <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: 8, fontSize: 11 }} />
                  <Bar dataKey="count" fill="#f43f5e" radius={[4, 4, 0, 0]} maxBarSize={36} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card className="p-5 flex flex-col justify-between">
            <div>
              <h3 className="text-sm font-semibold text-slate-100 mb-1">Dormant GitHub Repositories</h3>
              <p className="text-[10px] text-slate-500 mb-3">Inactive repository streams detected via Analyzer</p>
              
              {buryCandidates.length === 0 ? (
                <div className="py-6 text-center border border-dashed border-slate-800 rounded-xl">
                  <span className="text-xl">🌟</span>
                  <p className="text-xs text-slate-400 font-semibold mt-1">All clean! No inactive candidates found.</p>
                </div>
              ) : (
                <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
                  {buryCandidates.map(candidate => (
                    <div key={candidate.id} className="flex items-center justify-between gap-2 p-2 rounded bg-slate-950 border border-slate-850">
                      <div className="min-w-0">
                        <p className="text-[11px] font-bold text-slate-200 truncate">{candidate.name}</p>
                        <p className="text-[9px] text-slate-500">Pushed {new Date(candidate.pushed_at).toLocaleDateString()}</p>
                      </div>
                      <button
                        onClick={() => handleOpenBuryCandidate(candidate)}
                        className="rounded bg-rose-500/10 hover:bg-rose-500/20 px-2 py-1 text-[9px] font-bold text-rose-400 border border-rose-500/15 flex-shrink-0 transition-colors"
                      >
                        Bury 🪦
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={() => { setBuryCandidateRepo(null); setShowAddForm(true); }}
              className="w-full mt-4 rounded-xl bg-slate-900 border border-slate-800 hover:border-rose-500/20 py-2.5 text-xs font-semibold text-rose-400 hover:text-rose-300 transition-all uppercase tracking-wider"
            >
              ➕ Bury Custom Offline Project
            </button>
          </Card>
        </div>

        {/* Interactive Tombstones Grid */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500">Active Tombstones & Reflections</h3>
          
          {graveyard.length === 0 ? (
            <div className="rounded-2xl border border-slate-800 bg-slate-900/30 py-12 text-center">
              <span className="text-3xl">🕊️</span>
              <p className="text-sm text-slate-400 font-semibold mt-2">No projects laid to rest yet. Keep building!</p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {graveyard.map(project => {
                const reasonMeta = REASON_METADATA[project.reason] || { label: project.reason, color: 'bg-slate-500/10 text-slate-400' };
                const days = Math.max(0, Math.ceil((new Date(project.abandonedDate) - new Date(project.startDate)) / 86400000));
                
                return (
                  <Card key={project.id} className="p-5 flex flex-col justify-between border-slate-800/80 hover:border-slate-700/80 hover:shadow-xl transition-all">
                    <div>
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div>
                          <h4 className="text-sm font-extrabold text-slate-200 flex items-center gap-1.5">
                            <span>{project.name}</span>
                            {project.isGithubRepo && <span className="text-[9px] bg-cyan-500/10 text-cyan-400 border border-cyan-500/25 px-1 py-0.5 rounded">github</span>}
                          </h4>
                          <p className="text-[10px] text-slate-500 mt-0.5 font-mono">
                            Lifespan: {days} {days === 1 ? 'day' : 'days'} ({new Date(project.startDate).toLocaleDateString(undefined, {month:'short', year:'numeric'})})
                          </p>
                        </div>
                        <span className={`text-[9px] rounded-lg border px-2 py-0.5 font-bold uppercase tracking-wide shrink-0 ${reasonMeta.color}`}>
                          {reasonMeta.label}
                        </span>
                      </div>

                      {project.description && (
                        <p className="text-xs text-slate-400 leading-relaxed mb-3 line-clamp-2">{project.description}</p>
                      )}

                      {project.notes && (
                        <div className="bg-slate-950/80 border border-slate-850 rounded-xl p-3 text-[11px] text-slate-500 font-mono leading-relaxed mt-2">
                          <span className="text-[9px] uppercase tracking-wider text-slate-400 font-bold block mb-1">Post-Mortem Lesson:</span>
                          "{project.notes}"
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2 mt-4 pt-3 border-t border-slate-850">
                      {project.githubUrl && (
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[10px] font-bold text-slate-400 hover:text-cyan-400 mr-auto"
                        >
                          View Code
                        </a>
                      )}
                      
                      <button
                        onClick={() => handleReviveProject(project.id, project.name)}
                        className="rounded-lg bg-emerald-500/10 border border-emerald-500/20 hover:bg-emerald-500 hover:text-slate-950 px-3 py-1.5 text-[10px] font-bold text-emerald-400 transition-all uppercase tracking-wider"
                      >
                        Revive ⚡
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm(`Delete ${project.name} permanently?`)) {
                            setGraveyard(graveyard.filter(p => p.id !== project.id));
                            showToast(`⚰️ Permadeleted project "${project.name}"`);
                          }
                        }}
                        className="rounded-lg bg-rose-500/10 border border-rose-500/20 hover:bg-rose-500 hover:text-white px-3 py-1.5 text-[10px] font-bold text-rose-450 transition-all"
                      >
                        Perma-delete
                      </button>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>

        {/* ─── Add/Bury Form Drawer Modal ─────────────────────────── */}
        {showAddForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-md p-4">
            <div className="relative w-full max-w-lg rounded-2xl border border-slate-850 bg-slate-900 p-6 shadow-2xl backdrop-blur-xl">
              <h3 className="text-base font-bold text-white mb-1">
                {buryCandidateRepo ? `🪦 Bury GitHub Repo: ${buryCandidateRepo.name}` : '➕ Bury New Offline Project'}
              </h3>
              <p className="text-[11px] text-slate-400 mb-4 leading-relaxed">
                Log why you decided to step away from this codebase and what lessons you take away with you.
              </p>

              <form onSubmit={handleBuryProject} className="space-y-4">
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Project Name</label>
                    <input
                      type="text"
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2.5 text-xs text-slate-200 focus:border-rose-400 focus:ring-1 focus:ring-rose-400 transition-colors"
                      required
                      disabled={!!buryCandidateRepo}
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Tech Stack</label>
                    <input
                      type="text"
                      placeholder="e.g. React, Next.js, Rust"
                      value={formTech}
                      onChange={(e) => setFormTech(e.target.value)}
                      className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2.5 text-xs text-slate-200 focus:border-rose-400 focus:ring-1 focus:ring-rose-400 transition-colors"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Project Description</label>
                  <input
                    type="text"
                    placeholder="What was this project supposed to do?"
                    value={formDesc}
                    onChange={(e) => setFormDesc(e.target.value)}
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2.5 text-xs text-slate-200 focus:border-rose-400 focus:ring-1 focus:ring-rose-400 transition-colors"
                  />
                </div>

                <div className="grid gap-3 sm:grid-cols-3">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Date Started</label>
                    <input
                      type="date"
                      value={formStart}
                      onChange={(e) => setFormStart(e.target.value)}
                      className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2.5 text-xs text-slate-200 focus:border-rose-400 focus:ring-1 focus:ring-rose-400 transition-colors"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Date Abandoned</label>
                    <input
                      type="date"
                      value={formEnd}
                      onChange={(e) => setFormEnd(e.target.value)}
                      className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2.5 text-xs text-slate-200 focus:border-rose-400 focus:ring-1 focus:ring-rose-400 transition-colors"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Cause of Death</label>
                    <select
                      value={formReason}
                      onChange={(e) => setFormReason(e.target.value)}
                      className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2.5 text-xs text-slate-350 focus:border-rose-400 focus:ring-1 focus:ring-rose-400 transition-colors"
                    >
                      {Object.keys(REASON_METADATA).map(r => (
                        <option key={r} value={r}>{REASON_METADATA[r].label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Post-Mortem Lessons Learned</label>
                  <textarea
                    rows={3}
                    placeholder="e.g. Next time, I should sketch the database schema first instead of writing code on day one..."
                    value={formNotes}
                    onChange={(e) => setFormNotes(e.target.value)}
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2.5 text-xs text-slate-200 focus:border-rose-400 focus:ring-1 focus:ring-rose-400 transition-colors resize-none"
                    required
                  />
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => { setShowAddForm(false); setBuryCandidateRepo(null); }}
                    className="rounded-xl border border-slate-800 px-4 py-2.5 text-xs font-semibold text-slate-300 hover:bg-slate-800 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-xl bg-rose-500 hover:bg-rose-400 px-5 py-2.5 text-xs font-bold text-slate-950 transition-colors shadow-lg shadow-rose-500/10"
                  >
                    Lay to Rest 🪦
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    );
  }

  // ─── Regular GitHub Analyzer Layout ────────────────────────────────────────
  return (
    <div className="space-y-6 p-4 sm:p-6">

      {/* ── Profile header ───────────────────────────────────────── */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <img
            src={profile.avatar_url}
            alt={profile.login}
            className="h-14 w-14 rounded-2xl border-2 border-cyan-500/30 object-cover shadow-lg shadow-cyan-500/10"
          />
          <div>
            <h2 className="text-xl font-bold text-white">{profile.name || profile.login}</h2>
            <a
              href={profile.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-mono text-cyan-400 hover:underline"
            >
              @{profile.login}
            </a>
            {profile.bio && <p className="mt-0.5 text-xs text-slate-400 max-w-sm">{profile.bio}</p>}
          </div>
        </div>
        <button
          onClick={refetch}
          title="Refresh analysis"
          className="rounded-xl border border-slate-800 bg-slate-900 p-2.5 text-slate-400 hover:text-cyan-400 hover:border-cyan-500/30 transition-colors"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
      </div>

      {/* ── Stat cards ───────────────────────────────────────────── */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard label="Public Repos" value={totalRepos} sub={`${data.totalForks} forks`} accent="cyan" />
        <StatCard label="Total Stars" value={totalStars} sub="across all repos" accent="amber" />
        <StatCard label="Commits Analyzed" value={totalCommitsAnalyzed} sub="last 5 active repos" accent="indigo" />
        <StatCard label="Followers" value={profile.followers ?? '—'} sub={`${profile.following ?? 0} following`} accent="emerald" />
      </div>

      {/* ── Insights ─────────────────────────────────────────────── */}
      <div>
        <h3 className="mb-3 text-xs font-bold uppercase tracking-widest text-slate-500">Developer Insights</h3>
        <div className="grid gap-2 sm:grid-cols-2">
          {insights.map((text, i) => <InsightCard key={i} text={text} />)}
        </div>
      </div>

      {/* ── Commit activity chart ─────────────────────────────────── */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
        <div className="mb-4 flex items-center justify-between gap-3 flex-wrap">
          <h3 className="text-sm font-semibold text-slate-100">Commit Activity</h3>
          <div className="flex gap-1 rounded-lg bg-slate-950/60 p-1 border border-slate-800">
            {['hourly', 'daily', 'weekly'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveChart(tab)}
                className={`rounded-md px-3 py-1 text-[10px] font-bold uppercase tracking-wide transition-all ${
                  activeChart === tab ? 'bg-cyan-400 text-slate-950' : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 0, right: 0, bottom: 0, left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis
                dataKey={chartKey}
                stroke="#475569"
                tick={{ fontSize: 10, fill: '#475569' }}
                interval="preserveStartEnd"
              />
              <YAxis stroke="#475569" tick={{ fontSize: 10, fill: '#475569' }} />
              <Tooltip
                contentStyle={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: 12, color: '#e2e8f0', fontSize: 12 }}
                cursor={{ fill: 'rgba(34,211,238,0.06)' }}
              />
              <Bar dataKey="commits" fill="#22d3ee" radius={[4, 4, 0, 0]} maxBarSize={32} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <p className="mt-2 text-center text-[10px] text-slate-600">
          Peak: <span className="text-cyan-400 font-semibold">{patterns.peakDay}</span> · Favorite time: <span className="text-cyan-400 font-semibold">{patterns.timeLabel}</span>
        </p>
      </div>

      {/* ── Languages & Abandoned ─────────────────────────────────── */}
      <div className="grid gap-4 md:grid-cols-2">

        {/* Language distribution */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
          <h3 className="mb-4 text-sm font-semibold text-slate-100">Language Distribution</h3>
          <div className="space-y-2.5">
            {languages.slice(0, 6).map(({ lang, pct }) => (
              <div key={lang}>
                <div className="mb-1 flex justify-between text-[11px]">
                  <span className="font-semibold text-slate-300">{lang}</span>
                  <span className="font-mono text-slate-500">{pct}%</span>
                </div>
                <div className="h-1.5 rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${pct}%`, backgroundColor: langColor(lang) }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Interactive Graveyard Preview Card */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 flex flex-col justify-between min-h-[220px]">
          <div>
            <h3 className="text-sm font-semibold text-slate-100 flex items-center justify-between">
              <span>Project Graveyard 🪦</span>
              {buryCandidates.length > 0 && (
                <span className="rounded-full bg-rose-500/10 border border-rose-500/20 px-2 py-0.5 text-[9px] font-bold text-rose-450 uppercase animate-pulse">
                  {buryCandidates.length} Dormant
                </span>
              )}
            </h3>
            <p className="text-[11px] text-slate-500 mt-1">Reflect on discontinued work, study coding failure loops & resurrect old projects.</p>

            <div className="mt-4 flex items-center gap-4 bg-slate-950/65 rounded-xl p-3 border border-slate-850">
              <span className="text-2xl select-none">🪦</span>
              <div className="min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Currently Buried</p>
                <p className="text-sm font-extrabold text-white mt-0.5">
                  {graveyard.length} Projects
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={() => setShowGraveyardStudio(true)}
            className="w-full mt-4 rounded-xl bg-slate-950 hover:bg-slate-900 border border-slate-800 hover:border-rose-500/20 py-2.5 text-xs font-bold text-rose-400 hover:text-rose-350 transition-colors uppercase tracking-wider"
          >
            Enter Graveyard Studio →
          </button>
        </div>
      </div>

      {/* ── Top repos by stars ────────────────────────────────────── */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
        <h3 className="mb-3 text-sm font-semibold text-slate-100">Top Repositories ⭐</h3>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {topByStars.map(repo => (
            <a
              key={repo.id}
              href={repo.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="group rounded-xl border border-slate-800 bg-slate-950/40 p-3.5 hover:border-cyan-500/25 hover:bg-slate-800/40 transition-all"
            >
              <div className="flex items-start justify-between gap-2 mb-1">
                <p className="text-xs font-bold text-slate-200 group-hover:text-white truncate">{repo.name}</p>
                <div className="flex items-center gap-0.5 text-[10px] text-amber-400 flex-shrink-0">
                  <span>⭐</span>
                  <span className="font-mono">{repo.stargazers_count}</span>
                </div>
              </div>
              {repo.description && (
                <p className="text-[10px] text-slate-500 leading-relaxed line-clamp-2">{repo.description}</p>
              )}
              <div className="mt-2 flex items-center gap-2">
                {repo.language && (
                  <span className="flex items-center gap-1 text-[9px] text-slate-500">
                    <span className="h-2 w-2 rounded-full" style={{ backgroundColor: langColor(repo.language) }} />
                    {repo.language}
                  </span>
                )}
                <span className="text-[9px] text-slate-600 ml-auto">
                  {repo.forks_count > 0 && `🍴 ${repo.forks_count}`}
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* ── Recent activity ───────────────────────────────────────── */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
        <h3 className="mb-3 text-sm font-semibold text-slate-100">Recent Activity</h3>
        <div className="space-y-1.5">
          {recentRepos.slice(0, 6).map(repo => {
            const daysAgo = Math.floor((Date.now() - new Date(repo.pushed_at)) / 86400000);
            return (
              <a
                key={repo.id}
                href={repo.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between rounded-lg border border-slate-800/60 bg-slate-950/30 px-3 py-2.5 hover:border-slate-700 transition-colors group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className="h-2.5 w-2.5 flex-shrink-0 rounded-full"
                    style={{ backgroundColor: repo.language ? langColor(repo.language) : '#334155' }}
                  />
                  <p className="truncate text-xs font-semibold text-slate-300 group-hover:text-white">{repo.name}</p>
                  {repo.fork && (
                    <span className="flex-shrink-0 rounded bg-slate-800 px-1 py-0.5 text-[8px] text-slate-500">fork</span>
                  )}
                </div>
                <span className="ml-3 flex-shrink-0 text-[10px] text-slate-600 font-mono">
                  {daysAgo === 0 ? 'today' : daysAgo === 1 ? '1d ago' : `${daysAgo}d ago`}
                </span>
              </a>
            );
          })}
        </div>
      </div>

    </div>
  );
};

export default GitHubAnalyzer;
