import React, { useState, useEffect } from 'react';
import Card from '../ui/Card';
import { explainCode } from '../../api/devhubApi';

const CODE_TEMPLATES = [
  {
    title: 'Async Fetch API 🌐',
    language: 'javascript',
    code: `async function getUserData(userId) {
  try {
    const response = await fetch(\`https://api.devhub.com/users/\${userId}\`);
    if (!response.ok) {
      throw new Error('Failed to retrieve user context');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching user:', error.message);
    return null;
  }
}`
  },
  {
    title: 'Recursive Fibonacci 🌀',
    language: 'javascript',
    code: `function fibonacci(n) {
  // Exit condition (Base case)
  if (n <= 1) {
    return n;
  }
  // Recursive self-invocation
  return fibonacci(n - 1) + fibonacci(n - 2);
}`
  },
  {
    title: 'Python Decorator 🐍',
    language: 'python',
    code: `import time

def log_execution_time(func):
    def wrapper(*args, **kwargs):
        start_time = time.time()
        result = func(*args, **kwargs)
        end_time = time.time()
        print(f"[{func.__name__}] Executed in {end_time - start_time:.4f}s")
        return result
    return wrapper

@log_execution_time
def crunch_numbers(limit):
    return sum(x * x for x in range(limit))`
  },
  {
    title: 'Go Goroutines & Channels 🐹',
    language: 'go',
    code: `package main
import "fmt"

func processJob(id int, ch chan string) {
    // Process work and pass to channel
    result := fmt.Sprintf("Job #%d complete", id)
    ch <- result
}

func main() {
    ch := make(chan string)
    
    // Spin up concurrent background workers
    for i := 1; i <= 3; i++ {
        go processJob(i, ch)
    }
    
    // Read from the synchronized channel
    for i := 1; i <= 3; i++ {
        fmt.Println(<-ch)
    }
}`
  }
];

const LOADING_PHRASES = [
  'Lexing AST (Abstract Syntax Tree)...',
  'Interpreting control execution paths...',
  'Extracting logical key highlights...',
  'Querying senior developer recommendations...',
  'Compiling refactoring options...',
  'Formatting structured summaries...'
];

