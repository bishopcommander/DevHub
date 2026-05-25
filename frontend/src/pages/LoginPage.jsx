import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 px-4 py-12 text-slate-100 font-sans">
      {/* Dynamic Aesthetic Background Blobs */}
      <div className="absolute -left-20 -top-20 h-96 w-96 rounded-full bg-cyan-500/10 blur-[120px] pointer-events-none" />
      <div className="absolute -right-20 -bottom-20 h-96 w-96 rounded-full bg-blue-600/15 blur-[150px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full bg-indigo-500/5 blur-[180px] pointer-events-none" />

      {/* Grid container to match premium two-column look on bigger screens */}
      <div className="relative z-10 grid w-full max-w-5xl gap-8 lg:grid-cols-2">
        {/* Left Side: Wow/Brand Banner */}
        <div className="hidden flex-col justify-between rounded-3xl border border-slate-800/40 bg-slate-900/35 p-8 backdrop-blur-md lg:flex">
          <div>
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-content-center rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-600 font-black text-slate-950 text-lg shadow-lg shadow-cyan-500/20">
                DH
              </span>
              <span className="text-xl font-bold tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-slate-100 to-slate-300">
                DevHub
              </span>
            </div>
            
            <div className="mt-12 space-y-6">
              <h1 className="text-4xl font-extrabold tracking-tight text-white leading-tight">
                Your coding journey,{' '}
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">
                  beautifully cataloged.
                </span>
              </h1>
              <p className="text-base text-slate-400 leading-relaxed">
                Connect your accounts to aggregate metrics, track deep focus sessions, study your development patterns, and celebrate your architectural breakthroughs.
              </p>
            </div>
          </div>

          {/* Interactive Feature list */}
          <div className="mt-8 space-y-4">
            <div className="flex items-center gap-3 rounded-2xl border border-slate-800/60 bg-slate-950/40 p-4 transition-all duration-300 hover:border-cyan-500/30">
              <div className="text-cyan-400">📊</div>
              <div>
                <h4 className="text-sm font-semibold text-slate-200">Spotify Wrapped for Developers</h4>
                <p className="text-xs text-slate-400">Real-time commit breakdown & productivity analysis</p>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-2xl border border-slate-800/60 bg-slate-950/40 p-4 transition-all duration-300 hover:border-indigo-500/30">
              <div className="text-indigo-400">🪦</div>
              <div>
                <h4 className="text-sm font-semibold text-slate-200">Project Graveyard</h4>
                <p className="text-xs text-slate-400">Reflect, catalog, and learn from abandoned side projects</p>
              </div>
            </div>
          </div>

          <div className="mt-8 text-xs text-slate-500">
            © {new Date().getFullYear()} DevHub Analytics. All rights reserved.
          </div>
        </div>

        {/* Right Side: Auth Form Container */}
        <div className="flex flex-col justify-center">
          <div className="w-full rounded-3xl border border-slate-800/60 bg-slate-900/60 p-6 shadow-2xl backdrop-blur-xl sm:p-10 shadow-slate-950/50">
            {/* Header */}
            <div className="text-center lg:text-left">
              <div className="lg:hidden flex items-center justify-center gap-2 mb-4">
                <span className="grid h-8 w-8 place-content-center rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 font-black text-slate-950 text-sm">
                  DH
                </span>
                <span className="text-lg font-bold tracking-wider">DevHub</span>
              </div>
              <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
                Welcome back
              </h2>
              <p className="mt-2 text-sm text-slate-400">
                Choose your preferred login option to proceed.
              </p>
            </div>

            {/* Toggle Tabs */}
            <div className="mt-8 flex rounded-xl bg-slate-950/80 p-1 border border-slate-800/60">
              <button
                onClick={() => { setActiveTab('social'); setError(''); }}
                className={`flex-1 rounded-lg py-2.5 text-xs font-semibold tracking-wide transition-all duration-200 ${
                  activeTab === 'social'
                    ? 'bg-slate-800 text-white shadow-md'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                OAuth Login
              </button>
              <button
                onClick={() => { setActiveTab('email'); setError(''); }}
                className={`flex-1 rounded-lg py-2.5 text-xs font-semibold tracking-wide transition-all duration-200 ${
                  activeTab === 'email'
                    ? 'bg-slate-800 text-white shadow-md'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Email & Password
              </button>
            </div>

            {error && (
              <div className="mt-6 rounded-xl border border-rose-500/20 bg-rose-500/5 px-4 py-3 text-xs text-rose-300">
                ⚠️ {error}
              </div>
            )}

            {/* Loading overlay overlaying form area */}
            {isLoading && !showGithubModal && (
              <div className="my-12 flex flex-col items-center justify-center gap-3 py-6">
                <div className="h-10 w-10 animate-spin rounded-full border-[3px] border-cyan-400 border-t-transparent" />
                <p className="text-xs text-slate-400 animate-pulse font-mono">
                  Configuring workspace and establishing secure handshake...
                </p>
              </div>
            )}

            {(!isLoading || showGithubModal) && (
              <div className="mt-6">
                {/* Social Login Form */}
                {activeTab === 'social' && (
                  <div className="space-y-4">
                    {/* Primary dev provider: GitHub */}
                    <button
                      onClick={() => handleSocialLogin('github')}
                      className="group relative flex w-full items-center justify-center gap-3 rounded-xl border border-slate-700 bg-slate-800 px-4 py-3.5 text-sm font-semibold text-white shadow-lg transition-all duration-300 hover:border-cyan-400/40 hover:bg-slate-750 hover:shadow-cyan-500/5 active:scale-[0.98]"
                    >
                      {/* GitHub glowing pulse border highlight */}
                      <span className="absolute inset-0 rounded-xl border border-cyan-400/0 transition-all duration-300 group-hover:border-cyan-400/30" />
                      <svg className="h-5 w-5 fill-white" viewBox="0 0 24 24" aria-hidden="true">
                        <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482C19.138 20.193 22 16.437 22 12.017 22 6.484 17.522 2 12 2z" />
                      </svg>
                      <span>Continue with GitHub</span>
                    </button>

                    {/* Divider */}
                    <div className="flex items-center gap-3 py-2">
                      <span className="h-px flex-1 bg-slate-800" />
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Standard Providers</span>
                      <span className="h-px flex-1 bg-slate-800" />
                    </div>

                    {/* Standard: Google */}
                    <button
                      onClick={() => handleSocialLogin('google')}
                      className="flex w-full items-center justify-center gap-3 rounded-xl border border-slate-800 bg-slate-950 px-4 py-3.5 text-sm font-semibold text-slate-200 transition-all duration-200 hover:bg-slate-900 active:scale-[0.98]"
                    >
                      <svg className="h-4 w-4" viewBox="0 0 24 24">
                        <path fill="#EA4335" d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-5.18 4.114-3.466 0-6.277-2.85-6.277-6.36s2.81-6.36 6.277-6.36c1.583 0 3.024.587 4.135 1.547l3.056-3.057C19.043 2.38 15.897 1 12.24 1 5.922 1 1 5.922 1 12.24s4.922 11.24 11.24 11.24c5.895 0 10.87-4.22 10.87-11.24 0-.768-.068-1.5-.2-2.195H12.24z"/>
                      </svg>
                      <span>Sign in with Google</span>
                    </button>

                    {/* Standard: Discord */}
                    <button
                      onClick={() => handleSocialLogin('discord')}
                      className="flex w-full items-center justify-center gap-3 rounded-xl border border-slate-800 bg-slate-950 px-4 py-3.5 text-sm font-semibold text-slate-200 transition-all duration-200 hover:bg-slate-900 active:scale-[0.98]"
                    >
                      <svg className="h-4.5 w-4.5 fill-slate-200" viewBox="0 0 127.14 96.36">
                        <path d="M107.7,8.07A105.15,105.15,0,0,0,77.26,0a77.19,77.19,0,0,0-3.3,6.83A96.67,96.67,0,0,0,53.22,6.83,77.19,77.19,0,0,0,49.88,0,105.15,105.15,0,0,0,19.44,8.07C3.66,31.58-1.95,54.65,1,77.53a105.41,105.41,0,0,0,32,16.29,80.7,80.7,0,0,0,6.72-11A68.32,68.32,0,0,1,28.8,77.53c.92-.68,1.82-1.39,2.69-2.13a75.09,75.09,0,0,0,71.3,0c.87.74,1.77,1.45,2.69,2.13a68.61,68.61,0,0,1-10.89,5.25,80.84,80.84,0,0,0,6.72,11,105.3,105.3,0,0,0,32-16.29C129.24,48.51,123.23,25.69,107.7,8.07ZM42.45,65.69C35.39,65.69,29.6,59.2,29.6,51.27s5.79-14.42,12.85-14.42,12.92,6.56,12.85,14.42S49.52,65.69,42.45,65.69Zm42.24,0C77.63,65.69,71.84,59.2,71.84,51.27s5.79-14.42,12.85-14.42,12.92,6.56,12.85,14.42S91.75,65.69,84.69,65.69Z"/>
                      </svg>
                      <span>Sign in with Discord</span>
                    </button>
                  </div>
                )}

                {/* Email/Password Login Form */}
                {activeTab === 'email' && (
                  <form onSubmit={handleEmailSubmit} className="space-y-4">
                    <div>
                      <label htmlFor="email" className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        id="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-slate-100 placeholder-slate-600 transition-all duration-200 focus:border-cyan-500/80 focus:ring-1 focus:ring-cyan-500/80"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="password" className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                        Password
                      </label>
                      <input
                        type="password"
                        id="password"
                        placeholder="••••••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-slate-100 placeholder-slate-600 transition-all duration-200 focus:border-cyan-500/80 focus:ring-1 focus:ring-cyan-500/80"
                        required
                      />
                    </div>

                    <Button type="submit" className="w-full mt-6 py-3.5 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-slate-950 shadow-lg shadow-cyan-500/10">
                      Sign In to Workspace
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 animate-fade-in">
          <div className="relative w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900/90 p-6 shadow-2xl backdrop-blur-xl animate-scale-up">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <svg className="h-5 w-5 fill-cyan-400" viewBox="0 0 24 24">
                <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482C19.138 20.193 22 16.437 22 12.017 22 6.484 17.522 2 12 2z" />
              </svg>
              GitHub Secure Connection
            </h3>
            <p className="mt-2 text-xs text-slate-400 leading-relaxed">
              Authenticate via GitHub OAuth. Enter your username and either your Personal Access Token (PAT) or secure passcode to finalize synchronization.
            </p>

            {modalError && (
              <div className="mt-4 rounded-xl border border-rose-500/20 bg-rose-500/5 px-4 py-3 text-xs text-rose-350 leading-relaxed">
                ⚠️ {modalError}
              </div>
            )}

            {isLoading ? (
              <div className="my-8 flex flex-col items-center justify-center gap-3">
                <div className="h-8 w-8 animate-spin rounded-full border-[3px] border-cyan-400 border-t-transparent" />
                <p className="text-xs text-slate-450 font-mono">Verifying credentials and syncing developer profile...</p>
              </div>
            ) : (
              <form onSubmit={handleGithubSubmit} className="mt-5 space-y-4">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                    GitHub Username
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. torvalds or octocat"
                    value={githubUsername}
                    onChange={(e) => setGithubUsername(e.target.value)}
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-slate-100 placeholder-slate-650 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
                    required
                    autoFocus
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                    Personal Access Token / Password
                  </label>
                  <input
                    type="password"
                    placeholder="ghp_••••••••••••••••••••"
                    value={githubToken}
                    onChange={(e) => setGithubToken(e.target.value)}
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-slate-100 placeholder-slate-650 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
                    required
                  />
                  <p className="mt-1.5 text-[10px] text-slate-500 leading-normal">
                    Requires <code>repo</code> and <code>read:user</code> scopes to securely extract commit metrics and language diversity scores.
                  </p>
                </div>

                <div className="flex gap-3 justify-end pt-2">
                  <button
                    type="button"
                    onClick={() => { setShowGithubModal(false); setGithubUsername(''); setGithubToken(''); setModalError(''); }}
                    className="rounded-xl border border-slate-800 bg-transparent px-4 py-2.5 text-xs font-semibold text-slate-300 hover:bg-slate-800"
                  >
                    Cancel
                  </button>
                  <Button
                    type="submit"
                    className="px-5 py-2.5 bg-cyan-500 text-slate-950 hover:bg-cyan-400"
                  >
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
