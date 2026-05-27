import React from 'react';
import LandingNavbar from '../components/landing/LandingNavbar';
import LandingSections from '../components/landing/LandingSections';
import { useLandingData } from '../hooks/useLandingData';
import { useTrackerStats } from '../hooks/useTrackerStats';
import {
  landingFeatures,
  pricing,
  testimonials,
  trackerStats,
} from '../data/mockData';

const fallbackLandingData = {
  heroHeadline: 'Build better coding habits. Ship faster with calm focus.',
  heroSubheading: 'DevHub blends AI guidance, flow analytics, and gamified momentum so your best coding days become your default.',
  heroCta: 'Start Coding Smarter',
  features: landingFeatures,
  testimonials,
  pricing,
  previewStats: trackerStats.slice(0, 3),
};

const LandingPage = () => {
  const { data, isError } = useLandingData();
  const { stats: liveStats, recentLogs } = useTrackerStats();

  // Merge live tracker stats into resolved data — real data wins over fallback
  const resolvedData = {
    ...(data ?? fallbackLandingData),
    // If the user has tracker data in localStorage, show it live
    previewStats: liveStats ?? (data?.previewStats ?? fallbackLandingData.previewStats),
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <LandingNavbar />
      {isError && (
        <div className="mx-auto mt-4 max-w-7xl rounded-xl border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-sm text-amber-200">
          Backend unavailable, showing fallback content.
        </div>
      )}
      <main>
        <LandingSections data={resolvedData} recentLogs={recentLogs} />
      </main>
    </div>
  );
};

export default LandingPage;
