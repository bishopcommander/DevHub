import React, { useState, useEffect } from 'react';
import Card from '../ui/Card';
import { useAuth } from '../../context/AuthContext';
import { useGitHubAnalyzer } from '../../hooks/useGitHubAnalyzer';
import { getStackSuggestion } from '../../api/devhubApi';

const PROJECT_TEMPLATES = [
  {
    title: 'AI PDF Assistant 🤖',
    idea: 'An AI chatbot assistant that lets users upload PDF documents, indexes them, and streams conversational answers with citations.'
  },
  {
    title: 'Developer Blog & Portfolio ✍️',
    idea: 'A developer portfolio and writing website with markdown rendering, fast static page generation, and good SEO.'
  },
  {
    title: 'Multiplayer Collaborative Canvas 🎨',
    idea: 'A real-time whiteboard canvas application where teams can draw and drop shapes together simultaneously with live cursor tracking.'
  },
  {
    title: 'B2B SaaS Invoicing Platform 💼',
    idea: 'A B2B SaaS application that lets team members manage workspaces, create recurring PDF invoices, charge clients via Stripe, and track billing analytics.'
  },
  {
    title: 'Web3 Wallet & NFT Tracker 🌐',
    idea: 'A decentralized application to view users ERC-20 token balances, display their NFT inventory collections, and track active smart contract logs.'
  },
  {
    title: 'Social Microblogging Feed 🐦',
    idea: 'A lightweight social network platform featuring user profiles, chronological post feeds, image uploads, and real-time like counters.'
  },
  {
    title: 'Productivity Pomodoro Timer ⏱️',
    idea: 'A simple productivity dashboard with customizable pomodoro intervals, ambient sound selectors, and session history stored locally in the browser.'
  }
];

const LOADING_PHRASES = [
  'Analyzing project keywords...',
  'Evaluating complexity metrics...',
  'De-scaling Kubernetes clusters...',
  'Stripping away microservice boilerplate...',
  'Calculating real production costs...',
  'Consulting anti-overengineering guidelines...',
  'Formulating realistic suggestions...'
];

