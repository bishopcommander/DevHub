import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Load user session on startup
  useEffect(() => {
    const storedUser = localStorage.getItem('devhub_session');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error('Failed to parse session', e);
      }
    }
    setLoading(false);
  }, []);

  const loginWithEmail = async (email, password) => {
    setLoading(true);
    // Simulate API request delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Simple mock user creation
    const name = email.split('@')[0];
    const newUser = {
      id: crypto.randomUUID ? crypto.randomUUID() : 'email-user-id',
      email,
      name: name.charAt(0).toUpperCase() + name.slice(1),
      provider: 'email',
      avatarUrl: `https://api.dicebear.com/7.x/bottts/svg?seed=${name}`,
      githubConnected: false,
      githubUsername: null,
      githubAvatarUrl: null,
      createdAt: new Date().toISOString(),
    };

    setUser(newUser);
    localStorage.setItem('devhub_session', JSON.stringify(newUser));
    setLoading(false);
    return newUser;
  };

  const loginWithOAuth = async (provider, customGitHubUser = null, gitHubToken = null) => {
    setLoading(true);
    setError('');

    let newUser;
    if (provider === 'github') {
      const username = customGitHubUser || 'octocat';
      const token = gitHubToken || '';
      
      try {
        const headers = {};
        if (token && token.trim().length > 0 && !token.includes('simulated')) {
          headers['Authorization'] = `token ${token}`;
        }
        
        const response = await fetch(`https://api.github.com/users/${username}`, { headers });
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error(`GitHub account "${username}" does not exist. Please check the spelling.`);
          } else if (response.status === 401) {
            throw new Error('Invalid token (401 Unauthorized). Note: GitHub account passwords are not supported; please generate and use a Personal Access Token (PAT) instead.');
          } else {
            throw new Error('Failed to reach GitHub API. Please check your connection or rate limit.');
          }
        }
        
        const githubData = await response.json();
        
        newUser = {
          id: crypto.randomUUID ? crypto.randomUUID() : 'github-user-id',
          email: githubData.email || `${githubData.login}@github.com`,
          name: githubData.name || githubData.login,
          provider: 'github',
          avatarUrl: githubData.avatar_url,
          githubConnected: true,
          githubUsername: githubData.login,
          githubAvatarUrl: githubData.avatar_url,
          githubToken: token || 'ghp_simulatedOAuthHandshakeToken12345',
          createdAt: new Date().toISOString(),
        };
      } catch (err) {
        setLoading(false);
        throw err;
      }
    } else {
      // Google or Discord
      const name = provider === 'google' ? 'Alex Rivera' : 'Wumpus Coder';
      const email = provider === 'google' ? 'alex.rivera@gmail.com' : 'wumpus@discord.com';
      newUser = {
        id: crypto.randomUUID ? crypto.randomUUID() : `${provider}-user-id`,
        email,
        name,
        provider,
        avatarUrl: provider === 'google' 
          ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&h=100&q=80'
          : 'https://cdn.discordapp.com/embed/avatars/0.png',
        githubConnected: false,
        githubUsername: null,
        githubAvatarUrl: null,
        githubToken: null,
        createdAt: new Date().toISOString(),
      };
    }

    setUser(newUser);
    localStorage.setItem('devhub_session', JSON.stringify(newUser));
    setLoading(false);
    return newUser;
  };

  const connectGitHub = async (githubUsername, githubToken) => {
    if (!user) return;
    setLoading(true);
    
    const username = githubUsername.trim();
    const token = githubToken ? githubToken.trim() : '';

    try {
      const headers = {};
      if (token && token.trim().length > 0 && !token.includes('simulated')) {
        headers['Authorization'] = `token ${token}`;
      }
      
      const response = await fetch(`https://api.github.com/users/${username}`, { headers });
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error(`GitHub account "${username}" does not exist. Please check the spelling.`);
        } else if (response.status === 401) {
          throw new Error('Invalid token (401 Unauthorized). Note: GitHub account passwords are not supported; please generate and use a Personal Access Token (PAT) instead.');
        } else {
          throw new Error('Failed to reach GitHub API. Please check your connection or rate limit.');
        }
      }
      
      const githubData = await response.json();

      const updatedUser = {
        ...user,
        name: githubData.name || user.name, // optionally upgrade user's display name to their real github name
        avatarUrl: githubData.avatar_url || user.avatarUrl, // upgrade avatar to actual github profile avatar
        githubConnected: true,
        githubUsername: githubData.login,
        githubAvatarUrl: githubData.avatar_url,
        githubToken: token || 'ghp_simulatedConnectedToken98765',
      };

      setUser(updatedUser);
      localStorage.setItem('devhub_session', JSON.stringify(updatedUser));
    } catch (err) {
      setLoading(false);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const disconnectGitHub = async () => {
    if (!user) return;
    const updatedUser = {
      ...user,
      githubConnected: false,
      githubUsername: null,
      githubAvatarUrl: null,
    };

    setUser(updatedUser);
    localStorage.setItem('devhub_session', JSON.stringify(updatedUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('devhub_session');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        setError,
        loginWithEmail,
        loginWithOAuth,
        connectGitHub,
        disconnectGitHub,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
