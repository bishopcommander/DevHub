import React, { useState } from 'react';
import { useMusic, MOODS_META } from '../../context/MusicContext';

const FloatingMiniPlayer = () => {
  const {
    activeMood, activeVideoId, miniPlayerOpen,
    setMiniPlayerOpen, stopPlayer, getTracksForMood,
    playTrack, setActiveMood, setActiveVideoId
  } = useMusic();

  const [expanded, setExpanded] = useState(false);

  if (!miniPlayerOpen) return null;

  const mood = MOODS_META[activeMood];
  const tracks = getTracksForMood(activeMood);
  const currentTrack = tracks.find(t => t.id === activeVideoId) || tracks[0];
  const currentIndex = tracks.findIndex(t => t.id === activeVideoId);

  const handlePrev = () => {
    const idx = currentIndex > 0 ? currentIndex - 1 : tracks.length - 1;
    setActiveVideoId(tracks[idx].id);
  };
  const handleNext = () => {
    const idx = currentIndex < tracks.length - 1 ? currentIndex + 1 : 0;
    setActiveVideoId(tracks[idx].id);
  };

  return (
    <>
      {/* Backdrop blur spacer so content doesn't hide behind player */}
      <div className="h-[72px] lg:h-[64px] pointer-events-none" />

      {/* ── Floating mini player bar ─────────────────────────────── */}
      <div className="fixed bottom-0 left-0 right-0 z-50">

        {/* Hidden but persistent YouTube iframe — always mounted so audio continues */}
        <iframe
          key={activeVideoId}
          src={`https://www.youtube.com/embed/${activeVideoId}?autoplay=1&rel=0&modestbranding=1`}
          width="1"
          height="1"
          frameBorder="0"
          allow="autoplay; encrypted-media"
          title="bg-music"
          className="absolute opacity-0 pointer-events-none"
          style={{ width: 1, height: 1 }}
        />

        {/* Expanded track list panel (slides up) */}
        {expanded && (
          <div className="mx-4 mb-0 rounded-t-2xl border border-slate-700 border-b-0 bg-slate-900/95 backdrop-blur-xl shadow-2xl max-h-64 overflow-y-auto">
            <div className="p-4">
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-3">
                {mood.emoji} {mood.label} — Queue
              </p>
              <div className="space-y-1.5">
                {tracks.map((t, i) => {
                  const isActive = t.id === activeVideoId;
                  return (
                    <button
                      key={t.id}
                      onClick={() => setActiveVideoId(t.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left transition-all ${
                        isActive
                          ? 'bg-cyan-500/15 border border-cyan-400/30 text-cyan-400'
                          : 'hover:bg-slate-800 text-slate-300'
                      }`}
                    >
                      <span className="text-[10px] font-mono w-4 text-slate-600">{i + 1}</span>
                      <div className="min-w-0 flex-1">
                        <p className={`text-xs font-semibold truncate ${isActive ? 'text-cyan-400' : ''}`}>{t.name}</p>
                        <p className="text-[10px] text-slate-500 truncate">{t.desc}</p>
                      </div>
                      {isActive && <span className="text-cyan-400 text-[10px] animate-pulse">▶</span>}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Mini player bar */}
        <div className="border-t border-slate-800 bg-slate-950/95 backdrop-blur-xl px-4 py-3 flex items-center gap-4 shadow-2xl shadow-black/50">

          {/* Mood badge + track info */}
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div className={`shrink-0 h-8 w-8 rounded-lg flex items-center justify-center border ${mood.badge} text-sm`}>
              {mood.emoji}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-slate-100 truncate">{currentTrack?.name || 'Unknown Track'}</p>
              <div className="flex items-center gap-2 mt-0.5">
                <span className={`text-[9px] font-bold uppercase tracking-wider border rounded-full px-1.5 py-0.5 ${mood.badge}`}>
                  {mood.label}
                </span>
                <span className="text-[9px] text-slate-500 font-mono">via YouTube</span>
              </div>
            </div>
          </div>

          {/* Soundwave visualizer */}
          <div className="hidden sm:flex items-end gap-0.5 h-4 shrink-0">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="w-0.5 rounded-t bg-cyan-400 animate-soundwave"
                style={{ animationDelay: `${i * 0.15}s` }}
              />
            ))}
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Prev */}
            <button
              onClick={handlePrev}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
              title="Previous track"
            >
              <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 6h2v12H6zm3.5 6 8.5 6V6z"/>
              </svg>
            </button>

            {/* Next */}
            <button
              onClick={handleNext}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
              title="Next track"
            >
              <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 18l8.5-6L6 6v12zm2-8.14L11.03 12 8 14.14V9.86zM16 6h2v12h-2z"/>
              </svg>
            </button>

            {/* Queue toggle */}
            <button
              onClick={() => setExpanded(v => !v)}
              className={`p-2 rounded-lg transition-all ${expanded ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
              title="Toggle queue"
            >
              <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M4 6h16M4 12h16M4 18h10"/>
              </svg>
            </button>

            {/* Close / stop */}
            <button
              onClick={() => { setExpanded(false); stopPlayer(); }}
              className="p-2 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-all"
              title="Stop music"
            >
              <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default FloatingMiniPlayer;
