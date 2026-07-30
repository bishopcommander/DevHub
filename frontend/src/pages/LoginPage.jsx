import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';

const LoginPage = () => {
  const { loginWithEmail, loginWithOAuth } = useAuth();
  const navigate = useNavigate();

  // Tab state: 'social' or 'email'
  const [activeTab, setActiveTab] = useState('social');
  
  // Email states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Custom GitHub OAuth states
  const [githubUsername, setGithubUsername] = useState('');
  const [githubToken, setGithubToken] = useState('');
  const [showGithubModal, setShowGithubModal] = useState(false);

  // Loading/error states
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [modalError, setModalError] = useState('');

  const handleSocialLogin = async (provider) => {
    if (provider === 'github') {
      setShowGithubModal(true);
      return;
    }

    try {
      setIsLoading(true);
      setError('');
      await loginWithOAuth(provider);
      navigate('/app');
    } catch (err) {
      setError(`Failed to sign in with ${provider}. Please try again.`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGithubSubmit = async (e) => {
    e.preventDefault();
    if (!githubUsername.trim() || !githubToken.trim()) return;

    setIsLoading(true);
    setModalError('');
    try {
      await loginWithOAuth('github', githubUsername.trim(), githubToken.trim());
      setShowGithubModal(false);
      setGithubUsername('');
      setGithubToken('');
      navigate('/app');
    } catch (err) {
      setModalError(err.message || 'GitHub account does not exist. Check spelling.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    try {
      setIsLoading(true);
      setError('');
      await loginWithEmail(email, password);
      navigate('/app');
    } catch (err) {
      setError('Invalid email or password.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#090807] px-4 py-12 text-stone-100 font-sans selection:bg-amber-500/30 selection:text-amber-200">
      {/* Dynamic Ambient Glows */}
      <div className="absolute -left-20 -top-20 h-96 w-96 rounded-full bg-amber-500/10 blur-[140px] pointer-events-none" />
      <div className="absolute -right-20 -bottom-20 h-96 w-96 rounded-full bg-emerald-500/10 blur-[140px] pointer-events-none" />

      {/* Grid container to match premium two-column look on bigger screens */}
      <div className="relative z-10 grid w-full max-w-5xl gap-8 lg:grid-cols-2">
        {/* Left Side: Brand & Product Banner */}
        <div className="hidden flex-col justify-between rounded-3xl border border-stone-800/80 bg-stone-950/60 p-8 backdrop-blur-xl lg:flex shadow-2xl shadow-black/80">
          <div>
            <Link to="/" className="inline-flex items-center gap-3 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-emerald-600 flex items-center justify-center text-sm font-black text-stone-950 shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform">
                D
              </div>
              <span className="text-xl font-bold tracking-tight text-stone-100 group-hover:text-amber-300 transition-colors">
                Dev<span className="text-amber-400">Hub</span>
              </span>
            </Link>
            
            <div className="mt-12 space-y-6">
              <span className="inline-block text-[10px] font-mono uppercase tracking-widest text-amber-400 border border-amber-500/30 bg-amber-500/10 px-3 py-1 rounded-full">
                Developer Workspace • Microservices
              </span>
              <h1 className="text-4xl font-black tracking-tight text-stone-100 leading-tight">
                Your coding lifecycle,{' '}
                <span className="bg-gradient-to-r from-amber-400 via-emerald-400 to-rose-400 bg-clip-text text-transparent">
                  visualized in 3D.
                </span>
              </h1>
              <p className="text-sm text-stone-400 leading-relaxed font-light">
                Connect your workspace to aggregate focus metrics, inspect Abstract Syntax Trees in 3D, recommend production tech stacks, and maintain daily habit streaks.
              </p>
            </div>
          </div>

          {/* Feature Highlight Cards */}
          <div className="mt-8 space-y-3">
            <div className="flex items-center gap-3.5 rounded-2xl border border-stone-800/80 bg-stone-900/40 p-4 transition-all duration-300 hover:border-amber-500/30">
              <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 text-sm">
                🧠
              </div>
              <div>
                <h4 className="text-xs font-bold text-stone-200">AI Code Explainer (:8081)</h4>
                <p className="text-[11px] text-stone-500 font-light">3D AST code parsing & complexity metrics</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5 rounded-2xl border border-stone-800/80 bg-stone-900/40 p-4 transition-all duration-300 hover:border-emerald-500/30">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 text-sm">
                ⚡
              </div>
              <div>
                <h4 className="text-xs font-bold text-stone-200">Tech Stack Decider (:8082)</h4>
                <p className="text-[11px] text-stone-500 font-light">3D orbital tech recommendation engine</p>
              </div>
            </div>
          </div>

          <div className="mt-8 text-[11px] font-mono text-stone-600">
            © {new Date().getFullYear()} DevHub Platform · Microservice Architecture
          </div>
        </div>

        {/* Right Side: Auth Form Container */}
        <div className="flex flex-col justify-center">
          <div className="w-full rounded-3xl border border-stone-800/80 bg-stone-950/70 p-6 sm:p-10 shadow-2xl backdrop-blur-xl shadow-black/80">
            {/* Header */}
            <div className="text-center lg:text-left">
              <div className="lg:hidden flex items-center justify-center gap-2.5 mb-6">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-500 to-emerald-600 flex items-center justify-center text-xs font-black text-stone-950 shadow-md">
                  D
                </div>
                <span className="text-lg font-bold tracking-tight">Dev<span className="text-amber-400">Hub</span></span>
              </div>
              <h2 className="text-2xl font-black tracking-tight text-stone-100 sm:text-3xl">
                Enter Workspace
              </h2>
              <p className="mt-1.5 text-xs text-stone-400 font-light">
                Select your preferred authentication method to continue.
              </p>
            </div>

            {/* Toggle Tabs */}
            <div className="mt-7 flex rounded-xl bg-stone-900/80 p-1 border border-stone-800">
              <button
                onClick={() => { setActiveTab('social'); setError(''); }}
                className={`flex-1 rounded-lg py-2 text-xs font-mono font-bold uppercase tracking-wider transition-all duration-200 ${
                  activeTab === 'social'
                    ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30 shadow-sm'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                OAuth Login
              </button>
              <button
                onClick={() => { setActiveTab('email'); setError(''); }}
                className={`flex-1 rounded-lg py-2 text-xs font-mono font-bold uppercase tracking-wider transition-all duration-200 ${
                  activeTab === 'email'
                    ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30 shadow-sm'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                Email Credentials
              </button>
            </div>

            {error && (
              <div className="mt-5 rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-xs font-mono text-rose-300 flex items-center gap-2">
                <span>⚠️</span>
                <span>{error}</span>
              </div>
            )}

            {/* Loading state */}
            {isLoading && !showGithubModal && (
              <div className="my-10 flex flex-col items-center justify-center gap-3 py-6">
                <div className="h-8 w-8 animate-spin rounded-full border-[3px] border-amber-400 border-t-transparent" />
                <p className="text-xs text-stone-400 animate-pulse font-mono">
                  Establishing secure handshake...
                </p>
              </div>
            )}

            {(!isLoading || showGithubModal) && (
              <div className="mt-6">
                {/* Social Login Form */}
                {activeTab === 'social' && (
                  <div className="space-y-3.5">
                    {/* Primary provider: GitHub */}
                    <button
                      onClick={() => handleSocialLogin('github')}
                      className="group relative flex w-full items-center justify-center gap-3 rounded-xl border border-stone-700/80 bg-stone-900/80 px-4 py-3.5 text-xs font-bold uppercase tracking-wider text-stone-100 shadow-lg transition-all duration-200 hover:border-amber-500/40 hover:bg-stone-850 hover:shadow-amber-500/10 active:scale-[0.98]"
                    >
                      <svg className="h-5 w-5 fill-stone-100" viewBox="0 0 24 24" aria-hidden="true">
                        <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482C19.138 20.193 22 16.437 22 12.017 22 6.484 17.522 2 12 2z" />
                      </svg>
                      <span>Continue with GitHub</span>
                    </button>

                    {/* Divider */}
                    <div className="flex items-center gap-3 py-2">
                      <span className="h-px flex-1 bg-stone-800" />
                      <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-stone-500">Standard Providers</span>
                      <span className="h-px flex-1 bg-stone-800" />
                    </div>

                    {/* Google */}
                    <button
                      onClick={() => handleSocialLogin('google')}
                      className="flex w-full items-center justify-center gap-3 rounded-xl border border-stone-800 bg-stone-900/40 px-4 py-3 text-xs font-semibold text-stone-300 transition-all duration-200 hover:bg-stone-900 hover:border-stone-700 active:scale-[0.98]"
                    >
                      <svg className="h-4 w-4" viewBox="0 0 24 24">
                        <path fill="#EA4335" d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-5.18 4.114-3.466 0-6.277-2.85-6.277-6.36s2.81-6.36 6.277-6.36c1.583 0 3.024.587 4.135 1.547l3.056-3.057C19.043 2.38 15.897 1 12.24 1 5.922 1 1 5.922 1 12.24s4.922 11.24 11.24 11.24c5.895 0 10.87-4.22 10.87-11.24 0-.768-.068-1.5-.2-2.195H12.24z"/>
                      </svg>
                      <span>Sign in with Google</span>
                    </button>

                    {/* Discord */}
                    <button
                      onClick={() => handleSocialLogin('discord')}
                      className="flex w-full items-center justify-center gap-3 rounded-xl border border-stone-800 bg-stone-900/40 px-4 py-3 text-xs font-semibold text-stone-300 transition-all duration-200 hover:bg-stone-900 hover:border-stone-700 active:scale-[0.98]"
                    >
                      <svg className="h-4 w-4 fill-stone-300" viewBox="0 0 127.14 96.36">
                        <path d="M107.7,8.07A105.15,105.15,0,0,0,77.26,0a77.19,77.19,0,0,0-3.3,6.83A96.67,96.67,0,0,0,53.22,6.83,77.19,77.19,0,0,0,49.88,0,105.15,105.15,0,0,0,19.44,8.07C3.66,31.58-1.95,54.65,1,77.53a105.41,105.41,0,0,0,32,16.29,80.7,80.7,0,0,0,6.72-11A68.32,68.32,0,0,1,28.8,77.53c.92-.68,1.82-1.39,2.69-2.13a75.09,75.09,0,0,0,71.3,0c.87.74,1.77,1.45,2.69,2.13a68.61,68.61,0,0,1-10.89,5.25,80.84,80.84,0,0,0,6.72,11,105.3,105.3,0,0,0,32-16.29C129.24,48.51,123.23,25.69,107.7,8.07ZM42.45,65.69C35.39,65.69,29.6,59.2,29.6,51.27s5.79-14.42,12.85-14.42,12.92,6.56,12.85,14.42S49.52,65.69,42.45,65.69Zm42.24,0C77.63,65.69,71.84,59.2,71.84,51.27s5.79-14.42,12.85-14.42,12.92,6.56,12.85,14.42S91.75,65.69,84.69,65.69Z"/>
                      </svg>
                      <span>Sign in with Discord</span>
                    </button>
                  </div>
                )}

                {/* Email/Password Form */}
                {activeTab === 'email' && (
                  <form onSubmit={handleEmailSubmit} className="space-y-4">
                    <div>
                      <label htmlFor="email" className="block text-[10px] font-mono font-bold uppercase tracking-wider text-stone-400 mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        id="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full rounded-xl border border-stone-800 bg-stone-950 px-4 py-3 text-xs font-mono text-stone-100 placeholder-stone-600 transition-all duration-200 focus:border-amber-400 focus:ring-1 focus:ring-amber-400/25 outline-none"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="password" className="block text-[10px] font-mono font-bold uppercase tracking-wider text-stone-400 mb-2">
                        Password
                      </label>
                      <input
                        type="password"
                        id="password"
                        placeholder="••••••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full rounded-xl border border-stone-800 bg-stone-950 px-4 py-3 text-xs font-mono text-stone-100 placeholder-stone-600 transition-all duration-200 focus:border-amber-400 focus:ring-1 focus:ring-amber-400/25 outline-none"
                        required
                      />
                    </div>

                    <Button type="submit" className="w-full mt-6 py-3.5">
                      Sign In to Workspace →
                    </Button>
                  </form>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* GitHub Account Selection Interactive Modal */}
      {showGithubModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/80 backdrop-blur-md p-4">
          <div className="relative w-full max-w-md rounded-2xl border border-stone-800 bg-stone-900/95 p-6 shadow-2xl backdrop-blur-xl">
            <h3 className="text-lg font-bold text-stone-100 flex items-center gap-2">
              <svg className="h-5 w-5 fill-amber-400" viewBox="0 0 24 24">
                <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482C19.138 20.193 22 16.437 22 12.017 22 6.484 17.522 2 12 2z" />
              </svg>
              GitHub Secure Connection
            </h3>
            <p className="mt-2 text-xs text-stone-400 font-light leading-relaxed">
              Authenticate via GitHub OAuth. Enter your username and Personal Access Token (PAT) to authorize sync.
            </p>

            {modalError && (
              <div className="mt-4 rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-xs font-mono text-rose-300">
                ⚠️ {modalError}
              </div>
            )}

            {isLoading ? (
              <div className="my-8 flex flex-col items-center justify-center gap-3">
                <div className="h-8 w-8 animate-spin rounded-full border-[3px] border-amber-400 border-t-transparent" />
                <p className="text-xs text-stone-400 font-mono">Verifying credentials & syncing profile...</p>
              </div>
            ) : (
              <form onSubmit={handleGithubSubmit} className="mt-5 space-y-4">
                <div>
                  <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-stone-400 mb-2">
                    GitHub Username
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. torvalds or octocat"
                    value={githubUsername}
                    onChange={(e) => setGithubUsername(e.target.value)}
                    className="w-full rounded-xl border border-stone-800 bg-stone-950 px-4 py-3 text-xs font-mono text-stone-100 placeholder-stone-600 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 outline-none"
                    required
                    autoFocus
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-stone-400 mb-2">
                    Personal Access Token / Password
                  </label>
                  <input
                    type="password"
                    placeholder="ghp_••••••••••••••••••••"
                    value={githubToken}
                    onChange={(e) => setGithubToken(e.target.value)}
                    className="w-full rounded-xl border border-stone-800 bg-stone-950 px-4 py-3 text-xs font-mono text-stone-100 placeholder-stone-600 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 outline-none"
                    required
                  />
                </div>

                <div className="flex gap-3 justify-end pt-2">
                  <button
                    type="button"
                    onClick={() => { setShowGithubModal(false); setGithubUsername(''); setGithubToken(''); setModalError(''); }}
                    className="rounded-xl border border-stone-800 bg-transparent px-4 py-2.5 text-xs font-semibold text-stone-300 hover:bg-stone-800 transition-colors"
                  >
                    Cancel
                  </button>
                  <Button type="submit">
                    Authorize & Proceed
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginPage;
