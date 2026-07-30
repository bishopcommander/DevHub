import React from 'react';
import { BellIcon, SearchIcon } from '../ui/Icons';
import { useAuth } from '../../context/AuthContext';

const DashboardTopbar = ({ onToggleSidebar }) => {
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-stone-800/80 bg-stone-950/90 px-4 backdrop-blur sm:px-6">
      <div className="flex w-full max-w-md items-center gap-3">
        {/* Mobile menu toggle */}
        <button
          onClick={onToggleSidebar}
          className="lg:hidden flex items-center justify-center p-2 rounded-lg text-stone-400 hover:bg-stone-900 hover:text-amber-300 transition-colors"
          aria-label="Toggle Sidebar"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className="h-5 w-5">
            <line x1="4" y1="12" x2="20" y2="12" />
            <line x1="4" y1="6" x2="20" y2="6" />
            <line x1="4" y1="18" x2="20" y2="18" />
          </svg>
        </button>

        <div className="flex flex-1 items-center gap-3 rounded-xl border border-stone-800 bg-stone-900/80 px-3 py-2">
          <SearchIcon />
          <input className="w-full bg-transparent text-sm text-stone-100 outline-none placeholder:text-stone-500" placeholder="Search snippets, stats, tasks" />
        </div>
      </div>
      <div className="ml-4 flex items-center gap-4">
        <button aria-label="Notifications" className="relative rounded-lg p-2 text-stone-300 hover:bg-stone-900 hover:text-amber-300">
          <BellIcon />
          <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-amber-400" />
        </button>

        {user ? (
          <img
            src={user.avatarUrl}
            alt={user.name}
            className="h-9 w-9 rounded-full object-cover border border-amber-500/30 shadow-md shadow-stone-950/30"
          />
        ) : (
          <button className="grid h-9 w-9 place-content-center rounded-full bg-gradient-to-br from-amber-500 to-emerald-600 text-sm font-bold text-stone-950">
            U
          </button>
        )}
      </div>
    </header>
  );
};

export default DashboardTopbar;
