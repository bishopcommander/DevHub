import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import Landing3DBackground from '../components/landing/Landing3DBackground';

// ── Scroll-reveal hook ─────────────────────────────────────────────────
function useScrollReveal() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.15 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return [ref, visible];
}

// ── Reveal wrapper ─────────────────────────────────────────────────────
function Reveal({ children, delay = 0, direction = 'up' }) {
  const [ref, visible] = useScrollReveal();
  const transforms = {
    up:    visible ? 'translateY(0)'   : 'translateY(48px)',
    left:  visible ? 'translateX(0)'   : 'translateX(-48px)',
    right: visible ? 'translateX(0)'   : 'translateX(48px)',
    scale: visible ? 'scale(1)'        : 'scale(0.88)',
  };
  return (
    <div
      ref={ref}
      style={{
        opacity:    visible ? 1 : 0,
        transform:  transforms[direction],
        transition: `opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms, transform 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

// ── Humanized Feature Cards Data ───────────────────────────────────────
const FEATURES = [
  { 
    icon: '🧠', 
    title: "AI Code Explainer",     
    desc: "Interactive 3D execution tree parsing your syntax, logic loops, and complexity metrics in real time.",      
    color: "from-amber-500/15 via-amber-600/10 to-stone-900/40",   
    border: "border-amber-500/30 hover:border-amber-400/60",
    badge: "Port :8081",
    badgeColor: "bg-amber-500/10 text-amber-300 border-amber-500/30"
  },
  { 
    icon: '⚡', 
    title: "Tech Stack Decider",    
    desc: "Describe your product vision. Receive an opinionated, production-grade tech stack mapped in a 3D orbital constellation.",  
    color: "from-emerald-500/15 via-emerald-600/10 to-stone-900/40",     
    border: "border-emerald-500/30 hover:border-emerald-400/60",
    badge: "Port :8082",
    badgeColor: "bg-emerald-500/10 text-emerald-300 border-emerald-500/30"
  },
  { 
    icon: '📊', 
    title: "Developer Activity Matrix",       
    desc: "Your weekly deep-work hours visualized as a tactile 3D floating bar matrix with real-time analytics.",      
    color: "from-rose-500/15 via-rose-600/10 to-stone-900/40", 
    border: "border-rose-500/30 hover:border-rose-400/60",
    badge: "Port :8083",
    badgeColor: "bg-rose-500/10 text-rose-300 border-rose-500/30"
  },
  { 
    icon: '🎲', 
    title: "Habit Tracker & Bingo",      
    desc: "Turn your daily coding streak into a shareable 3D achievement cube that lights up as you ship.",      
    color: "from-amber-500/15 via-orange-600/10 to-stone-900/40", 
    border: "border-amber-500/30 hover:border-amber-400/60",
    badge: "Port :8084",
    badgeColor: "bg-amber-500/10 text-amber-300 border-amber-500/30"
  },
  { 
    icon: '🔥', 
    title: "Build-in-Public Studio",       
    desc: "Log daily wins, maintain streak momentum, and automatically sync public GitHub activity metrics.",      
    color: "from-teal-500/15 via-emerald-600/10 to-stone-900/40",  
    border: "border-teal-500/30 hover:border-teal-400/60",
    badge: "Live Sync",
    badgeColor: "bg-teal-500/10 text-teal-300 border-teal-500/30"
  },
  { 
    icon: '🎵', 
    title: "Focus & Flow Audio",    
    desc: "Bespoke soundscapes and mood-curated acoustic tracks designed to anchor your mind in deep work.", 
    color: "from-stone-700/30 via-stone-800/20 to-stone-900/50",     
    border: "border-stone-700 hover:border-stone-500",
    badge: "Audio Engine",
    badgeColor: "bg-stone-800 text-stone-300 border-stone-700"
  },
];

const STATS = [
  { value: "4",    label: "Decoupled Microservices", suffix: "" },
  { value: "WebGL", label: "Interactive 3D Engine",   suffix: "" },
  { value: "0ms",   label: "Zero Configuration",      suffix: "" },
  { value: "100%",  label: "Developer Focused",       suffix: "" },
];

export default function LandingPage() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const onMouse = (e) => setMousePos({ 
      x: (e.clientX / window.innerWidth - 0.5) * 2, 
      y: (e.clientY / window.innerHeight - 0.5) * 2 
    });
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener('mousemove', onMouse);
    window.addEventListener('scroll',    onScroll);
    return () => { 
      window.removeEventListener('mousemove', onMouse); 
      window.removeEventListener('scroll', onScroll); 
    };
  }, []);

  return (
    <div className="relative bg-[#090807] text-stone-100 overflow-x-hidden selection:bg-amber-500/30 selection:text-amber-200 font-sans">
      <Landing3DBackground />

      {/* ── Navbar ──────────────────────────────────────────────── */}
      <nav
        className="fixed top-0 inset-x-0 z-50 flex items-center justify-between px-6 sm:px-12 py-5 transition-all duration-500"
        style={{ 
          background: scrollY > 40 ? 'rgba(12, 10, 9, 0.85)' : 'transparent', 
          backdropFilter: scrollY > 40 ? 'blur(16px)' : 'none', 
          borderBottom: scrollY > 40 ? '1px solid rgba(245, 158, 11, 0.15)' : '1px solid transparent' 
        }}
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-emerald-600 flex items-center justify-center text-base font-black text-stone-950 shadow-lg shadow-amber-500/20">
            D
          </div>
          <span className="text-xl font-bold tracking-tight text-stone-100">
            Dev<span className="text-amber-400">Hub</span>
          </span>
        </div>

        <div className="hidden md:flex items-center gap-8 text-xs font-semibold uppercase tracking-widest text-stone-400">
          <a href="#features" className="hover:text-amber-400 transition-colors">Features</a>
          <a href="#architecture" className="hover:text-emerald-400 transition-colors">Architecture</a>
          <a href="#cta" className="hover:text-rose-400 transition-colors">Workspace</a>
        </div>

        <Link 
          to="/login" 
          className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-xs font-bold uppercase tracking-wider text-stone-950 transition-all shadow-lg shadow-amber-500/20 hover:shadow-amber-500/40 hover:scale-105 active:scale-95"
        >
          Enter Dashboard →
        </Link>
      </nav>

      {/* ── Hero Section ────────────────────────────────────────── */}
      <section className="relative z-10 min-h-screen flex flex-col items-center justify-center text-center px-6 pt-28 pb-16">
        {/* Parallax ambient glows */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ 
            transform: `translate(${mousePos.x * -16}px, ${mousePos.y * -10}px)`, 
            transition: 'transform 0.2s cubic-bezier(0.16, 1, 0.3, 1)' 
          }}
        >
          <div className="absolute top-1/4 left-1/4 w-[450px] h-[450px] rounded-full bg-amber-500/10 blur-[140px]" />
          <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-emerald-500/10 blur-[130px]" />
        </div>

        <div
          className="relative z-10 max-w-4xl mx-auto"
          style={{ transform: `translateY(${scrollY * 0.2}px)`, opacity: Math.max(0, 1 - scrollY / 600) }}
        >
          {/* Warm Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-4.5 py-2 text-xs font-mono font-medium text-amber-300 mb-8 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
            <span>MIDNIGHT AMBER WORKSPACE • 3D MICROSERVICES</span>
          </div>

          <h1 className="text-5xl sm:text-6xl md:text-7xl font-black tracking-tight leading-[1.08] text-stone-100">
            Crafted for flow. <br />
            <span className="bg-gradient-to-r from-amber-400 via-emerald-400 to-rose-400 bg-clip-text text-transparent">
              Engineered with precision.
            </span>
          </h1>

          <p className="mt-7 text-base sm:text-lg text-stone-400 max-w-2xl mx-auto leading-relaxed font-light">
            DevHub unifies your development lifecycle. Experience AI code analysis, stack planning, focus metrics, and habit building inside an interactive 3D WebGL ecosystem.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/login"
              className="px-8 py-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold text-sm uppercase tracking-wider shadow-xl shadow-amber-500/20 hover:shadow-amber-500/40 hover:scale-105 transition-all duration-300"
            >
              Open 3D Workspace →
            </Link>
            <a
              href="#features"
              className="px-8 py-4 rounded-xl border border-stone-800 bg-stone-900/60 backdrop-blur-md text-stone-300 font-semibold text-sm hover:border-amber-500/40 hover:text-white transition-all duration-300"
            >
              Explore Capabilities ↓
            </a>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-60 animate-bounce">
          <span className="text-[10px] font-mono uppercase tracking-widest text-stone-500">Scroll down</span>
          <div className="w-0.5 h-6 bg-gradient-to-b from-amber-500/60 to-transparent rounded-full" />
        </div>
      </section>

      {/* ── Stats Bar ───────────────────────────────────────────── */}
      <section id="stats" className="relative z-10 py-16 border-y border-stone-800/60 bg-stone-950/40 backdrop-blur-md">
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
          {STATS.map((s, i) => (
            <Reveal key={s.label} delay={i * 80} direction="scale">
              <div className="text-center">
                <div className="text-3xl sm:text-4xl font-black bg-gradient-to-r from-amber-400 to-emerald-400 bg-clip-text text-transparent">
                  {s.value}{s.suffix}
                </div>
                <div className="text-xs text-stone-400 mt-1.5 font-medium uppercase tracking-wider">{s.label}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── Features Grid ───────────────────────────────────────── */}
      <section id="features" className="relative z-10 py-28 px-6 sm:px-12">
        <div className="max-w-6xl mx-auto">
          <Reveal direction="up">
            <div className="text-center mb-16">
              <span className="inline-block text-[11px] font-mono uppercase tracking-widest text-amber-400 border border-amber-500/30 bg-amber-500/10 px-3.5 py-1 rounded-full mb-4">
                Decoupled Architecture
              </span>
              <h2 className="text-4xl sm:text-5xl font-black text-stone-100 tracking-tight">
                Designed for high velocity,<br />
                <span className="bg-gradient-to-r from-amber-400 via-emerald-400 to-rose-400 bg-clip-text text-transparent">
                  visualized in 3D.
                </span>
              </h2>
              <p className="mt-4 text-stone-400 max-w-lg mx-auto text-sm leading-relaxed">
                Four independent Spring Boot microservices driving rich WebGL canvas representations on the frontend.
              </p>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((f, i) => (
              <Reveal key={f.title} delay={i * 70} direction="up">
                <div className={`group relative overflow-hidden rounded-2xl border ${f.border} bg-gradient-to-br ${f.color} p-7 backdrop-blur-md hover:scale-[1.02] transition-all duration-300 cursor-default shadow-lg shadow-black/40`}>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-3xl select-none">{f.icon}</span>
                    <span className={`text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md border ${f.badgeColor}`}>
                      {f.badge}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-stone-100 mb-2">{f.title}</h3>
                  <p className="text-xs text-stone-400 leading-relaxed font-light">{f.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Architecture Section ─────────────────────────────────── */}
      <section id="architecture" className="relative z-10 py-24 px-6 sm:px-12 bg-stone-950/60 border-t border-stone-800/60">
        <div className="max-w-5xl mx-auto">
          <Reveal direction="up">
            <div className="text-center mb-14">
              <span className="inline-block text-[11px] font-mono uppercase tracking-widest text-emerald-400 border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1 rounded-full mb-4">
                Service Topology
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-stone-100">
                Independent Microservices Stack
              </h2>
              <p className="text-xs text-stone-400 mt-2">Each feature runs autonomously on dedicated ports with fallback support</p>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { port: '8081', name: 'Code Explainer', color: 'border-amber-500/30 bg-amber-500/5 text-amber-400' },
              { port: '8082', name: 'Stack Decider',  color: 'border-emerald-500/30 bg-emerald-500/5 text-emerald-400' },
              { port: '8083', name: 'Dashboard Data', color: 'border-rose-500/30 bg-rose-500/5 text-rose-400' },
              { port: '8084', name: 'Tracker & Bingo', color: 'border-teal-500/30 bg-teal-500/5 text-teal-400' },
            ].map((s, i) => (
              <Reveal key={s.port} delay={i * 90} direction="up">
                <div className={`rounded-2xl border ${s.color} p-6 text-center backdrop-blur-md`}>
                  <div className="text-xs font-mono font-bold text-stone-500 mb-1">PORT</div>
                  <div className="text-3xl font-black font-mono">{s.port}</div>
                  <div className="text-xs font-bold mt-2 uppercase tracking-wider text-stone-300">{s.name}</div>
                  <div className="mt-3 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-[9px] font-mono text-emerald-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span>ACTIVE</span>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Section ─────────────────────────────────────────── */}
      <section id="cta" className="relative z-10 py-28 px-6 sm:px-12">
        <Reveal direction="scale">
          <div className="max-w-3xl mx-auto text-center relative overflow-hidden rounded-3xl border border-amber-500/30 bg-gradient-to-br from-stone-900 via-stone-950 to-stone-900 p-12 backdrop-blur-xl shadow-2xl shadow-black/80">
            <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-amber-500/10 blur-[90px] pointer-events-none" />
            <div className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full bg-emerald-500/10 blur-[90px] pointer-events-none" />
            <div className="relative z-10">
              <h2 className="text-3xl sm:text-5xl font-black text-stone-100 tracking-tight leading-tight">
                Step into your <br />
                <span className="bg-gradient-to-r from-amber-400 to-emerald-400 bg-clip-text text-transparent">
                  new coding environment.
                </span>
              </h2>
              <p className="mt-4 text-stone-400 text-sm max-w-md mx-auto leading-relaxed font-light">
                Launch DevHub to inspect your code, plan stacks, track habits, and visualize your progress in 3D.
              </p>
              <Link
                to="/login"
                className="mt-8 inline-flex items-center gap-2 px-9 py-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs uppercase tracking-wider shadow-xl shadow-amber-500/20 hover:shadow-amber-500/40 hover:scale-105 transition-all duration-300"
              >
                Launch DevHub Workspace →
              </Link>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ── Footer ──────────────────────────────────────────────── */}
      <footer className="relative z-10 border-t border-stone-800/60 py-8 text-center text-xs font-mono text-stone-600">
        DevHub Architecture · React Three Fiber · Spring Boot Microservices
      </footer>
    </div>
  );
}
