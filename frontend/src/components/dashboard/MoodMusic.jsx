import React, { useState, useMemo } from 'react';
import { useMusic, MOODS_META, DEFAULT_CURATED } from '../../context/MusicContext';

const MoodMusic = () => {
  const {
    activeMood, setActiveMood,
    activeVideoId,
    miniPlayerOpen,
    customPlaylists, addCustomPlaylist, removeCustomPlaylist,
    getTracksForMood, playTrack, stopPlayer,
  } = useMusic();

  const [autoAdapt, setAutoAdapt] = useState(false);
  const [customUrl, setCustomUrl]   = useState('');
  const [customName, setCustomName] = useState('');
  const [toast, setToast]           = useState('');

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3500); };

  // Auto-adapt by local time
  const handleAutoAdapt = (val) => {
    setAutoAdapt(val);
    if (!val) return;
    const h = new Date().getHours();
    const mood = h >= 6 && h < 12 ? 'chill' : h >= 12 && h < 18 ? 'focus' : h >= 18 && h < 22 ? 'debug' : 'burnout';
    const first = getTracksForMood(mood)[0];
    if (first) playTrack(first.id, mood);
    showToast(`⏰ Auto-adapted to ${MOODS_META[mood].label}`);
  };

  const handleMoodSelect = (key) => {
    if (autoAdapt) { showToast('⚠️ Disable Auto-Adapt to pick mood manually.'); return; }
    setActiveMood(key);
    const first = getTracksForMood(key)[0];
    if (first) playTrack(first.id, key);
  };

  const handleAddCustom = (e) => {
    e.preventDefault();
    const match = customUrl.match(/(?:youtu\.be\/|v=|embed\/)([a-zA-Z0-9_-]{11})/);
    const id = match ? match[1] : (customUrl.trim().length === 11 ? customUrl.trim() : null);
    if (!id) { showToast('❌ Invalid YouTube URL.'); return; }
    if (getTracksForMood(activeMood).some(p => p.id === id)) { showToast('⚠️ Already added!'); return; }
    const entry = { id, name: `${customName.trim()} 💿`, desc: 'Custom track', isCustom: true };
    addCustomPlaylist(activeMood, entry);
    playTrack(id, activeMood);
    setCustomUrl(''); setCustomName('');
    showToast(`🎵 "${entry.name}" added!`);
  };

  const allTracks = useMemo(() => getTracksForMood(activeMood), [activeMood, customPlaylists]);

  return (
    <div className="space-y-6 p-4 sm:p-6">

      {toast && (
        <div className="fixed top-5 right-5 z-50 rounded-xl border border-cyan-500/30 bg-slate-900 px-5 py-3 text-xs text-cyan-300 font-semibold shadow-2xl backdrop-blur-md">
          {toast}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h2 className="text-xl font-bold text-white">Developer Mood Music 🎵</h2>
          <p className="text-xs text-slate-400 mt-1">Pick a vibe — music keeps playing even when you switch panels.</p>
        </div>

        <div className="flex items-center gap-3 bg-slate-950/60 px-4 py-2.5 rounded-xl border border-slate-800">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Auto-Adapt by Time</span>
          <button
            onClick={() => handleAutoAdapt(!autoAdapt)}
            className={`relative inline-flex h-6 w-11 rounded-full border-2 border-transparent transition-colors ${autoAdapt ? 'bg-cyan-500' : 'bg-slate-700'}`}
          >
            <span className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition duration-200 ${autoAdapt ? 'translate-x-5' : 'translate-x-0'}`} />
          </button>
        </div>
      </div>

      {/* Mood cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {Object.entries(MOODS_META).map(([key, m]) => {
          const isOn = activeMood === key;
          return (
            <button
              key={key}
              onClick={() => handleMoodSelect(key)}
              className={`rounded-2xl border p-4 text-left flex flex-col gap-2 transition-all min-h-[100px] ${
                isOn
                  ? `border-cyan-400 ${m.badge} scale-[1.02] shadow-lg`
                  : 'border-slate-800 bg-slate-900/40 hover:border-slate-700'
              } ${autoAdapt ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            >
              <div className="flex items-center justify-between w-full">
                <span className="text-2xl">{m.emoji}</span>
                {isOn && <span className={`h-2 w-2 rounded-full animate-pulse ${m.dot}`} />}
              </div>
              <div>
                <p className={`text-xs font-bold uppercase tracking-wide ${isOn ? 'text-white' : 'text-slate-400'}`}>{m.label}</p>
                <p className="text-[10px] text-slate-500 mt-0.5 line-clamp-2">{DEFAULT_CURATED[key][0]?.desc}</p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Player + playlist */}
      <div className="grid gap-4 md:grid-cols-5">

        {/* Sidebar */}
        <div className="md:col-span-2 space-y-4">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">Playlists</h3>
              <span className="text-[10px] font-mono text-slate-500">{allTracks.length} tracks</span>
            </div>
            <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
              {allTracks.map((p) => {
                const isActive = activeVideoId === p.id;
                return (
                  <div
                    key={p.id}
                    onClick={() => playTrack(p.id, activeMood)}
                    className={`group flex items-center justify-between gap-2 p-3 rounded-xl border cursor-pointer transition-all ${
                      isActive
                        ? 'border-cyan-400/40 bg-cyan-500/10'
                        : 'border-slate-800/80 bg-slate-950/40 hover:border-slate-700'
                    }`}
                  >
                    <div className="min-w-0">
                      <p className={`text-xs font-bold truncate ${isActive ? 'text-cyan-400' : 'text-slate-200 group-hover:text-white'}`}>{p.name}</p>
                      <p className="text-[10px] text-slate-500 truncate">{p.desc}</p>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      {p.isCustom && (
                        <button
                          onClick={(e) => { e.stopPropagation(); removeCustomPlaylist(activeMood, p.id); showToast('🗑️ Removed.'); }}
                          className="p-1 text-[10px] text-rose-400 hover:bg-rose-500 hover:text-white rounded transition-all"
                        >🗑️</button>
                      )}
                      <span className={`text-[10px] font-mono ${isActive ? 'text-cyan-400' : 'text-slate-600'}`}>
                        {isActive ? '▶ now' : '▶'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Add custom */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
            <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3">🔗 Add YouTube Track</h4>
            <form onSubmit={handleAddCustom} className="space-y-3">
              <input type="text" placeholder="Track name" value={customName}
                onChange={e => setCustomName(e.target.value)}
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2 text-xs text-slate-200 placeholder-slate-600 focus:border-cyan-400 focus:outline-none"
                required />
              <input type="text" placeholder="youtube.com/watch?v=..." value={customUrl}
                onChange={e => setCustomUrl(e.target.value)}
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2 text-xs text-slate-200 placeholder-slate-600 focus:border-cyan-400 focus:outline-none"
                required />
              <button type="submit" className="w-full rounded-xl bg-cyan-400 hover:bg-cyan-300 py-2.5 text-xs font-bold text-slate-950 transition-colors">
                Add Track
              </button>
            </form>
          </div>
        </div>

        {/* Full player — only show when on the music page */}
        <div className="md:col-span-3">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 flex flex-col h-full min-h-[440px]">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
              <div>
                <p className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Full Player</p>
                <p className="text-sm font-semibold text-slate-200 mt-0.5">YouTube — No Login Required</p>
              </div>
              <div className="flex items-center gap-2">
                {miniPlayerOpen && (
                  <span className="rounded-full bg-cyan-500/10 border border-cyan-500/25 px-2 py-0.5 text-[9px] text-cyan-400 font-bold animate-pulse">
                    ▶ PLAYING
                  </span>
                )}
                {miniPlayerOpen && (
                  <button onClick={stopPlayer} className="text-[10px] text-slate-500 hover:text-rose-400 transition-colors font-semibold">
                    Stop
                  </button>
                )}
              </div>
            </div>

            <div className="flex-1 rounded-2xl overflow-hidden border border-slate-800 bg-slate-950">
              {activeVideoId ? (
                <iframe
                  key={activeVideoId + '-full'}
                  src={`https://www.youtube.com/embed/${activeVideoId}?rel=0&modestbranding=1`}
                  width="100%"
                  height="100%"
                  style={{ minHeight: 320 }}
                  frameBorder="0"
                  allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title="Mood Music Player"
                />
              ) : (
                <div className="flex flex-col items-center justify-center h-full py-16">
                  <span className="text-4xl">🎵</span>
                  <p className="text-xs text-slate-400 mt-3">Select a track to start playing</p>
                </div>
              )}
            </div>

            <div className="mt-4 flex items-center justify-between">
              <span className="text-[10px] font-mono text-slate-600">
                {miniPlayerOpen ? '🎵 Music continues while you browse' : 'Click a track to start'}
              </span>
              <div className="flex items-end gap-0.5 h-4">
                {[...Array(7)].map((_, i) => (
                  <div key={i} className="w-0.5 rounded-t bg-cyan-400 animate-soundwave"
                    style={{ animationDelay: `${i * 0.12}s` }} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MoodMusic;
