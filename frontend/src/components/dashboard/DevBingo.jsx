import React, { useState, useEffect, useMemo } from 'react';
import Card from '../ui/Card';
import { useAuth } from '../../context/AuthContext';
import { useGitHubAnalyzer } from '../../hooks/useGitHubAnalyzer';

// Relatable, humorous developer habits pool (50 items)
const BINGO_TASKS = [
  { id: 't1', text: 'Fixed a bug at 3am 🌙', checkType: 'night_commit' },
  { id: 't2', text: 'Code works, no idea why 🧙‍♂️' },
  { id: 't3', text: 'Spent 2h naming a variable 🏷️' },
  { id: 't4', text: 'Cried in git merge conflict 😭' },
  { id: 't5', text: 'StackOverflow saved my job 🆘' },
  { id: 't6', text: 'Dropped project in graveyard 🪦', checkType: 'abandoned_repo' },
  { id: 't7', text: 'Wrote TODO & never came back ⏰' },
  { id: 't8', text: 'Earned a GitHub Star ⭐', checkType: 'has_stars' },
  { id: 't9', text: 'Force pushed straight to main 💥' },
  { id: 't10', text: 'Drank 4+ cups of coffee today ☕' },
  { id: 't11', text: 'Refactored working code & broke it 🔧' },
  { id: 't12', text: 'Polyglot coder (3+ languages) 💻', checkType: 'polyglot' },
  { id: 't13', text: 'Searched basic CSS syntax 🔍' },
  { id: 't14', text: 'Forked a repository 🍴', checkType: 'has_forks' },
  { id: 't15', text: 'Commented out instead of deleting 📝' },
  { id: 't16', text: 'It worked on my machine 🖥️' },
  { id: 't17', text: 'Made 20+ commits in a day 🔥', checkType: 'high_commits' },
  { id: 't18', text: 'Spent 1 hour fixing a typo 🤦' },
  { id: 't19', text: 'Console.log in production 🪵' },
  { id: 't20', text: 'Wrote 100+ lines of docs 📖' },
  { id: 't21', text: 'Closed issue without fixing 🤫' },
  { id: 't22', text: 'Created custom key shortcuts ⌨️' },
  { id: 't23', text: 'Left a PR open for 2+ weeks 📁' },
  { id: 't24', text: 'Solved a bug in the shower 🚿' },
  { id: 't25', text: 'Stared at blank screen for 30m 😶' },
  { id: 't26', text: 'Copied code from ChatGPT 🤖' },
  { id: 't27', text: 'Fixed a bug by deleting a line 🗑️' },
  { id: 't28', text: 'Bug was a missing semicolon 🫠' },
  { id: 't29', text: 'Renamed file, broke entire build 💀' },
  { id: 't30', text: 'Spent 3 hours on npm errors 📦' },
  { id: 't31', text: 'Argued light vs dark mode 🕶️' },
  { id: 't32', text: 'Wrote regex that actually works 🦄' },
  { id: 't33', text: 'Forgot commit before shutdown 😴' },
  { id: 't34', text: 'Push failed due to stale branch 🛑' },
  { id: 't35', text: 'Cringed at 6-month-old code 🤢' },
  { id: 't36', text: 'Auto-format ruined web layout 📐' },
  { id: 't37', text: 'Accidentally pushed node_modules ⚠️' },
  { id: 't38', text: 'Had a dream about coding logic 💤' },
  { id: 't39', text: 'Pushed API keys to public repo 😱' },
  { id: 't40', text: 'Zero comments for 500 lines code 🤐' },
  { id: 't41', text: 'Said "almost done" (was 10% done) 🤥' },
  { id: 't42', text: 'Voted tabs are better than spaces 🚫' },
  { id: 't43', text: 'Rubber-ducked bug to objects 🦆' },
  { id: 't44', text: 'Blamed server, was local error 🤫' },
  { id: 't45', text: 'Spent half day tweaking IDE theme 🎨' },
  { id: 't46', text: 'Shell script to automate 5s task 🤖' },
  { id: 't47', text: 'Re-installed IDE to solve lag 💻' },
  { id: 't48', text: 'Created a bug, blamed git blame 🔎' },
  { id: 't49', text: 'Felt like genius after deploy 😎' },
  { id: 't50', text: 'Blessed by compiler first try 🙌' }
];