const StackDecider = ({ setActive }) => {
  const { user } = useAuth();
  const { data: githubData } = useGitHubAnalyzer(user);

  const [idea, setIdea] = useState('');
  const [tailorGitHub, setTailorGitHub] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingPhrase, setLoadingPhrase] = useState(LOADING_PHRASES[0]);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);

  // Rotate loading phrases when active
  useEffect(() => {
    let interval;
    if (loading) {
      let idx = 0;
      interval = setInterval(() => {
        idx = (idx + 1) % LOADING_PHRASES.length;
        setLoadingPhrase(LOADING_PHRASES[idx]);
      }, 1200);
    }
    return () => clearInterval(interval);
  }, [loading]);

  const githubLanguages = githubData?.languages?.map(l => l.lang) || [];

  const handleTemplateClick = (templateIdea) => {
    setIdea(templateIdea);
    setError('');
  };

  const handleDecide = async (e) => {
    e.preventDefault();
    if (!idea.trim()) {
      setError('Please input a short project idea.');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await getStackSuggestion({
        idea: idea.trim(),
        tailorGitHub: tailorGitHub && user?.githubConnected,
        gitHubLanguages: githubLanguages
      });
      setResult(response);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to fetch suggestions. Please check if the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 p-4 sm:p-6 max-w-6xl mx-auto">
      
      {/* ─── Breadcrumbs / Back navigation ────────────────────────── */}
      {setActive && (
        <nav className="flex items-center gap-2 text-xs font-semibold text-slate-500">
          <button 
            onClick={() => setActive('overview')} 
            className="hover:text-cyan-405 transition-colors flex items-center gap-1.5"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="h-3.5 w-3.5">
              <path d="M19 12H5" />
              <path d="M12 19l-7-7 7-7" />
            </svg>
            Dashboard
          </button>
          <span>/</span>
          <span className="text-slate-400">Stack Decider</span>
        </nav>
      )}
      
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/40 p-6 sm:p-8 shadow-2xl">
        <div className="absolute -right-20 -top-20 h-60 w-60 rounded-full bg-cyan-500/10 blur-[100px] pointer-events-none" />
        <div className="absolute -left-20 -bottom-20 h-48 w-48 rounded-full bg-blue-600/5 blur-[90px] pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-cyan-500/10 border border-cyan-500/30 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-cyan-400">
                Architect Mode
              </span>
            </div>
            <h1 className="text-2xl font-extrabold text-white mt-2 tracking-tight sm:text-3xl">
              Opinionated Stack Decider ⚡
            </h1>
            <p className="text-sm text-slate-400 mt-2 max-w-2xl leading-relaxed">
              Describe your project idea, and we'll suggest a realistic tech stack. Our primary goal is to help you bypass developer graves and avoid building overengineered setups on day one.
            </p>
          </div>
          
          <div className="flex-shrink-0 bg-slate-950/60 p-4 rounded-2xl border border-slate-800/80 max-w-xs">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">GitHub Tech Profile</h3>
            {user?.githubConnected ? (
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <img src={user.githubAvatarUrl} className="h-5 w-5 rounded-full" alt="avatar" />
                  <span className="text-xs font-bold text-cyan-400">@{user.githubUsername}</span>
                </div>
                <div className="flex flex-wrap gap-1 mt-1">
                  {githubLanguages.slice(0, 3).map(lang => (
                    <span key={lang} className="text-[9px] bg-slate-800 px-1.5 py-0.5 rounded text-slate-300 font-mono">
                      {lang}
                    </span>
                  ))}
                  {githubLanguages.length === 0 && (
                    <span className="text-[10px] text-slate-500 italic">No repo language data</span>
                  )}
                </div>
              </div>
            ) : (
              <div>
                <p className="text-[10px] text-slate-500 leading-normal mb-2">
                  Link GitHub to tailor recommendations to languages you already write.
                </p>
                <div className="text-[10px] text-cyan-400 font-bold">
                  🔗 Link account on Overview panel
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Left Column: Form & templates */}
        <div className="md:col-span-1 space-y-6">
          <Card className="p-5">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 mb-4">Project Parameters</h3>
            
            <form onSubmit={handleDecide} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Describe Your Project Idea
                </label>
                <textarea
                  value={idea}
                  onChange={(e) => { setIdea(e.target.value); setError(''); }}
                  placeholder="e.g. A desktop timer app that lets users sync tasks with Todoist and play white noise..."
                  rows={6}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-xs text-slate-200 placeholder-slate-650 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/25 focus:outline-none transition-all resize-none leading-relaxed"
                  required
                />
              </div>

              {/* GitHub Tailoring Toggle */}
              <div className="flex items-center justify-between p-3 rounded-xl border border-slate-800/80 bg-slate-950/30">
                <div>
                  <p className="text-xs font-bold text-slate-300">Tailor with GitHub profile</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">Use your top GitHub languages</p>
                </div>
                <button
                  type="button"
                  disabled={!user?.githubConnected}
                  onClick={() => setTailorGitHub(!tailorGitHub)}
                  className={`relative inline-flex h-6 w-11 rounded-full border-2 border-transparent transition-colors ${
                    !user?.githubConnected
                      ? 'bg-slate-900 cursor-not-allowed opacity-40'
                      : tailorGitHub
                        ? 'bg-cyan-500'
                        : 'bg-slate-700'
                  }`}
                >
                  <span
                    className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition duration-200 ${
                      tailorGitHub && user?.githubConnected ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {error && (
                <div className="rounded-xl border border-rose-500/20 bg-rose-500/5 p-3 text-[11px] text-rose-400 flex items-start gap-2">
                  <span className="shrink-0 mt-0.5">⚠️</span>
                  <span>{error}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 py-3 text-xs font-bold text-slate-950 shadow-lg shadow-cyan-500/10 transition-all duration-300 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none"
              >
                <span>Decide My Stack ⚡</span>
              </button>
            </form>
          </Card>

          {/* Quick Idea Templates */}
          <Card className="p-5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Quick Idea Templates</h3>
            <div className="space-y-2.5">
              {PROJECT_TEMPLATES.map((tmpl) => (
                <button
                  key={tmpl.title}
                  onClick={() => handleTemplateClick(tmpl.idea)}
                  className="w-full text-left p-3 rounded-xl border border-slate-800 bg-slate-950/40 hover:border-cyan-500/25 hover:bg-cyan-500/[0.02] transition-all text-xs"
                >
                  <p className="font-bold text-slate-200">{tmpl.title}</p>
                  <p className="text-[10px] text-slate-500 mt-1 line-clamp-2 leading-relaxed">{tmpl.idea}</p>
                </button>
              ))}
            </div>
          </Card>
        </div>

        {/* Right Column: Loading / Results */}
        <div className="md:col-span-2 space-y-6">
          
          {loading && (
            <div className="rounded-3xl border border-slate-800/80 bg-slate-900/30 p-12 flex flex-col items-center justify-center min-h-[480px]">
              <div className="relative flex items-center justify-center">
                <div className="h-16 w-16 animate-spin rounded-full border-[3px] border-cyan-400 border-t-transparent" />
                <div className="absolute h-10 w-10 animate-ping rounded-full border border-cyan-500/30" />
              </div>
              <p className="mt-6 text-sm font-bold text-white tracking-wide animate-pulse">
                {loadingPhrase}
              </p>
              <p className="text-[10px] text-slate-500 font-mono mt-1">Filtering out standard dev graves...</p>
            </div>
          )}

          {!loading && !result && (
            <div className="rounded-3xl border border-slate-800/60 bg-slate-950/15 p-12 flex flex-col items-center justify-center min-h-[480px] text-center border-dashed">
              <div className="h-12 w-12 rounded-2xl bg-slate-900/80 border border-slate-800 grid place-content-center text-xl shadow-lg">
                📋
              </div>
              <h3 className="text-base font-bold text-slate-300 mt-4">Waiting for Project Idea</h3>
              <p className="text-xs text-slate-500 mt-2 max-w-sm leading-relaxed">
                Describe your project or click one of the templates on the left to see our opinionated stack suggestions and overengineering warnings.
              </p>
            </div>
          )}

          {result && (
            <div className="space-y-6 animate-fadeIn">
              
              {/* Complexity Banner */}
              <div className="grid gap-4 sm:grid-cols-4 items-center rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
                <div className="sm:col-span-1 flex flex-col items-center sm:items-start text-center sm:text-left gap-1">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Complexity</span>
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className={`inline-block h-2.5 w-2.5 rounded-full ${
                      result.estimatedComplexity === 'Low'
                        ? 'bg-emerald-400'
                        : result.estimatedComplexity === 'Medium'
                          ? 'bg-amber-400'
                          : 'bg-rose-500'
                    }`} />
                    <span className={`text-base font-extrabold ${
                      result.estimatedComplexity === 'Low'
                        ? 'text-emerald-400'
                        : result.estimatedComplexity === 'Medium'
                          ? 'text-amber-400'
                          : 'text-rose-400'
                    }`}>
                      {result.estimatedComplexity}
                    </span>
                  </div>
                </div>
                
                <div className="sm:col-span-3 border-t sm:border-t-0 sm:border-l border-slate-800 pt-3 sm:pt-0 sm:pl-5">
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Architect Rationale</p>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                    {result.rationale}
                  </p>
                </div>
              </div>

              {/* Tailor Status Banner */}
              <div className="rounded-xl border border-slate-800/80 bg-slate-950/40 px-4 py-3 text-xs text-slate-400 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm">🎯</span>
                  <span>{result.tailorStatus}</span>
                </div>
                {result.tailorStatus.includes('Tailored') && (
                  <span className="rounded-full bg-cyan-500/10 border border-cyan-500/30 px-2 py-0.5 text-[8px] font-bold uppercase tracking-wider text-cyan-400 shrink-0">
                    GitHub Profile Synced
                  </span>
                )}
              </div>

              {/* Stack Suggestions Grid */}
              <div className="grid gap-4 sm:grid-cols-3">
                
                {/* Frontend */}
                <Card className="p-5 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Frontend</span>
                      <span className="text-xs">💻</span>
                    </div>
                    <h4 className="text-lg font-extrabold text-white mt-3">{result.frontend.name}</h4>
                    <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">{result.frontend.reason}</p>
                    
                    <div className="mt-4 space-y-2">
                      <div>
                        <span className="text-[9px] font-bold uppercase text-emerald-400 tracking-wider">Pros</span>
                        <ul className="mt-1 space-y-1">
                          {result.frontend.pros.map((p, i) => (
                            <li key={i} className="text-[10px] text-slate-300 flex items-start gap-1">
                              <span className="text-emerald-400shrink-0">✓</span>
                              <span className="leading-tight">{p}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      {result.frontend.cons && result.frontend.cons.length > 0 && (
                        <div className="mt-2">
                          <span className="text-[9px] font-bold uppercase text-slate-500 tracking-wider">Cons</span>
                          <ul className="mt-1 space-y-1">
                            {result.frontend.cons.map((c, i) => (
                              <li key={i} className="text-[10px] text-slate-400 flex items-start gap-1">
                                <span className="text-slate-500 shrink-0">✕</span>
                                <span className="leading-tight">{c}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                </Card>

                {/* Backend */}
                <Card className="p-5 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Backend</span>
                      <span className="text-xs">⚙️</span>
                    </div>
                    <h4 className="text-lg font-extrabold text-white mt-3">{result.backend.name}</h4>
                    <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">{result.backend.reason}</p>

                    <div className="mt-4 space-y-2">
                      <div>
                        <span className="text-[9px] font-bold uppercase text-emerald-400 tracking-wider">Pros</span>
                        <ul className="mt-1 space-y-1">
                          {result.backend.pros.map((p, i) => (
                            <li key={i} className="text-[10px] text-slate-300 flex items-start gap-1">
                              <span className="text-emerald-400 shrink-0">✓</span>
                              <span className="leading-tight">{p}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      {result.backend.cons && result.backend.cons.length > 0 && (
                        <div className="mt-2">
                          <span className="text-[9px] font-bold uppercase text-slate-500 tracking-wider">Cons</span>
                          <ul className="mt-1 space-y-1">
                            {result.backend.cons.map((c, i) => (
                              <li key={i} className="text-[10px] text-slate-400 flex items-start gap-1">
                                <span className="text-slate-500 shrink-0">✕</span>
                                <span className="leading-tight">{c}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                </Card>

                {/* Database */}
                <Card className="p-5 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Database</span>
                      <span className="text-xs">💾</span>
                    </div>
                    <h4 className="text-lg font-extrabold text-white mt-3">{result.database.name}</h4>
                    <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">{result.database.reason}</p>

                    <div className="mt-4 space-y-2">
                      <div>
                        <span className="text-[9px] font-bold uppercase text-emerald-400 tracking-wider">Pros</span>
                        <ul className="mt-1 space-y-1">
                          {result.database.pros.map((p, i) => (
                            <li key={i} className="text-[10px] text-slate-300 flex items-start gap-1">
                              <span className="text-emerald-400 shrink-0">✓</span>
                              <span className="leading-tight">{p}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      {result.database.cons && result.database.cons.length > 0 && (
                        <div className="mt-2">
                          <span className="text-[9px] font-bold uppercase text-slate-500 tracking-wider">Cons</span>
                          <ul className="mt-1 space-y-1">
                            {result.database.cons.map((c, i) => (
                              <li key={i} className="text-[10px] text-slate-400 flex items-start gap-1">
                                <span className="text-slate-500 shrink-0">✕</span>
                                <span className="leading-tight">{c}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              </div>

              {/* Warnings / Overengineering Alerts */}
              <div className="rounded-2xl border border-amber-500/25 bg-amber-500/[0.02] p-5 space-y-3">
                <div className="flex items-center gap-2 text-amber-400 pb-2 border-b border-amber-500/10">
                  <span className="text-base">🛡️</span>
                  <h4 className="text-xs font-bold uppercase tracking-wider">Anti-Overengineering Shield</h4>
                </div>
                <ul className="space-y-2">
                  {result.warnings.map((warn, i) => (
                    <li key={i} className="text-xs text-amber-200/90 leading-relaxed flex items-start gap-2">
                      <span className="text-amber-500 shrink-0 mt-0.5">•</span>
                      <span>{warn}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Simplified Alternatives Comparison */}
              {result.overengineeringAlternatives && result.overengineeringAlternatives.length > 0 && (
                <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5 space-y-3">
                  <div className="flex items-center gap-2 text-slate-300 pb-2 border-b border-slate-800">
                    <span className="text-base">💡</span>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Keep it Simple Path</h4>
                  </div>
                  <ul className="space-y-2">
                    {result.overengineeringAlternatives.map((alt, i) => (
                      <li key={i} className="text-xs text-slate-300 leading-relaxed flex items-start gap-2">
                        <span className="text-cyan-400 shrink-0 mt-0.5">→</span>
                        <span>{alt}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StackDecider;