const AIExplainer = ({ setActive }) => {
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [level, setLevel] = useState('INTERMEDIATE');
  const [loading, setLoading] = useState(false);
  const [loadingPhrase, setLoadingPhrase] = useState(LOADING_PHRASES[0]);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);
  const [copied, setCopied] = useState(false);

  // Rotate loading phrases
  useEffect(() => {
    let interval;
    if (loading) {
      let idx = 0;
      interval = setInterval(() => {
        idx = (idx + 1) % LOADING_PHRASES.length;
        setLoadingPhrase(LOADING_PHRASES[idx]);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [loading]);

  const handleTemplateClick = (template) => {
    setCode(template.code.trim());
    setLanguage(template.language);
    setError('');
  };

  const handleCopyCode = () => {
    if (!result?.refactoredCode) return;
    navigator.clipboard.writeText(result.refactoredCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExplain = async (e) => {
    e.preventDefault();
    if (!code.trim()) {
      setError('Please input or paste a code snippet first.');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await explainCode({
        code: code.trim(),
        language,
        level
      });
      setResult(response);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to analyze code. Please verify if the backend is online.');
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
          <span className="text-slate-400">AI Explainer</span>
        </nav>
      )}
      
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/40 p-6 sm:p-8 shadow-2xl">
        <div className="absolute -right-20 -top-20 h-60 w-60 rounded-full bg-cyan-500/10 blur-[100px] pointer-events-none" />
        <div className="absolute -left-20 -bottom-20 h-48 w-48 rounded-full bg-indigo-600/5 blur-[90px] pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-cyan-500/10 border border-cyan-500/30 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-cyan-400">
                Cognitive Studio
              </span>
            </div>
            <h1 className="text-2xl font-extrabold text-white mt-2 tracking-tight sm:text-3xl">
              AI Code Explainer 🧠
            </h1>
            <p className="text-sm text-slate-400 mt-2 max-w-2xl leading-relaxed">
              Paste code snippets and unpack their inner workings. Choose multiple explanation depth levels, view annotated core elements, and obtain optimized code refactoring suggestions.
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        {/* Left Input Console (2 Columns) */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-5">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 mb-4">Input Console</h3>
            
            <form onSubmit={handleExplain} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Select Language
                </label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-xs text-slate-300 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/25 focus:outline-none transition-all cursor-pointer"
                >
                  <option value="javascript">JavaScript / TypeScript</option>
                  <option value="python">Python</option>
                  <option value="go">Go</option>
                  <option value="java">Java</option>
                  <option value="cpp">C++</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Explanation Depth
                </label>
                <div className="grid grid-cols-3 gap-1 rounded-xl bg-slate-950 p-1 border border-slate-800/80">
                  {['BEGINNER', 'INTERMEDIATE', 'ADVANCED'].map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setLevel(lvl)}
                      className={`rounded-lg py-2 text-[10px] font-bold uppercase tracking-wider transition-all ${
                        level === lvl
                          ? 'bg-slate-850 text-cyan-400 shadow-sm border border-slate-800'
                          : 'text-slate-500 hover:text-slate-300'
                      }`}
                    >
                      {lvl === 'BEGINNER' ? 'Beginner 🍼' : lvl === 'INTERMEDIATE' ? 'Concept 🧠' : 'Senior Dev 💻'}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Paste Code Snippet
                </label>
                <textarea
                  value={code}
                  onChange={(e) => { setCode(e.target.value); setError(''); }}
                  placeholder="Paste your function or block of logic here..."
                  rows={10}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 p-4 font-mono text-[11px] leading-relaxed text-cyan-300 placeholder-slate-700 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/25 focus:outline-none transition-all resize-none"
                  required
                />
              </div>

              {error && (
                <div className="rounded-xl border border-rose-500/20 bg-rose-500/5 p-3 text-xs font-semibold text-rose-400">
                  ⚠️ {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className={`w-full rounded-xl py-3 text-xs font-bold text-slate-950 transition-all shadow-lg ${
                  loading
                    ? 'bg-slate-800 text-slate-500 cursor-not-allowed shadow-none'
                    : 'bg-cyan-400 hover:bg-cyan-350 shadow-cyan-500/10'
                }`}
              >
                {loading ? 'Analyzing Source Snippet...' : 'Deconstruct & Explain →'}
              </button>
            </form>
          </Card>

          {/* Quick Presets */}
          <Card className="p-5">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 mb-3">Load Snippet Template</h3>
            <p className="text-[11px] text-slate-500 mb-4 leading-normal">
              Quickly test with complex logic presets to evaluate structured breakdown depth:
            </p>
            <div className="grid gap-2 grid-cols-1 sm:grid-cols-2">
              {CODE_TEMPLATES.map((tmpl) => (
                <button
                  key={tmpl.title}
                  onClick={() => handleTemplateClick(tmpl)}
                  className="rounded-xl border border-slate-800 bg-slate-900/30 hover:bg-slate-900/60 p-3 text-left transition-all border-l-2 hover:border-l-cyan-400"
                >
                  <p className="text-[11px] font-bold text-slate-200">{tmpl.title}</p>
                  <p className="text-[9px] text-slate-500 font-mono capitalize mt-0.5">{tmpl.language}</p>
                </button>
              ))}
            </div>
          </Card>
        </div>

        {/* Right Output Dashboard (3 Columns) */}
        <div className="lg:col-span-3">
          {loading ? (
            <Card className="h-full flex flex-col items-center justify-center min-h-[450px] p-6 text-center">
              <div className="relative">
                <div className="h-16 w-16 animate-spin rounded-full border-2 border-cyan-400 border-t-transparent" />
                <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-cyan-400">AI</div>
              </div>
              <p className="mt-6 text-sm font-semibold text-slate-200">{loadingPhrase}</p>
              <p className="mt-1 font-mono text-[10px] text-slate-500">Formulating optimal cognitive breakdown...</p>
            </Card>
          ) : result ? (
            <div className="space-y-6">
              
              {/* Summary card */}
              <Card className="p-6 relative overflow-hidden">
                <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-cyan-500/5 blur-3xl pointer-events-none" />
                <h3 className="text-xs font-bold uppercase tracking-widest text-cyan-400">Code Architecture Overview</h3>
                <p className="mt-3 text-sm text-slate-200 leading-relaxed font-medium">
                  {result.explanation}
                </p>
              </Card>

              {/* Step-by-Step Breakdown */}
              <Card className="p-6">
                <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">Step-by-Step Logic Flow</h3>
                <div className="space-y-4">
                  {result.steps.map((step, idx) => (
                    <div key={idx} className="flex gap-4 items-start">
                      <div className="h-6 w-6 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-extrabold flex items-center justify-center flex-shrink-0">
                        {idx + 1}
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed pt-0.5">{step}</p>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Highlight card */}
              {result.highlights && result.highlights.length > 0 && (
                <Card className="p-6">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">Core Code Identifiers</h3>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {result.highlights.map((hl, idx) => (
                      <div key={idx} className="p-3.5 rounded-xl border border-slate-800 bg-slate-950/30">
                        <div className="flex items-center justify-between">
                          <code className="text-[10px] font-bold text-cyan-300 font-mono bg-slate-900 px-1.5 py-0.5 rounded">
                            {hl.codePart}
                          </code>
                          <span className="text-[8px] font-bold uppercase tracking-wider text-slate-500">
                            {hl.category}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-400 mt-2 leading-relaxed">{hl.explanation}</p>
                      </div>
                    ))}
                  </div>
                </Card>
              )}

              {/* Best Practices */}
              {result.improvements && result.improvements.length > 0 && (
                <Card className="p-6 border-l-4 border-l-cyan-400/50">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">Best Practices & Improvements</h3>
                  <ul className="space-y-2.5">
                    {result.improvements.map((imp, idx) => (
                      <li key={idx} className="text-xs text-slate-350 flex gap-2 items-start leading-relaxed">
                        <span className="text-cyan-400">✨</span>
                        <span>{imp}</span>
                      </li>
                    ))}
                  </ul>
                </Card>
              )}

              {/* Refactoring suggestions */}
              {result.refactoredCode && (
                <Card className="overflow-hidden">
                  <div className="border-b border-slate-800 bg-slate-900/30 px-5 py-3.5 flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-300">Recommended Clean-Code Refactoring</span>
                    <button
                      onClick={handleCopyCode}
                      className="rounded-lg border border-slate-800 hover:border-slate-700 bg-slate-950 px-3 py-1.5 text-[10px] font-bold text-cyan-400 hover:text-cyan-300 transition-all flex items-center gap-1.5"
                    >
                      {copied ? '✓ Copied' : '📄 Copy Snippet'}
                    </button>
                  </div>
                  <pre className="overflow-auto bg-[#080d16] p-5 font-mono text-[10px] leading-6 text-emerald-400 max-h-[300px]">
                    {result.refactoredCode}
                  </pre>
                </Card>
              )}

            </div>
          ) : (
            <Card className="h-full flex flex-col items-center justify-center min-h-[450px] p-8 text-center bg-slate-900/10 border-dashed border-2 border-slate-800/80">
              <div className="text-4xl select-none animate-bounce">⚡</div>
              <h3 className="text-base font-bold text-slate-300 mt-4">Awaiting Analysis</h3>
              <p className="text-xs text-slate-500 mt-2 max-w-sm leading-relaxed">
                Paste or choose a snippet in the input console, then select deconstruct to stream comprehensive AI interpretations.
              </p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default AIExplainer;