const DevBingo = () => {
  const { user } = useAuth();
  const { data: githubData, loading: githubLoading } = useGitHubAnalyzer(user);

  // States
  const [board, setBoard] = useState([]);
  const [checkedIds, setCheckedIds] = useState(new Set(['free']));
  const [hasWon, setHasWon] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [copied, setCopied] = useState(false);

  // Custom Board Builder states
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [customInputText, setCustomInputText] = useState('');

  // Generate board layout on initial render (5x5 grid, center is FREE SPACE)
  useEffect(() => {
    const savedBoard = localStorage.getItem('devhub_bingo_board');
    const savedChecks = localStorage.getItem('devhub_bingo_checks');

    if (savedBoard) {
      setBoard(JSON.parse(savedBoard));
    } else {
      // Shuffle tasks and pick 24
      const shuffled = [...BINGO_TASKS].sort(() => Math.random() - 0.5);
      const grid = [];
      let taskIdx = 0;

      for (let i = 0; i < 25; i++) {
        if (i === 12) {
          grid.push({ id: 'free', text: '☕ FREE SPACE (COFFEE BREAK)', isFree: true });
        } else {
          grid.push(shuffled[taskIdx++]);
        }
      }
      setBoard(grid);
      localStorage.setItem('devhub_bingo_board', JSON.stringify(grid));
    }

    if (savedChecks) {
      setCheckedIds(new Set(JSON.parse(savedChecks)));
    }
  }, []);

  // Save checks to localStorage
  useEffect(() => {
    if (board.length > 0) {
      localStorage.setItem('devhub_bingo_checks', JSON.stringify(Array.from(checkedIds)));
    }
  }, [checkedIds, board]);

  // Check for Bingo Win (rows, columns, diagonals of 5 checked items)
  const checkBingoWin = (checks) => {
    // 5x5 index lists
    const lines = [
      // Rows
      [0, 1, 2, 3, 4], [5, 6, 7, 8, 9], [10, 11, 12, 13, 14], [15, 16, 17, 18, 19], [20, 21, 22, 23, 24],
      // Columns
      [0, 5, 10, 15, 20], [1, 6, 11, 16, 21], [2, 7, 12, 17, 22], [3, 8, 13, 18, 23], [4, 9, 14, 19, 24],
      // Diagonals
      [0, 6, 12, 18, 24], [4, 8, 12, 16, 20]
    ];

    for (const line of lines) {
      if (line.every(idx => board[idx] && checks.has(board[idx].id))) {
        return true;
      }
    }
    return false;
  };

  const handleTileClick = (id) => {
    if (id === 'free') return; // Cannot uncheck free space
    
    setCheckedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }

      // Trigger win overlay if line is completed
      if (checkBingoWin(next)) {
        setHasWon(true);
      } else {
        setHasWon(false);
      }

      return next;
    });
  };

  // Scan real GitHub stats via context and auto-check squares
  const handleGitHubScan = () => {
    if (!user?.githubConnected) {
      showToast('Please connect your GitHub account from the Overview page first!');
      return;
    }
    if (githubLoading || !githubData) {
      showToast('Loading GitHub profiles stats...');
      return;
    }

    let newlyCheckedCount = 0;
    setCheckedIds(prev => {
      const next = new Set(prev);

      board.forEach(tile => {
        if (!tile.checkType) return;

        let shouldCheck = false;

        // Rule integrations based on live profile metrics
        if (tile.checkType === 'abandoned_repo' && githubData.abandoned && githubData.abandoned.length > 0) {
          shouldCheck = true;
        }
        if (tile.checkType === 'night_commit' && githubData.patterns && githubData.patterns.timeLabel.includes('night')) {
          shouldCheck = true;
        }
        if (tile.checkType === 'has_stars' && githubData.totalStars > 0) {
          shouldCheck = true;
        }
        if (tile.checkType === 'polyglot' && githubData.languages && githubData.languages.length >= 3) {
          shouldCheck = true;
        }
        if (tile.checkType === 'has_forks' && githubData.totalForks > 0) {
          shouldCheck = true;
        }
        if (tile.checkType === 'high_commits' && githubData.totalCommitsAnalyzed > 20) {
          shouldCheck = true;
        }

        if (shouldCheck && !next.has(tile.id)) {
          next.add(tile.id);
          newlyCheckedCount++;
        }
      });

      if (checkBingoWin(next)) {
        setHasWon(true);
      }

      return next;
    });

    if (newlyCheckedCount > 0) {
      showToast(`✨ GitHub Scan complete! Auto-checked ${newlyCheckedCount} developer habit squares!`);
    } else {
      showToast('✨ GitHub Scan complete! No new matching habit squares found.');
    }
  };

  const handleResetBoard = () => {
    if (window.confirm('Shuffle and generate a completely new random Bingo board?')) {
      const shuffled = [...BINGO_TASKS].sort(() => Math.random() - 0.5);
      const grid = [];
      let taskIdx = 0;

      for (let i = 0; i < 25; i++) {
        if (i === 12) {
          grid.push({ id: 'free', text: '☕ FREE SPACE (COFFEE BREAK)', isFree: true });
        } else {
          grid.push(shuffled[taskIdx++]);
        }
      }
      setBoard(grid);
      setCheckedIds(new Set(['free']));
      setHasWon(false);
      localStorage.setItem('devhub_bingo_board', JSON.stringify(grid));
      localStorage.setItem('devhub_bingo_checks', JSON.stringify(['free']));
      showToast('🆕 Board shuffled and reset!');
    }
  };

  // Pre-fill modal with the current active non-free grid texts
  const handleOpenCustomModal = () => {
    const nonFreeTasks = board.filter(t => !t.isFree).map(t => t.text);
    setCustomInputText(nonFreeTasks.join('\n'));
    setShowCustomModal(true);
  };

  // Construct custom board and resolve dependencies
  const handleApplyCustomBoard = (e) => {
    e.preventDefault();
    const lines = customInputText.split('\n').map(l => l.trim()).filter(l => l.length > 0);

    let finalTasks = [...lines];

    // If entered less than 24, fill in the rest randomly from the pool
    if (finalTasks.length < 24) {
      const remainingCount = 24 - finalTasks.length;
      const unusedPool = BINGO_TASKS.filter(
        poolTask => !finalTasks.some(ft => ft.toLowerCase() === poolTask.text.toLowerCase())
      );
      const shuffledUnused = [...unusedPool].sort(() => Math.random() - 0.5);
      
      for (let i = 0; i < remainingCount; i++) {
        if (shuffledUnused[i]) {
          finalTasks.push(shuffledUnused[i].text);
        } else {
          finalTasks.push(`Habit Slot ${finalTasks.length + 1} 🚀`);
        }
      }
    } else if (finalTasks.length > 24) {
      finalTasks = finalTasks.slice(0, 24);
    }

    // Construct new grid
    const grid = [];
    let taskIdx = 0;
    for (let i = 0; i < 25; i++) {
      if (i === 12) {
        grid.push({ id: 'free', text: '☕ FREE SPACE (COFFEE BREAK)', isFree: true });
      } else {
        const text = finalTasks[taskIdx++];
        const matchedOriginal = BINGO_TASKS.find(o => o.text.toLowerCase() === text.toLowerCase());
        grid.push({
          id: matchedOriginal ? matchedOriginal.id : `custom-${taskIdx}-${Date.now()}`,
          text,
          checkType: matchedOriginal ? matchedOriginal.checkType : undefined
        });
      }
    }

    setBoard(grid);
    setCheckedIds(new Set(['free']));
    setHasWon(false);
    setShowCustomModal(false);

    localStorage.setItem('devhub_bingo_board', JSON.stringify(grid));
    localStorage.setItem('devhub_bingo_checks', JSON.stringify(['free']));
    showToast('🎨 Custom board applied and generated!');
  };

  // Viral Wordle-Style share generator
  const handleShare = () => {
    let gridString = '';
    for (let i = 0; i < 25; i++) {
      if (i > 0 && i % 5 === 0) gridString += '\n';
      
      if (i === 12) {
        gridString += '☕'; // Center coffee break free space
      } else {
        gridString += checkedIds.has(board[i]?.id) ? '🟩' : '⬛';
      }
    }

    const shareText = `🏆 DevHub Developer Bingo 🏆\n\n${gridString}\n\nCan you beat my developer habits? Generate yours at DevHub! 🚀`;
    navigator.clipboard.writeText(shareText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    showToast('📋 Copied board stats to clipboard! Paste it on Twitter/Discord!');
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 4000);
  };

  return (
    <div className="space-y-6 p-4 sm:p-6 relative">
      
      {/* Toast Alert pop-up */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 rounded-xl border border-cyan-500/35 bg-slate-900 px-5 py-3 text-xs text-cyan-300 font-semibold shadow-2xl backdrop-blur-md animate-fade-in">
          {toastMessage}
        </div>
      )}

      {/* ─── Header ──────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row items-stretch justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-wide">Developer habits Bingo</h2>
          <p className="text-xs text-slate-400 mt-1 leading-relaxed">
            Turn your daily code cycles into a shareable game. Click tiles to mark them manually, or auto-scan your GitHub profile metrics.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={handleGitHubScan}
            className="flex items-center gap-1.5 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-cyan-500/30 px-4 py-2.5 text-xs font-bold text-cyan-400 transition-colors uppercase tracking-wider"
          >
            <span>🔄 Scan GitHub Activity</span>
          </button>

          <button
            onClick={handleOpenCustomModal}
            className="rounded-xl border border-slate-800 bg-slate-900/60 hover:bg-slate-900 hover:border-cyan-500/30 px-3.5 py-2.5 text-[10px] font-bold text-cyan-400 hover:text-cyan-300 transition-colors uppercase tracking-wider"
          >
            ✍️ Edit Board
          </button>
          
          <button
            onClick={handleResetBoard}
            className="rounded-xl border border-slate-800 bg-slate-900/40 hover:bg-slate-900 hover:border-rose-500/20 px-3.5 py-2.5 text-[10px] font-bold text-slate-400 hover:text-slate-200 transition-colors uppercase tracking-wider"
          >
            Shuffle Board
          </button>
        </div>
      </div>

      {/* ─── Bingo Win Celebration banner ─────────────────────────── */}
      {hasWon && (
        <div className="relative overflow-hidden rounded-3xl border border-emerald-500/30 bg-emerald-950/10 p-6 shadow-xl shadow-emerald-500/5 animate-fade-in flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="absolute -left-10 -top-10 h-40 w-40 rounded-full bg-emerald-500/5 blur-[75px] pointer-events-none" />
          
          <div className="flex items-center gap-3">
            <span className="text-4xl animate-bounce select-none">🏆</span>
            <div>
              <h3 className="text-base font-bold text-white tracking-wide">BINGO! Certified Code Warrior</h3>
              <p className="text-xs text-slate-400 mt-0.5">You have completed 5 habit tiles in a row! Share your board to show off.</p>
            </div>
          </div>

          <button
            onClick={handleShare}
            className="rounded-xl bg-emerald-500 hover:bg-emerald-400 px-5 py-3 text-xs font-black text-slate-950 transition-colors uppercase tracking-wider flex-shrink-0 flex items-center gap-1.5 shadow-lg shadow-emerald-500/10"
          >
            <span>🔗 Copy Share Layout</span>
            {copied && <span className="text-[10px]">(Copied!)</span>}
          </button>
        </div>
      )}

      {/* ─── Bingo Grid Board ────────────────────────────────────── */}
      <div className="grid grid-cols-5 gap-2 sm:gap-3 max-w-3xl mx-auto py-2">
        {board.map((tile, idx) => {
          const isChecked = checkedIds.has(tile.id);
          return (
            <button
              key={`${tile.id}-${idx}`}
              onClick={() => handleTileClick(tile.id)}
              disabled={tile.isFree}
              className={`aspect-square rounded-xl p-2 flex flex-col justify-between text-left transition-all duration-350 border ${
                tile.isFree
                  ? 'border-amber-500/30 bg-amber-500/10 text-amber-300 font-bold'
                  : isChecked
                    ? 'border-cyan-400 bg-cyan-500/15 text-cyan-100 shadow-lg shadow-cyan-400/5'
                    : 'border-slate-800 bg-slate-900/60 text-slate-350 hover:bg-slate-900 hover:border-slate-700'
              } ${tile.isFree ? 'cursor-default' : 'active:scale-95'}`}
            >
              {/* Tile coordinate label */}
              <span className={`text-[8px] font-mono select-none ${isChecked ? 'text-cyan-400' : 'text-slate-600'}`}>
                {String.fromCharCode(65 + Math.floor(idx / 5))}{(idx % 5) + 1}
              </span>
              
              {/* Habit description text */}
              <span className={`text-[9px] sm:text-[10px] md:text-xs leading-snug font-mono break-words flex-1 flex items-center ${tile.isFree ? 'text-center font-bold flex-col justify-center' : ''}`}>
                {tile.text}
              </span>

              {/* Check indicator circle */}
              <div className="flex justify-end mt-0.5">
                <div className={`h-2.5 w-2.5 rounded-full border transition-all ${
                  tile.isFree 
                    ? 'bg-amber-400 border-amber-300' 
                    : isChecked 
                      ? 'bg-cyan-400 border-cyan-300 scale-110 shadow-md shadow-cyan-400/50' 
                      : 'border-slate-700 bg-slate-950'
                }`} />
              </div>
            </button>
          );
        })}
      </div>

      {/* ─── Share Panel Exporter ─────────────────────────────────── */}
      <div className="flex justify-center pt-2">
        <button
          onClick={handleShare}
          className="flex items-center gap-2 rounded-xl bg-slate-950 hover:bg-slate-900 border border-slate-800 hover:border-cyan-500/35 px-6 py-3 text-xs font-bold text-slate-200 hover:text-cyan-300 transition-all"
        >
          <span>Share Wordle-Style Emoji Board 📤</span>
        </button>
      </div>

      {/* ─── Custom Board Editor Modal ────────────────────────────── */}
      {showCustomModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-md p-4 animate-fade-in">
          <div className="relative w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900/95 p-6 shadow-2xl backdrop-blur-xl">
            <h3 className="flex items-center gap-2 text-lg font-bold text-white mb-2">
              ✍️ Customize Bingo Table Tiles
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              Enter your own custom habits (one per line). You need 24 items. Any blank slots will be automatically filled with funny developer habits!
            </p>

            <form onSubmit={handleApplyCustomBoard} className="space-y-4">
              <div>
                <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2">
                  <span>Custom Habit Tiles</span>
                  <span className={`${customInputText.split('\n').map(l=>l.trim()).filter(Boolean).length === 24 ? 'text-cyan-400 font-bold' : 'text-slate-400'}`}>
                    {customInputText.split('\n').map(l=>l.trim()).filter(Boolean).length} / 24 Entered
                  </span>
                </div>
                <textarea
                  value={customInputText}
                  onChange={(e) => setCustomInputText(e.target.value)}
                  rows={10}
                  placeholder="Fixed a bug at 3am 🌙&#10;Argued about tabs vs spaces 🚫&#10;My custom code achievement..."
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 font-mono text-xs text-slate-100 placeholder-slate-600 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-colors resize-none"
                  required
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCustomModal(false)}
                  className="rounded-xl border border-slate-800 px-4 py-2.5 text-xs font-semibold text-slate-355 hover:bg-slate-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-cyan-400 hover:bg-cyan-300 px-5 py-2.5 text-xs font-bold text-slate-950 transition-colors shadow-lg shadow-cyan-500/10"
                >
                  Apply Custom Board
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default DevBingo;
