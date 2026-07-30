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
import Dashboard3DCanvas from './Dashboard3DCanvas';

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
          <h3 className="text-base font-bold text-stone-100 flex items-center gap-2">
            <span>Focus Mood Soundscape</span>
          </h3>
          <span className={`rounded-full ${moodMeta.badge} px-2.5 py-0.5 text-[9px] font-mono font-bold uppercase border border-amber-500/20`}>
            {moodMeta.emoji} {moodMeta.label}
          </span>
        </div>

        {/* Mood Shifter Control Row */}
        <div className="mt-4 flex flex-wrap gap-1.5">
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
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-semibold border transition-all ${
                  isActive
                    ? `border-amber-500/40 bg-amber-500/10 text-amber-300`
                    : 'border-stone-800 bg-stone-900/40 text-stone-400 hover:text-stone-200 hover:border-stone-700'
                }`}
              >
                <span>{meta.emoji}</span>
                <span>{shortLabel}</span>
              </button>
            );
          })}
        </div>

        <div className="mt-4 rounded-xl border border-stone-800 bg-stone-950/60 p-4">
          <p className="text-[10px] font-mono uppercase tracking-widest text-stone-500">
            {isPlaying ? 'Now Playing' : 'Ready to Stream'}
          </p>
          <p className="mt-1 text-base font-bold text-amber-300 truncate">
            {currentTrack?.name || 'No track selected'}
          </p>
          <p className="text-xs text-stone-400 truncate mt-0.5">
            {currentTrack?.desc || 'Select a mood to start'}
          </p>

          {/* Playing indicator */}
          <div className="mt-4 h-1 rounded-full bg-stone-800 overflow-hidden">
            {isPlaying ? (
              <div className="h-1 rounded-full bg-amber-400 animate-pulse" style={{ width: '60%' }} />
            ) : (
              <div className="h-1 rounded-full bg-stone-700" style={{ width: '0%' }} />
            )}
          </div>

          {/* Controls */}
          <div className="mt-4 flex gap-2">
            <button
              onClick={handlePrev}
              className="rounded-xl border border-stone-800 bg-stone-900/60 px-3 py-1.5 text-xs text-stone-300 hover:border-stone-700 transition-colors"
            >
              Prev
            </button>
            <button
              onClick={handlePlayPause}
              className={`rounded-xl px-4 py-1.5 text-xs font-bold transition-colors ${
                isPlaying
                  ? 'bg-rose-500 hover:bg-rose-400 text-stone-950'
                  : 'bg-amber-500 hover:bg-amber-400 text-stone-950 shadow-md shadow-amber-500/20'
              }`}
            >
              {isPlaying ? 'Stop' : 'Play'}
            </button>
            <button
              onClick={handleNext}
              className="rounded-xl border border-stone-800 bg-stone-900/60 px-3 py-1.5 text-xs text-stone-300 hover:border-stone-700 transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      <button
        onClick={() => setActive('music')}
        className="w-full mt-4 rounded-xl bg-stone-900/80 border border-stone-800 hover:border-amber-500/30 py-2.5 text-xs font-bold text-amber-400 transition-all shadow-sm"
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

    setLinkingStep(1);
    await new Promise(r => setTimeout(r, 400));

    try {
      setLinkingStep(2);
      await new Promise(r => setTimeout(r, 600));

      await connectGitHub(githubInput.trim(), githubTokenInput.trim());

      setLinkingStep(3);
      await new Promise(r => setTimeout(r, 500));
      setLinkingStep(4);
      await new Promise(r => setTimeout(r, 500));
      setLinkingStep(5);
      await new Promise(r => setTimeout(r, 400));

      closeModal();
    } catch (err) {
      setIsLinking(false);
      setLinkingStep(0);
      setModalError(err.message || 'Failed to verify GitHub account. Please check your credentials.');
    }
  };

  if (active === 'analyzer')  return <GitHubAnalyzer setActive={setActive} />;
  if (active === 'tracker')   return <BuildInPublicTracker setActive={setActive} />;
  if (active === 'bingo')     return <DevBingo setActive={setActive} />;
  if (active === 'music')     return <MoodMusic setActive={setActive} />;
  if (active === 'decider')   return <StackDecider setActive={setActive} />;
  if (active === 'explainer') return <AIExplainer setActive={setActive} />;

  return (
    <div className="flex flex-col gap-6 p-4 sm:p-6 bg-[#090807] min-h-screen font-sans">
    
      {/* ── 3D Activity Matrix (Microservice 8083) ─────────────── */}
      {active === 'overview' && data?.visual3dBarNodes && (
        <Card className="p-0 overflow-hidden">
           <div className="p-5 border-b border-stone-800/80 flex items-center justify-between bg-stone-950/60">
             <div>
               <h3 className="text-base font-bold text-stone-100 flex items-center gap-3">
                 <span>Developer Activity Matrix</span>
                 <span className="rounded-md bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 text-[9px] font-mono font-bold uppercase text-amber-400">Microservice :8083</span>
               </h3>
               <p className="text-xs text-stone-400 mt-1 font-light">Interactive 3D representation of your weekly deep work focus hours.</p>
             </div>
           </div>
           <Dashboard3DCanvas barNodes={data.visual3dBarNodes} />
        </Card>
      )}

      {/* ── GitHub integration warning banner ─────────────────────── */}
      {user && !user.githubConnected && (
        <div className="relative overflow-hidden rounded-2xl border border-amber-500/30 bg-gradient-to-r from-stone-900 via-stone-950 to-stone-900 p-6 backdrop-blur-md shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="absolute -left-10 -top-10 h-40 w-40 rounded-full bg-amber-500/10 blur-[85px] pointer-events-none" />
          <div className="absolute right-10 bottom-10 h-32 w-32 rounded-full bg-emerald-500/5 blur-[75px] pointer-events-none" />

          <div className="relative z-10 flex items-start gap-4">
            <span className="text-3xl animate-bounce select-none">🚀</span>
            <div>
              <h3 className="text-base font-bold text-stone-100 tracking-wide">
                Link Your GitHub Account to Unlock Analytics
              </h3>
              <p className="mt-1 text-xs text-stone-400 max-w-2xl leading-relaxed font-light">
                DevHub works best when connected to your GitHub profile. Link your account to populate developer statistics, analyze repo activity, and automatically track projects.
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowConnectModal(true)}
            className="group relative z-10 flex-shrink-0 flex items-center gap-2 rounded-xl bg-amber-500 hover:bg-amber-400 px-5 py-3 text-xs font-bold text-stone-950 transition-all duration-300 active:scale-[0.98] shadow-lg shadow-amber-500/20"
          >
            <svg className="h-4 w-4 fill-stone-950" viewBox="0 0 24 24" aria-hidden="true">
              <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482C19.138 20.193 22 16.437 22 12.017 22 6.484 17.522 2 12 2z" />
            </svg>
            <span>Connect GitHub Account</span>
          </button>
        </div>
      )}

      {/* ── GitHub connected status bar ────────────────────────────── */}
      {user && user.githubConnected && (
        <div className="flex items-center justify-between gap-4 rounded-2xl border border-stone-800 bg-stone-900/40 px-5 py-3.5">
          <div className="flex items-center gap-3">
            <img
              src={user.githubAvatarUrl}
              alt={user.githubUsername}
              className="h-7 w-7 rounded-full border border-amber-500/40"
            />
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-semibold text-stone-300">
              Linked: <span className="font-bold font-mono text-amber-400">@{user.githubUsername}</span>
            </span>
          </div>
          <button
            onClick={disconnectGitHub}
            className="text-[10px] font-mono font-bold uppercase tracking-wider text-stone-500 hover:text-rose-400 transition-colors"
          >
            Disconnect
          </button>
        </div>
      )}

      {/* ── Widget grid ───────────────────────────────────────────── */}
      <div className="grid gap-6 xl:grid-cols-2">
        {items.includes('explainer') && (
          <Card className="overflow-hidden">
            <div className="border-b border-stone-800/80 px-5 py-3 text-xs font-mono text-stone-400 bg-stone-950/60 flex items-center justify-between">
              <span>editor.ts · AST Parser</span>
              <span className="text-[10px] text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">Service :8081</span>
            </div>
            <div className="grid gap-0 lg:grid-cols-2">
              <pre className="overflow-auto border-b border-stone-800 bg-[#090807] p-5 font-mono text-xs leading-6 text-amber-200/90 lg:border-b-0 lg:border-r border-stone-800/80">{data.codeSample}</pre>
              <div className="space-y-3 p-5">
                <h3 className="text-base font-bold text-stone-100">AI Code Explainer</h3>
                {data.explanationSteps.map((step, idx) => (
                  <p key={step} className="text-xs text-stone-300 leading-relaxed">
                    <span className="mr-2 text-amber-400 font-mono font-bold">{idx + 1}.</span>{step}
                  </p>
                ))}
              </div>
            </div>
          </Card>
        )}

        {items.includes('tracker') && (
          <Card className="p-5 flex flex-col justify-between min-h-[300px]">
            <div>
              <h3 className="text-base font-bold text-stone-100 flex items-center justify-between">
                <span>Build-in-Public Tracker</span>
                <span className="rounded-md bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 text-[9px] font-mono font-bold text-emerald-400 uppercase">Service :8084</span>
              </h3>
              <p className="text-xs text-stone-400 mt-1 font-light">Cultivate consistency & log daily wins</p>

              <div className="mt-6 flex items-center gap-4 bg-stone-950/60 rounded-xl p-4 border border-stone-800/80">
                <span className="text-3xl select-none">🔥</span>
                <div>
                  <p className="text-[10px] font-mono font-bold uppercase tracking-wider text-stone-500">Current Streak</p>
                  <p className="text-xl font-extrabold text-stone-100">
                    {currentStreak} {currentStreak === 1 ? 'day' : 'days'}
                  </p>
                  <p className="text-[10px] text-stone-500 mt-0.5">Keep shipping daily!</p>
                </div>
              </div>
            </div>

            <button
              onClick={() => setActive('tracker')}
              className="w-full mt-4 rounded-xl bg-stone-900/80 border border-stone-800 hover:border-amber-500/30 py-2.5 text-xs font-bold text-amber-400 transition-colors shadow-sm"
            >
              Open Build-in-Public Studio →
            </button>
          </Card>
        )}

        {items.includes('bingo') && (
          <Card className="p-5 flex flex-col justify-between min-h-[300px]">
            <div>
              <h3 className="text-base font-bold text-stone-100 flex items-center justify-between">
                <span>Developer Habits Bingo</span>
                <span className="rounded-md bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 text-[9px] font-mono font-bold text-amber-400 uppercase">3D Matrix</span>
              </h3>
              <p className="text-xs text-stone-400 mt-1 font-light">Reflect on habit wins & share results</p>

              {/* Miniature 5x5 dot board matrix */}
              <div className="mt-5 flex items-center justify-between gap-4 bg-stone-950/60 rounded-xl p-4 border border-stone-800/80">
                <div>
                  <p className="text-[10px] font-mono font-bold uppercase tracking-wider text-stone-500">Board Progress</p>
                  <p className="text-xl font-extrabold text-stone-100 mt-1">
                    {checkedBingoIds.size}/25 <span className="text-xs font-normal text-stone-400">habits</span>
                  </p>
                  <p className="text-[9px] text-stone-500 mt-0.5">Free Space coffee break active</p>
                </div>

                <div className="grid grid-cols-5 gap-1 border border-stone-800 bg-stone-950 p-2 rounded-lg">
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
                              ? 'bg-emerald-400 shadow-sm shadow-emerald-400'
                              : 'bg-stone-800'
                        }`}
                      />
                    );
                  })}
                </div>
              </div>
            </div>

            <button
              onClick={() => setActive('bingo')}
              className="w-full mt-4 rounded-xl bg-stone-900/80 border border-stone-800 hover:border-amber-500/30 py-2.5 text-xs font-bold text-amber-400 transition-colors shadow-sm"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/80 backdrop-blur-md p-4">
          <div className="relative w-full max-w-md rounded-2xl border border-stone-800 bg-stone-900/95 p-6 shadow-2xl backdrop-blur-xl">
            {/* Header */}
            <h3 className="flex items-center gap-2 text-xl font-bold text-stone-100">
              <svg className="h-5 w-5 fill-amber-400" viewBox="0 0 24 24">
                <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482C19.138 20.193 22 16.437 22 12.017 22 6.484 17.522 2 12 2z" />
              </svg>
              Establish GitHub Link
            </h3>

            {/* Loading / sync animation */}
            {isLinking ? (
              <div className="my-8 flex flex-col items-center justify-center gap-4">
                <div className="h-10 w-10 animate-spin rounded-full border-[3px] border-amber-400 border-t-transparent" />
                <div className="text-center">
                  <p className="text-xs font-semibold text-stone-200">
                    {linkingStep === 1 && 'Initializing secure connection...'}
                    {linkingStep === 2 && 'Verifying GitHub account via API...'}
                    {linkingStep === 3 && 'Fetching public repositories...'}
                    {linkingStep === 4 && 'Extracting developer profile stats...'}
                    {linkingStep === 5 && 'Finalizing workspace synchronization...'}
                  </p>
                  <p className="mt-1 font-mono text-[10px] text-stone-500">Please do not close this window</p>
                </div>
                {/* Step progress dots */}
                <div className="flex gap-1.5">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <div
                      key={s}
                      className={`h-1.5 w-1.5 rounded-full transition-all duration-300 ${
                        linkingStep >= s ? 'bg-amber-400 scale-110' : 'bg-stone-700'
                      }`}
                    />
                  ))}
                </div>
              </div>
            ) : (
              <form onSubmit={handleLinkGitHub} className="mt-5 space-y-4">
                {/* Validation error banner */}
                {modalError && (
                  <div className="flex items-start gap-2 rounded-xl border border-rose-500/25 bg-rose-500/10 px-4 py-3 text-xs text-rose-300 leading-relaxed">
                    <span className="mt-0.5 text-rose-400 flex-shrink-0">✕</span>
                    <span>{modalError}</span>
                  </div>
                )}

                <div>
                  <label className="mb-2 block text-[10px] font-mono font-bold uppercase tracking-wider text-stone-400">
                    GitHub Username
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. torvalds or octocat"
                    value={githubInput}
                    onChange={(e) => { setGithubInput(e.target.value); setModalError(''); }}
                    className={`w-full rounded-xl border bg-stone-950 px-4 py-3 text-sm text-stone-100 placeholder-stone-600 focus:ring-1 transition-colors ${
                      modalError ? 'border-rose-500/50 focus:border-rose-500 focus:ring-rose-500/30' : 'border-stone-800 focus:border-amber-400 focus:ring-amber-400'
                    }`}
                    required
                    autoFocus
                  />
                </div>

                <div>
                  <label className="mb-2 block text-[10px] font-mono font-bold uppercase tracking-wider text-stone-400">
                    Personal Access Token / Password
                  </label>
                  <input
                    type="password"
                    placeholder="ghp_••••••••••••••••••••"
                    value={githubTokenInput}
                    onChange={(e) => { setGithubTokenInput(e.target.value); setModalError(''); }}
                    className={`w-full rounded-xl border bg-stone-950 px-4 py-3 text-sm text-stone-100 placeholder-stone-600 focus:ring-1 transition-colors ${
                      modalError ? 'border-rose-500/50 focus:border-rose-500 focus:ring-rose-500/30' : 'border-stone-800 focus:border-amber-400 focus:ring-amber-400'
                    }`}
                    required
                  />
                  <p className="mt-1.5 text-[9px] font-mono text-stone-500 leading-normal">
                    Uses the public GitHub API to verify the account exists and fetch your real profile data. Token is stored locally only.
                  </p>
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="rounded-xl border border-stone-800 px-4 py-2.5 text-xs font-semibold text-stone-300 hover:bg-stone-800 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-xl bg-amber-500 hover:bg-amber-400 px-5 py-2.5 text-xs font-bold text-stone-950 transition-colors shadow-lg shadow-amber-500/20"
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
