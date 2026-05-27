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
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { data, isError } = useDashboardData();
  const resolvedData = data ?? fallbackDashboardData;

  return (
    <MusicProvider>
      <div className="min-h-screen bg-slate-950 text-slate-100 overflow-x-hidden relative">
        <div className="grid min-h-screen lg:grid-cols-[260px_1fr]">
          {/* Desktop Sidebar (always visible on lg screen) */}
          <div className="hidden lg:block">
            <DashboardSidebar active={active} setActive={setActive} />
          </div>
          
          <div className="flex min-h-screen flex-col min-w-0">
            <DashboardTopbar onToggleSidebar={() => setIsSidebarOpen(true)} />
            
            {isError && (
              <div className="mx-4 mt-4 rounded-xl border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-sm text-amber-200 sm:mx-6">
                Backend unavailable, showing fallback dashboard data.
              </div>
            )}
            
            <main className="flex-1 min-w-0 overflow-y-auto">
              <DashboardPanels active={active} data={resolvedData} setActive={setActive} />
            </main>
          </div>
        </div>

        {/* Mobile Sidebar Backdrop Overlay */}
        {isSidebarOpen && (
          <div 
            className="fixed inset-0 z-45 bg-slate-950/70 backdrop-blur-sm lg:hidden transition-opacity duration-300"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Mobile Sidebar Sliding Drawer */}
        <div className={`fixed bottom-0 top-0 left-0 z-50 w-[260px] transform bg-slate-950 transition-transform duration-300 ease-in-out lg:hidden border-r border-slate-800 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}>
          <DashboardSidebar 
            active={active} 
            setActive={(key) => {
              setActive(key);
              setIsSidebarOpen(false); // Auto-close sidebar on navigate
            }} 
          />
        </div>

        {/* Persistent floating mini-player — lives outside panel router, never unmounts */}
        <FloatingMiniPlayer />
      </div>
    </MusicProvider>
  );
};

export default DashboardPage;
