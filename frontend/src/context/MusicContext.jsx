import React, { createContext, useContext, useState, useEffect } from 'react';

const MusicContext = createContext(null);

const DEFAULT_PLAYLISTS = {
  focus: [
    { id: 'jfKfPfyJRdk', name: 'Lofi Hip Hop Radio 🧘', desc: 'Beats to relax, study, and code to — Lofi Girl.' },
    { id: '5qap5aO4i9A', name: 'Chillhop Radio 🌊', desc: 'Chillhop Music 24/7 live radio stream.' },
    { id: 'DWcJFNfaw9c', name: 'Deep Focus Ambient 🌌', desc: 'Ambient instrumental for long coding sessions.' },
  ],
  debug: [
    { id: '4xDzrJKXOOY', name: 'Synthwave / Retrowave ⚡', desc: 'High-energy retro synth to crush bugs fast.' },
    { id: 'b1fhfJpShGI', name: 'Cyberpunk Music 🤖', desc: 'Dark dystopian electronic for logic lockdown.' },
    { id: 'n61ULEU7CO0', name: 'Dark Electronic 💥', desc: 'Heavy industrial synth for crunch-time sprints.' },
  ],
  burnout: [
    { id: 'hlWiI4xVXKY', name: 'Rain Sounds 🌧️', desc: 'Gentle rainfall to decompress after a bad deploy.' },
    { id: 'eKFTSSKCzWA', name: 'Forest Ambience 🍃', desc: 'Forest birdsong and peaceful nature sounds.' },
    { id: 'lCOF9LN_Zxs', name: 'Relaxing Piano 🧘‍♂️', desc: 'Calming piano to reset after merge conflicts.' },
  ],
  chill: [
    { id: 'DSGyEsJ17cI', name: 'Jazz Coffee Shop ☕', desc: 'Classic jazz vibes for a cozy background.' },
    { id: 'Dx5qFachd3A', name: 'Cafe Jazz Lounge 🎸', desc: 'Upbeat cafe jazz for lightweight coding flow.' },
    { id: 'vmDDOFXSgAs', name: 'Acoustic Chill 🎵', desc: 'Soft acoustic and lounge sounds to ease into work.' },
  ],
};

export const MOODS_META = {
  focus:   { label: 'Deep Focus',       emoji: '🧘', dot: 'bg-cyan-400',    badge: 'text-cyan-400 border-cyan-500/30 bg-cyan-500/10' },
  debug:   { label: 'Debug Mode',       emoji: '⚡', dot: 'bg-rose-400',    badge: 'text-rose-400 border-rose-500/30 bg-rose-500/10' },
  burnout: { label: 'Burnout Recovery', emoji: '🍃', dot: 'bg-emerald-400', badge: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10' },
  chill:   { label: 'Chill Coding',     emoji: '☕', dot: 'bg-amber-400',   badge: 'text-amber-400 border-amber-500/30 bg-amber-500/10' },
};

export const DEFAULT_CURATED = DEFAULT_PLAYLISTS;

export const MusicProvider = ({ children }) => {
  const [activeMood, setActiveMood]     = useState('focus');
  const [activeVideoId, setActiveVideoId] = useState('jfKfPfyJRdk');
  const [isPlaying, setIsPlaying]       = useState(false);  // user has pressed play
  const [miniPlayerOpen, setMiniPlayerOpen] = useState(false);
  const [customPlaylists, setCustomPlaylists] = useState(() => {
    try { return JSON.parse(localStorage.getItem('devhub_custom_playlists')) || { focus: [], debug: [], burnout: [], chill: [] }; }
    catch { return { focus: [], debug: [], burnout: [], chill: [] }; }
  });

  useEffect(() => {
    localStorage.setItem('devhub_custom_playlists', JSON.stringify(customPlaylists));
  }, [customPlaylists]);

  // Helper: get all tracks for a given mood
  const getTracksForMood = (mood) => [
    ...(DEFAULT_PLAYLISTS[mood] || []),
    ...(customPlaylists[mood] || []),
  ];

  const playTrack = (videoId, mood) => {
    setActiveVideoId(videoId);
    if (mood) setActiveMood(mood);
    setIsPlaying(true);
    setMiniPlayerOpen(true);
  };

  const stopPlayer = () => {
    setIsPlaying(false);
    setMiniPlayerOpen(false);
  };

  const addCustomPlaylist = (mood, entry) => {
    setCustomPlaylists(prev => ({
      ...prev,
      [mood]: [entry, ...(prev[mood] || [])],
    }));
  };

  const removeCustomPlaylist = (mood, id) => {
    setCustomPlaylists(prev => ({
      ...prev,
      [mood]: prev[mood].filter(p => p.id !== id),
    }));
    if (activeVideoId === id) {
      const fallback = DEFAULT_PLAYLISTS[mood]?.[0]?.id || '';
      setActiveVideoId(fallback);
    }
  };

  return (
    <MusicContext.Provider value={{
      activeMood, setActiveMood,
      activeVideoId, setActiveVideoId,
      isPlaying, setIsPlaying,
      miniPlayerOpen, setMiniPlayerOpen,
      customPlaylists, addCustomPlaylist, removeCustomPlaylist,
      getTracksForMood, playTrack, stopPlayer,
    }}>
      {children}
    </MusicContext.Provider>
  );
};

export const useMusic = () => {
  const ctx = useContext(MusicContext);
  if (!ctx) throw new Error('useMusic must be used inside <MusicProvider>');
  return ctx;
};
