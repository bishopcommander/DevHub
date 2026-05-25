import React from 'react';
import { BellIcon, SearchIcon } from '../ui/Icons';
import { useAuth } from '../../context/AuthContext';

const DashboardTopbar = () => {
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-slate-800 bg-slate-950/90 px-4 backdrop-blur sm:px-6">
      <div className="flex w-full max-w-md items-center gap-3 rounded-xl border border-slate-800 bg-slate-900 px-3 py-2">
        <SearchIcon />
        <input className="w-full bg-transparent text-sm text-slate-100 outline-none placeholder:text-slate-500" placeholder="Search snippets, stats, tasks" />
      </div>
      <div className="ml-4 flex items-center gap-4">
        <button aria-label="Notifications" className="relative rounded-lg p-2 text-slate-300 hover:bg-slate-900 hover:text-cyan-300">
          <BellIcon />
          <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-cyan-400" />
        </button>

        {user ? (
          <img
            src={user.avatarUrl}
            alt={user.name}
            className="h-9 w-9 rounded-full object-cover border border-slate-800 shadow-md shadow-slate-950/30"
          />
        ) : (
          <button className="grid h-9 w-9 place-content-center rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 text-sm font-bold text-slate-950">
            U
          </button>
        )}
      </div>
    </header>
  );
};

export default DashboardTopbar;
