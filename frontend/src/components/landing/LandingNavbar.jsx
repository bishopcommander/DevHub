import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '../ui/Button';
import { useAuth } from '../../context/AuthContext';

const LandingNavbar = () => {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-40 border-b border-slate-800/60 bg-slate-950/75 backdrop-blur-lg">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <a href="#top" className="flex items-center gap-2 text-slate-100">
          <span className="grid h-9 w-9 place-content-center rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 font-black text-slate-950">DH</span>
          <span className="font-semibold tracking-wide">DevHub</span>
        </a>
        <nav className="hidden items-center gap-8 text-sm text-slate-300 md:flex">
          <a href="#features" className="hover:text-cyan-300 transition-colors">Features</a>
          <a href="#testimonials" className="hover:text-cyan-300 transition-colors">Testimonials</a>
          <a href="#pricing" className="hover:text-cyan-300 transition-colors">Pricing</a>

          {user ? (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 rounded-full border border-slate-800 bg-slate-900/50 py-1 pl-1 pr-3">
                <img 
                  src={user.avatarUrl} 
                  alt={user.name} 
                  className="h-7 w-7 rounded-full object-cover border border-slate-700"
                />
                <span className="text-xs font-semibold text-slate-200">{user.name}</span>
              </div>
              <Link to="/app">
                <Button className="px-4 py-2 text-xs">Go to Dashboard</Button>
              </Link>
              <button 
                onClick={logout} 
                className="text-xs text-slate-400 hover:text-rose-400 transition-colors font-semibold"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Link to="/login" className="hover:text-cyan-300 transition-colors font-semibold text-xs">
                Sign In
              </Link>
              <Link to="/login">
                <Button className="px-4 py-2 text-xs">Start Coding Smarter</Button>
              </Link>
            </div>
          )}
        </nav>
        <button onClick={() => setOpen((v) => !v)} aria-label="Toggle menu" className="rounded-lg border border-slate-700 px-3 py-2 text-sm text-slate-200 md:hidden">
          Menu
        </button>
      </div>
      {open && (
        <nav className="border-t border-slate-800 bg-slate-950 px-4 py-4 md:hidden">
          <div className="flex flex-col gap-4 text-sm text-slate-250">
            <a href="#features" onClick={() => setOpen(false)}>Features</a>
            <a href="#testimonials" onClick={() => setOpen(false)}>Testimonials</a>
            <a href="#pricing" onClick={() => setOpen(false)}>Pricing</a>
            {user ? (
              <div className="flex flex-col gap-3 pt-2 border-t border-slate-800">
                <div className="flex items-center gap-2">
                  <img 
                    src={user.avatarUrl} 
                    alt={user.name} 
                    className="h-8 w-8 rounded-full border border-slate-750" 
                  />
                  <div>
                    <div className="text-xs font-bold text-slate-200">{user.name}</div>
                    <div className="text-[10px] text-slate-400">{user.email}</div>
                  </div>
                </div>
                <Link to="/app" onClick={() => setOpen(false)}>
                  <Button className="w-full text-xs">Go to Dashboard</Button>
                </Link>
                <button 
                  onClick={() => { logout(); setOpen(false); }} 
                  className="w-full text-left py-2 text-xs text-rose-400 font-semibold"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-3 pt-2 border-t border-slate-800">
                <Link to="/login" onClick={() => setOpen(false)} className="text-center py-2 hover:text-cyan-300 font-semibold text-xs">
                  Sign In
                </Link>
                <Link to="/login" onClick={() => setOpen(false)}>
                  <Button className="w-full text-xs">Start Coding Smarter</Button>
                </Link>
              </div>
            )}
          </div>
        </nav>
      )}
    </header>
  );
};

export default LandingNavbar;
