import React from 'react';
import clsx from 'clsx';
import { SidebarIcons } from '../ui/Icons';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const navItems = [
  { key: 'overview', label: 'Overview' },
  { key: 'explainer', label: 'AI Explainer' },
  { key: 'tracker', label: 'Build-in-Public' },
  { key: 'bingo', label: 'Dev Bingo' },
  { key: 'music', label: 'Mood Music' },
  { key: 'analyzer', label: 'GitHub Analyzer', badge: 'NEW' },
];

const DashboardSidebar = ({ active, setActive }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <aside className="flex h-full w-full flex-col border-r border-slate-800 bg-slate-950/70 p-4">
      {/* Brand logo */}
      <div className="mb-6 flex items-center gap-2 px-2 flex-shrink-0">
        <div className="grid h-8 w-8 place-content-center rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600 text-xs font-black text-slate-950">DH</div>
        <span className="font-semibold text-slate-100">DevHub</span>
      </div>

      {/* Main navigation */}
      <nav className="flex-1 space-y-2" aria-label="Dashboard sections">
        {navItems.map((item) => {
          const Icon = SidebarIcons[item.key];
          return (
            <button
              key={item.key}
              onClick={() => setActive(item.key)}
              className={clsx(
                'flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition',
                active === item.key ? 'bg-slate-850 text-cyan-300 font-semibold border-l-2 border-cyan-400' : 'text-slate-300 hover:bg-slate-900 hover:text-slate-100'
              )}
            >
              <Icon />
              <span className="flex-1">{item.label}</span>
              {item.badge && (
                <span className="rounded-full bg-cyan-500/15 border border-cyan-500/30 px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wider text-cyan-400">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* User profile details & Sign Out block */}
      {user && (
        <div className="mt-auto border-t border-slate-800/80 pt-4 flex-shrink-0">
          <div className="flex items-center gap-3 rounded-xl bg-slate-900/40 p-2.5">
            <img
              src={user.avatarUrl}
              alt={user.name}
              className="h-9 w-9 rounded-full object-cover border border-slate-700"
            />
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-semibold text-slate-200">{user.name}</p>
              <p className="truncate text-[10px] text-slate-500 font-mono">{user.email}</p>
            </div>
          </div>
          
          <div className="mt-3 flex items-center justify-between px-1">
            <span className={clsx(
              'rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider',
              user.provider === 'github' && 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/20',
              user.provider === 'google' && 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20',
              user.provider === 'discord' && 'bg-indigo-500/10 text-indigo-300 border border-indigo-500/20',
              user.provider === 'email' && 'bg-slate-800 text-slate-400'
            )}>
              {user.provider}
            </span>
            <button
              onClick={handleLogout}
              className="text-[10px] font-semibold text-slate-400 hover:text-rose-400 transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>
      )}
    </aside>
  );
};

export default DashboardSidebar;
