import React, { useState } from 'react';
import DashboardSidebar from '../components/dashboard/DashboardSidebar';
import DashboardTopbar from '../components/dashboard/DashboardTopbar';
import DashboardPanels from '../components/dashboard/DashboardPanels';
import FloatingMiniPlayer from '../components/dashboard/FloatingMiniPlayer';
import { MusicProvider } from '../context/MusicContext';
import { useDashboardData } from '../hooks/useDashboardData';
import {
  bingoTasks,
  codeSample,
  explanationSteps,
  trackerStats,
  weeklyFocusData,
} from '../data/mockData';

const fallbackDashboardData = {
  trackerStats,
  weeklyFocusData,
  codeSample,
  explanationSteps,
  bingoTasks,
  music: {
    title: 'Lo-Fi Compile Sessions',
    artist: 'Deep Focus Collective',
    progressPercent: 67,
    mode: 'Deep Focus',
  },
};

const DashboardPage = () => {
  const [active, setActive] = useState('overview');
  const { data, isError } = useDashboardData();
  const resolvedData = data ?? fallbackDashboardData;

  return (
    <MusicProvider>
      <div className="min-h-screen bg-slate-950 text-slate-100">
        <div className="grid min-h-screen lg:grid-cols-[260px_1fr]">
          <div className="hidden lg:block">
            <DashboardSidebar active={active} setActive={setActive} />
          </div>
          <div className="flex min-h-screen flex-col">
            <DashboardTopbar />
            {isError && (
              <div className="mx-4 mt-4 rounded-xl border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-sm text-amber-200 sm:mx-6">
                Backend unavailable, showing fallback dashboard data.
              </div>
            )}
            <div className="lg:hidden">
              <DashboardSidebar active={active} setActive={setActive} />
            </div>
            <main className="flex-1">
              <DashboardPanels active={active} data={resolvedData} setActive={setActive} />
            </main>
          </div>
        </div>

        {/* Persistent floating mini-player — lives outside panel router, never unmounts */}
        <FloatingMiniPlayer />
      </div>
    </MusicProvider>
  );
};

export default DashboardPage;
