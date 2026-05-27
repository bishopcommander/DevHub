import React, { useMemo, useState } from 'react';
import Card from '../ui/Card';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { useAuth } from '../../context/AuthContext';
import { useMusic, MOODS_META } from '../../context/MusicContext';
import GitHubAnalyzer from './GitHubAnalyzer';
import BuildInPublicTracker from './BuildInPublicTracker';
import DevBingo from './DevBingo';
import MoodMusic from './MoodMusic';
import StackDecider from './StackDecider';
import AIExplainer from './AIExplainer';

// ── Mini Mood Music widget for Overview grid ─────────────────────────
const MoodMusicMiniWidget = ({ setActive }) => {
  const {
    activeMood, setActiveMood,
    activeVideoId, setActiveVideoId,
    isPlaying,
    getTracksForMood, playTrack, stopPlayer,
  } = useMusic();

  const tracks = getTracksForMood(activeMood);
  const currentIndex = tracks.findIndex(t => t.id === activeVideoId);
  const currentTrack = tracks[currentIndex] || tracks[0];
  const moodMeta = MOODS_META[activeMood] || MOODS_META.focus;

  const changeMood = (newMood) => {
    const tracksForNewMood = getTracksForMood(newMood);
    const firstTrackId = tracksForNewMood[0]?.id;
    if (isPlaying) {
      if (firstTrackId) {
        playTrack(firstTrackId, newMood);
      }
    } else {
      setActiveMood(newMood);
      if (firstTrackId) {
        setActiveVideoId(firstTrackId);
      }
    }
  };

  const handlePrev = () => {
    const prevIdx = currentIndex <= 0 ? tracks.length - 1 : currentIndex - 1;
    playTrack(tracks[prevIdx].id, activeMood);
  };

  const handleNext = () => {
    const nextIdx = currentIndex >= tracks.length - 1 ? 0 : currentIndex + 1;
    playTrack(tracks[nextIdx].id, activeMood);
  };

  const handlePlayPause = () => {
    if (isPlaying) {
      stopPlayer();
    } else if (currentTrack) {
      playTrack(currentTrack.id, activeMood);
    }
  };

  return (
    <Card className="p-5 flex flex-col justify-between min-h-[340px]">
      <div>
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-100">Mood Music</h3>
          <span className={`rounded-full ${moodMeta.badge} px-2 py-0.5 text-[9px] font-bold uppercase`}>
            {moodMeta.emoji} {moodMeta.label}
          </span>
        </div>

        {/* Mood Shifter Control Row */}
        <div className="mt-3 flex flex-wrap gap-1.5">
          {Object.entries(MOODS_META).map(([moodKey, meta]) => {
            const isActive = activeMood === moodKey;
            const shortLabel = moodKey === 'focus' ? 'Focus' 
                             : moodKey === 'debug' ? 'Debug' 
                             : moodKey === 'burnout' ? 'Recovery' 
                             : 'Chill';
            return (
              <button
                key={moodKey}
                type="button"
                onClick={() => changeMood(moodKey)}
                className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-bold border transition-all ${
                  isActive
                    ? `border-cyan-500/30 bg-cyan-500/10 text-cyan-400 font-extrabold`
                    : 'border-slate-800 bg-slate-950/20 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                }`}
              >
                <span>{meta.emoji}</span>
                <span>{shortLabel}</span>
              </button>
            );
          })}
        </div>

        <div className="mt-4 rounded-xl border border-slate-800 bg-slate-900 p-4">
          <p className="text-xs uppercase tracking-widest text-slate-400">
            {isPlaying ? 'Now Playing' : 'Ready to Play'}
          </p>
          <p className="mt-2 text-lg font-semibold text-cyan-300 truncate">
            {currentTrack?.name || 'No track selected'}
          </p>
          <p className="text-sm text-slate-400 truncate">
            {currentTrack?.desc || 'Select a mood to start'}
          </p>

          {/* Playing indicator */}
          <div className="mt-4 h-1.5 rounded-full bg-slate-800 overflow-hidden">
            {isPlaying ? (
              <div className="h-1.5 rounded-full bg-cyan-400 animate-pulse" style={{ width: '60%' }} />
            ) : (
              <div className="h-1.5 rounded-full bg-slate-700" style={{ width: '0%' }} />
            )}
          </div>

          {/* Controls */}
          <div className="mt-4 flex gap-2">
            <button
              onClick={handlePrev}
              className="rounded-lg border border-slate-700 px-3 py-2 text-xs text-slate-200 hover:bg-slate-800 transition-colors"
            >
              Prev
            </button>
            <button
              onClick={handlePlayPause}
              className={`rounded-lg px-3 py-2 text-xs font-semibold transition-colors ${
                isPlaying
                  ? 'bg-rose-500 hover:bg-rose-400 text-white'
                  : 'bg-cyan-400 hover:bg-cyan-300 text-slate-950'
              }`}
            >
              {isPlaying ? 'Stop' : 'Play'}
            </button>
            <button
              onClick={handleNext}
              className="rounded-lg border border-slate-700 px-3 py-2 text-xs text-slate-200 hover:bg-slate-800 transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      <button
        onClick={() => setActive('music')}
        className="w-full mt-4 rounded-xl bg-slate-900 border border-slate-800 hover:border-cyan-500/20 py-2.5 text-xs font-semibold text-cyan-400 transition-colors shadow-sm"
      >
        Open Mood Studio →
      </button>
    </Card>
  );
};

const DashboardPanels = ({ active, data, setActive }) => {
  const { user, connectGitHub, disconnectGitHub } = useAuth();
  const [checked, setChecked] = useState(new Set());

  // Dynamically load streak from localStorage
  const currentStreak = useMemo(() => {
    try {
      const saved = localStorage.getItem('devhub_public_streak_state');
      if (saved) {
        return JSON.parse(saved).currentStreak || 0;
      }
    } catch (e) {}
    return 0;
  }, [active]);

  // Dynamically load checks from localStorage for Bingo mini-grid
  const checkedBingoIds = useMemo(() => {
    try {
      const saved = localStorage.getItem('devhub_bingo_checks');
      if (saved) {
        return new Set(JSON.parse(saved));
      }
    } catch (e) {}
    return new Set(['free']);
  }, [active]);

  const bingoBoardLayout = useMemo(() => {
    try {
      const saved = localStorage.getItem('devhub_bingo_board');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {}
    return [];
  }, [active]);

  // GitHub link modal state
  const [showConnectModal, setShowConnectModal] = useState(false);
  const [githubInput, setGithubInput] = useState('');
  const [githubTokenInput, setGithubTokenInput] = useState('');
  const [modalError, setModalError] = useState('');
  const [linkingStep, setLinkingStep] = useState(0);
  const [isLinking, setIsLinking] = useState(false);

  const items = useMemo(() => {
    if (active === 'overview') return ['explainer', 'tracker', 'bingo', 'music'];
    if (active === 'analyzer') return [];
    return [active];
  }, [active]);

  const toggle = (task) => {
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(task)) next.delete(task);
      else next.add(task);
      return next;
    });
  };

  const closeModal = () => {
    setShowConnectModal(false);
    setGithubInput('');
    setGithubTokenInput('');
    setModalError('');
    setLinkingStep(0);
    setIsLinking(false);
  };

  const handleLinkGitHub = async (e) => {
    e.preventDefault();
    if (!githubInput.trim() || !githubTokenInput.trim()) return;

    setModalError('');
    setIsLinking(true);

    // Step 1 — fire the real API call first before showing animation steps
    // so we fail fast before committing to the full animation sequence
    setLinkingStep(1);
    await new Promise(r => setTimeout(r, 400));

    try {
      setLinkingStep(2);
      await new Promise(r => setTimeout(r, 600));

      // connectGitHub does the real GitHub API validation
      await connectGitHub(githubInput.trim(), githubTokenInput.trim());

      setLinkingStep(3);
      await new Promise(r => setTimeout(r, 500));
      setLinkingStep(4);
      await new Promise(r => setTimeout(r, 500));
      setLinkingStep(5);
      await new Promise(r => setTimeout(r, 400));

      closeModal();
    } catch (err) {
      // Stop animation, surface the real error inside the modal
      setIsLinking(false);
      setLinkingStep(0);
      setModalError(err.message || 'Failed to verify GitHub account. Please check your credentials.');
    }
  };

  // GitHub Analyzer gets its own full-width layout
  if (active === 'analyzer') {
    return <GitHubAnalyzer setActive={setActive} />;
  }

  // Build-in-Public Tracker gets its own full-width layout
  if (active === 'tracker') {
    return <BuildInPublicTracker setActive={setActive} />;
  }

  // Dev Bingo gets its own full-width layout
  if (active === 'bingo') {
    return <DevBingo setActive={setActive} />;
  }

  // Mood Music gets its own full-width layout
  if (active === 'music') {
    return <MoodMusic setActive={setActive} />;
  }

  // Stack Decider gets its own full-width layout
  if (active === 'decider') {
    return <StackDecider setActive={setActive} />;
  }

  // AI Explainer gets its own full-width layout
  if (active === 'explainer') {
    return <AIExplainer setActive={setActive} />;
  }


  return (
    <div className="flex flex-col gap-5 p-4 sm:p-6">

      {/* ── GitHub integration warning banner ─────────────────────── */}
      {user && !user.githubConnected && (
        <div className="relative overflow-hidden rounded-3xl border border-cyan-500/25 bg-cyan-950/15 p-6 backdrop-blur-md shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="absolute -left-10 -top-10 h-40 w-40 rounded-full bg-cyan-500/10 blur-[85px] pointer-events-none" />
          <div className="absolute right-10 bottom-10 h-32 w-32 rounded-full bg-blue-600/5 blur-[75px] pointer-events-none" />

          <div className="relative z-10 flex items-start gap-4">
            <span className="text-3xl animate-bounce select-none">🚀</span>
            <div>
              <h3 className="text-base font-bold text-white tracking-wide">
                Link Your GitHub Account to Unlock Analytics
              </h3>
              <p className="mt-1 text-xs text-slate-400 max-w-2xl leading-relaxed">
                DevHub works best when connected to your GitHub profile. Link your account to populate developer statistics, analyze repo activity, and automatically track projects.
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowConnectModal(true)}
            className="group relative z-10 flex-shrink-0 flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 px-5 py-3 text-xs font-bold text-slate-950 transition-all duration-300 active:scale-[0.98] shadow-lg shadow-cyan-500/10"
          >
            <svg className="h-4 w-4 fill-slate-950" viewBox="0 0 24 24" aria-hidden="true">
              <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482C19.138 20.193 22 16.437 22 12.017 22 6.484 17.522 2 12 2z" />
            </svg>
            <span>Connect GitHub Account</span>
          </button>
        </div>
      )}

      {/* ── GitHub connected status bar ────────────────────────────── */}
      {user && user.githubConnected && (
        <div className="flex items-center justify-between gap-4 rounded-2xl border border-slate-800 bg-slate-900/35 px-5 py-3.5">
          <div className="flex items-center gap-3">
            <img
              src={user.githubAvatarUrl}
              alt={user.githubUsername}
              className="h-7 w-7 rounded-full border border-slate-700"
            />
            <span className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-xs font-semibold text-slate-300">
              Linked: <span className="font-bold font-mono text-cyan-400">@{user.githubUsername}</span>
            </span>
          </div>
          <button
            onClick={disconnectGitHub}
            className="text-[10px] font-bold uppercase tracking-wider text-slate-500 hover:text-rose-400 transition-colors"
          >
            Disconnect
          </button>
        </div>
      )}

      {/* ── Widget grid ───────────────────────────────────────────── */}
      <div className="grid gap-4 xl:grid-cols-2">
        {items.includes('explainer') && (
          <Card className="overflow-hidden">
            <div className="border-b border-slate-800 px-5 py-3 text-xs text-slate-400">editor.ts · main</div>
            <div className="grid gap-0 lg:grid-cols-2">
              <pre className="overflow-auto border-b border-slate-800 bg-[#0b1220] p-5 font-mono text-xs leading-6 text-cyan-200 lg:border-b-0 lg:border-r">{data.codeSample}</pre>
              <div className="space-y-3 p-5">
                <h3 className="text-lg font-semibold text-slate-100">AI Code Explainer</h3>
                {data.explanationSteps.map((step, idx) => (
                  <p key={step} className="text-sm text-slate-300">
                    <span className="mr-2 text-cyan-300">{idx + 1}.</span>{step}
                  </p>
                ))}
              </div>
            </div>
          </Card>
        )}

        {items.includes('tracker') && (
          <Card className="p-5 flex flex-col justify-between min-h-[300px]">
            <div>
              <h3 className="text-lg font-semibold text-slate-100 flex items-center justify-between">
                <span>Build-in-Public Tracker</span>
                <span className="rounded-full bg-cyan-500/10 border border-cyan-500/20 px-2 py-0.5 text-[9px] font-bold text-cyan-400 uppercase">Live</span>
              </h3>
              <p className="text-xs text-slate-500 mt-1">Cultivate consistency & log daily wins</p>

              <div className="mt-6 flex items-center gap-4 bg-slate-950/60 rounded-xl p-4 border border-slate-800/40">
                <span className="text-3xl animate-pulse select-none">🔥</span>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Current Streak</p>
                  <p className="text-xl font-extrabold text-white">
                    {currentStreak} {currentStreak === 1 ? 'day' : 'days'}
                  </p>
                  <p className="text-[9px] text-slate-500 mt-0.5">Keep shipping daily!</p>
                </div>
              </div>
            </div>

            <button
              onClick={() => setActive('tracker')}
              className="w-full mt-4 rounded-xl bg-slate-900 border border-slate-800 hover:border-cyan-500/20 py-2.5 text-xs font-semibold text-cyan-400 transition-colors shadow-sm"
            >
              Open Build-in-Public Studio →
            </button>
          </Card>
        )}

        {items.includes('bingo') && (
          <Card className="p-5 flex flex-col justify-between min-h-[300px]">
            <div>
              <h3 className="text-lg font-semibold text-slate-100 flex items-center justify-between">
                <span>Developer Habits Bingo</span>
                <span className="rounded-full bg-cyan-500/10 border border-cyan-500/20 px-2 py-0.5 text-[9px] font-bold text-cyan-400 uppercase">Interactive</span>
              </h3>
              <p className="text-xs text-slate-500 mt-1">Reflect on habit wins & share results</p>

              {/* Miniature 5x5 dot board matrix */}
              <div className="mt-5 flex items-center justify-between gap-4 bg-slate-950/40 rounded-xl p-4 border border-slate-850">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Board Progress</p>
                  <p className="text-xl font-extrabold text-white mt-1">
                    {checkedBingoIds.size}/25 <span className="text-xs font-normal text-slate-400">habits</span>
                  </p>
                  <p className="text-[9px] text-slate-500 mt-0.5">Free Space coffee break active</p>
                </div>

                <div className="grid grid-cols-5 gap-1 border border-slate-800 bg-slate-950 p-2 rounded-lg">
                  {[...Array(25)].map((_, idx) => {
                    const tileId = bingoBoardLayout[idx]?.id || (idx === 12 ? 'free' : '');
                    const isChecked = checkedBingoIds.has(tileId);
                    return (
                      <div
                        key={idx}
                        className={`h-2 w-2 rounded-full transition-colors ${
                          idx === 12
                            ? 'bg-amber-400'
                            : isChecked
                              ? 'bg-cyan-400 shadow-sm shadow-cyan-400'
                              : 'bg-slate-800'
                        }`}
                      />
                    );
                  })}
                </div>
              </div>
            </div>

            <button
              onClick={() => setActive('bingo')}
              className="w-full mt-4 rounded-xl bg-slate-900 border border-slate-800 hover:border-cyan-500/20 py-2.5 text-xs font-semibold text-cyan-400 transition-colors shadow-sm"
            >
              Open Dev Bingo Studio →
            </button>
          </Card>
        )}

        {items.includes('music') && (
          <MoodMusicMiniWidget setActive={setActive} />
        )}
      </div>

      {/* ── GitHub Link & Sync Wizard Modal ───────────────────────── */}
      {showConnectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4">
          <div className="relative w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900/95 p-6 shadow-2xl backdrop-blur-xl">
            {/* Header */}
            <h3 className="flex items-center gap-2 text-xl font-bold text-white">
              <svg className="h-5 w-5 fill-cyan-400" viewBox="0 0 24 24">
                <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482C19.138 20.193 22 16.437 22 12.017 22 6.484 17.522 2 12 2z" />
              </svg>
              Establish GitHub Link
            </h3>

            {/* Loading / sync animation */}
            {isLinking ? (
              <div className="my-8 flex flex-col items-center justify-center gap-4">
                <div className="h-10 w-10 animate-spin rounded-full border-[3px] border-cyan-400 border-t-transparent" />
                <div className="text-center">
                  <p className="text-xs font-semibold text-slate-200">
                    {linkingStep === 1 && 'Initializing secure connection...'}
                    {linkingStep === 2 && 'Verifying GitHub account via API...'}
                    {linkingStep === 3 && 'Fetching public repositories...'}
                    {linkingStep === 4 && 'Extracting developer profile stats...'}
                    {linkingStep === 5 && 'Finalizing workspace synchronization...'}
                  </p>
                  <p className="mt-1 font-mono text-[10px] text-slate-500">Please do not close this window</p>
                </div>
                {/* Step progress dots */}
                <div className="flex gap-1.5">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <div
                      key={s}
                      className={`h-1.5 w-1.5 rounded-full transition-all duration-300 ${
                        linkingStep >= s ? 'bg-cyan-400 scale-110' : 'bg-slate-700'
                      }`}
                    />
                  ))}
                </div>
              </div>
            ) : (
              <form onSubmit={handleLinkGitHub} className="mt-5 space-y-4">
                {/* Validation error banner */}
                {modalError && (
                  <div className="flex items-start gap-2 rounded-xl border border-rose-500/25 bg-rose-500/8 px-4 py-3 text-xs text-rose-300 leading-relaxed">
                    <span className="mt-0.5 text-rose-400 flex-shrink-0">✕</span>
                    <span>{modalError}</span>
                  </div>
                )}

                <div>
                  <label className="mb-2 block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    GitHub Username
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. torvalds or octocat"
                    value={githubInput}
                    onChange={(e) => { setGithubInput(e.target.value); setModalError(''); }}
                    className={`w-full rounded-xl border bg-slate-950 px-4 py-3 text-sm text-slate-100 placeholder-slate-600 focus:ring-1 transition-colors ${
                      modalError ? 'border-rose-500/50 focus:border-rose-500 focus:ring-rose-500/30' : 'border-slate-800 focus:border-cyan-400 focus:ring-cyan-400'
                    }`}
                    required
                    autoFocus
                  />
                </div>

                <div>
                  <label className="mb-2 block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Personal Access Token / Password
                  </label>
                  <input
                    type="password"
                    placeholder="ghp_••••••••••••••••••••"
                    value={githubTokenInput}
                    onChange={(e) => { setGithubTokenInput(e.target.value); setModalError(''); }}
                    className={`w-full rounded-xl border bg-slate-950 px-4 py-3 text-sm text-slate-100 placeholder-slate-600 focus:ring-1 transition-colors ${
                      modalError ? 'border-rose-500/50 focus:border-rose-500 focus:ring-rose-500/30' : 'border-slate-800 focus:border-cyan-400 focus:ring-cyan-400'
                    }`}
                    required
                  />
                  <p className="mt-1.5 text-[9px] text-slate-500 leading-normal">
                    Uses the public GitHub API to verify the account exists and fetch your real profile data. Token is stored locally only.
                  </p>
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="rounded-xl border border-slate-800 px-4 py-2.5 text-xs font-semibold text-slate-300 hover:bg-slate-800 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-xl bg-cyan-400 hover:bg-cyan-300 px-5 py-2.5 text-xs font-bold text-slate-950 transition-colors shadow-lg shadow-cyan-500/10"
                  >
                    Link & Sync Profile
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPanels;
