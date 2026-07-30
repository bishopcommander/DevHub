import React from 'react';
import clsx from 'clsx';
import { SidebarIcons } from '../ui/Icons';
import { useAuth } from '../../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

const navItems = [
  { key: 'overview', label: 'Overview', port: '8083' },
  { key: 'explainer', label: 'AI Explainer', badge: '3D', port: '8081' },
  { key: 'tracker', label: 'Build-in-Public', port: '8084' },
  { key: 'bingo', label: 'Dev Bingo', badge: '3D', port: '8084' },
  { key: 'music', label: 'Mood Music', badge: 'AUDIO' },
  { key: 'analyzer', label: 'GitHub Analyzer', badge: 'SYNC' },
  { key: 'decider', label: 'Stack Decider', badge: '3D', port: '8082' },
];

const DashboardSidebar = ({ active, setActive }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <aside className="flex h-full w-full flex-col border-r border-stone-800/80 bg-[#0c0a09] p-4 text-stone-200 font-sans select-none">
      {/* Brand & Workspace Header */}
      <Link
        to="/"
        className="mb-6 flex items-center justify-between px-2 py-1.5 rounded-xl hover:bg-stone-900/60 transition-colors group"
        title="Back to Landing Page"
      >
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-amber-500 to-emerald-600 flex items-center justify-center text-xs font-black text-stone-950 shadow-md shadow-amber-500/20">
            D
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold tracking-tight text-stone-100 group-hover:text-amber-300 transition-colors">
              Dev<span className="text-amber-400">Hub</span>
            </span>
            <span className="text-[10px] font-mono text-stone-500">v2.4 • Microservices</span>
          </div>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-stone-900 text-stone-400 border border-stone-800">
          ⌘K
        </span>
      </Link>

      {/* Nav Section Label */}
      <div className="px-2 mb-2 text-[10px] font-mono font-bold uppercase tracking-widest text-stone-500">
        Workspace Navigation
      </div>

      {/* Main navigation */}
      <nav className="flex-1 space-y-1" aria-label="Dashboard sections">
        {navItems.map((item) => {
          const Icon = SidebarIcons[item.key];
          const isActive = active === item.key;
          return (
            <button
              key={item.key}
              onClick={() => setActive(item.key)}
              className={clsx(
                'group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-xs font-medium transition-all duration-150 relative',
                isActive
                  ? 'bg-amber-500/10 text-amber-300 font-semibold border border-amber-500/25 shadow-sm'
                  : 'text-stone-400 hover:bg-stone-900/70 hover:text-stone-200'
              )}
            >
              {isActive && (
                <div className="absolute left-0 top-2 bottom-2 w-1 rounded-r-full bg-amber-400" />
              )}
              <div className={clsx(
                'transition-colors',
                isActive ? 'text-amber-400' : 'text-stone-500 group-hover:text-stone-300'
              )}>
                <Icon />
              </div>
              <span className="flex-1 truncate">{item.label}</span>

              {item.port && (
                <span className="text-[9px] font-mono text-stone-600 group-hover:text-stone-500 hidden sm:inline">
                  :{item.port}
                </span>
              )}

              {item.badge && (
                <span className={clsx(
                  'rounded-md px-1.5 py-0.5 text-[8px] font-mono font-bold tracking-wider uppercase border',
                  isActive
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                    : 'bg-stone-900 text-stone-400 border-stone-800'
                )}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* User profile details & Footer */}
      {user && (
        <div className="mt-auto border-t border-stone-800/80 pt-4 flex-shrink-0 space-y-3">
          <div className="flex items-center gap-3 rounded-xl bg-stone-900/60 border border-stone-800/60 p-2.5">
            <img
              src={user.avatarUrl}
              alt={user.name}
              className="h-8 w-8 rounded-lg object-cover border border-amber-500/30"
            />
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-bold text-stone-200">{user.name}</p>
              <p className="truncate text-[10px] text-stone-500 font-mono">{user.email}</p>
            </div>
          </div>

          <div className="flex items-center justify-between px-1 text-xs">
            <span className="inline-flex items-center gap-1.5 text-[9px] font-mono uppercase px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              {user.provider}
            </span>

            <button
              onClick={handleLogout}
              className="text-[10px] font-mono font-semibold text-stone-500 hover:text-rose-400 transition-colors"
            >
              Sign Out →
            </button>
          </div>
        </div>
      )}
    </aside>
  );
};

export default DashboardSidebar;
