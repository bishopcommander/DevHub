import React, { useState, useEffect } from 'react';
import Card from '../ui/Card';
import { explainCode } from '../../api/devhubApi';
import CodeExplainer3DCanvas from './CodeExplainer3DCanvas';

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
  'Connecting to Code Explainer Microservice (:8081)...',
  'Lexing AST (Abstract Syntax Tree) into 3D Mesh...',
  'Generating 3D Topological Node Coordinates...',
  'Analyzing Call-stack execution paths...',
  'Compiling clean-code refactoring options...',
  'Rendering 3D Interactive Code Hologram...'
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
  const [selected3DNode, setSelected3DNode] = useState(null);
  const [viewMode, setViewMode] = useState('SPLIT'); // 'SPLIT', '3D_ONLY', 'ANALYTICS'

  // Rotate loading phrases
  useEffect(() => {
    let interval;
    if (loading) {
      let idx = 0;
      interval = setInterval(() => {
        idx = (idx + 1) % LOADING_PHRASES.length;
        setLoadingPhrase(LOADING_PHRASES[idx]);
      }, 900);
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
    if (e) e.preventDefault();
    if (!code.trim()) {
      setError('Please input or paste a code snippet first.');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);
    setSelected3DNode(null);

    try {
      const response = await explainCode({
        code: code.trim(),
        language,
        level
      });
      setResult(response);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to connect to Code Explainer Microservice.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 p-4 sm:p-6 max-w-7xl mx-auto">
      
      {/* Navigation Breadcrumb */}
      {setActive && (
        <nav className="flex items-center gap-2 text-xs font-semibold text-slate-500">
          <button 
            onClick={() => setActive('overview')} 
            className="hover:text-cyan-400 transition-colors flex items-center gap-1.5"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="h-3.5 w-3.5">
              <path d="M19 12H5" />
              <path d="M12 19l-7-7 7-7" />
            </svg>
            Dashboard
          </button>
          <span>/</span>
          <span className="text-slate-400">Microservice Features</span>
          <span>/</span>
          <span className="text-cyan-400 font-bold">AI Code Explainer (3D & Microservice)</span>
        </nav>
      )}
      
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-cyan-500/20 bg-slate-900/60 p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
        <div className="absolute -right-20 -top-20 h-60 w-60 rounded-full bg-cyan-500/15 blur-[100px] pointer-events-none" />
        <div className="absolute -left-20 -bottom-20 h-48 w-48 rounded-full bg-indigo-600/15 blur-[90px] pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="rounded-full bg-cyan-500/10 border border-cyan-500/40 px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-cyan-400">
                Microservice Feature #1
              </span>
              <span className="rounded-full bg-emerald-500/10 border border-emerald-500/40 px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                Port :8081 Active
              </span>
              <span className="rounded-full bg-purple-500/10 border border-purple-500/40 px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-purple-300">
                WebGL 3D Neural Engine
              </span>
            </div>
            <h1 className="text-2xl font-extrabold text-white mt-3 tracking-tight sm:text-3xl">
              3D AI Code Explainer 🌌
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-2 max-w-2xl leading-relaxed">
              Powered by our decoupled <span className="text-cyan-300 font-semibold">Code Explainer Microservice</span>. Visualizes code syntax, call stacks, and execution flows inside an interactive 3D Holographic Matrix Canvas.
            </p>
          </div>

          {/* View Mode Selector Tabs */}
          <div className="flex items-center gap-1 rounded-xl bg-slate-950/80 p-1.5 border border-slate-800 self-start md:self-auto">
            <button
              onClick={() => setViewMode('SPLIT')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                viewMode === 'SPLIT' ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              📐 Split 3D View
            </button>
            <button
              onClick={() => setViewMode('3D_ONLY')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                viewMode === '3D_ONLY' ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              🔮 Full 3D Matrix
            </button>
            <button
              onClick={() => setViewMode('ANALYTICS')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                viewMode === 'ANALYTICS' ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              📄 Text Breakdown
            </button>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        {/* Left Input Console (2 Columns) */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-5 border-slate-800 bg-slate-900/60">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">Code Editor Console</h3>
              <span className="text-[10px] text-cyan-400 font-mono">http://localhost:8081</span>
            </div>
            
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
                          ? 'bg-slate-800 text-cyan-400 shadow-sm border border-slate-700'
                          : 'text-slate-500 hover:text-slate-300'
                      }`}
                    >
                      {lvl === 'BEGINNER' ? 'Beginner 🍼' : lvl === 'INTERMEDIATE' ? 'Concept 🧠' : 'Senior 💻'}
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
                  rows={9}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 p-4 font-mono text-[11px] leading-relaxed text-cyan-300 placeholder-slate-700 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/25 focus:outline-none transition-all resize-none shadow-inner"
                  required
                />
              </div>

              {error && (
                <div className="rounded-xl border border-rose-500/20 bg-rose-500/10 p-3 text-xs font-semibold text-rose-400">
                  ⚠️ {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className={`w-full rounded-xl py-3 text-xs font-bold text-slate-950 transition-all shadow-lg flex items-center justify-center gap-2 ${
                  loading
                    ? 'bg-slate-800 text-slate-500 cursor-not-allowed shadow-none'
                    : 'bg-cyan-400 hover:bg-cyan-300 shadow-cyan-500/20 active:scale-[0.99]'
                }`}
              >
                {loading ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                    <span>Analyzing via Microservice...</span>
                  </>
                ) : (
                  <>
                    <span>Deconstruct & Render 3D AST</span>
                    <span className="text-base">🚀</span>
                  </>
                )}
              </button>
            </form>
          </Card>

          {/* Quick Presets */}
          <Card className="p-5 border-slate-800 bg-slate-900/40">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">Load Code Template</h3>
            <p className="text-[11px] text-slate-500 mb-3">Click any snippet to test instant 3D graph synthesis:</p>
            <div className="grid gap-2 grid-cols-1 sm:grid-cols-2">
              {CODE_TEMPLATES.map((tmpl) => (
                <button
                  key={tmpl.title}
                  onClick={() => handleTemplateClick(tmpl)}
                  className="rounded-xl border border-slate-800 bg-slate-950/60 hover:bg-slate-900 p-3 text-left transition-all border-l-2 hover:border-l-cyan-400"
                >
                  <p className="text-[11px] font-bold text-slate-200">{tmpl.title}</p>
                  <p className="text-[9px] text-slate-500 font-mono capitalize mt-0.5">{tmpl.language}</p>
                </button>
              ))}
            </div>
          </Card>
        </div>

        {/* Right 3D Output & Analysis Workspace (3 Columns) */}
        <div className="lg:col-span-3 space-y-6">
          
          {/* 3D Holographic Canvas Scene */}
          {(viewMode === 'SPLIT' || viewMode === '3D_ONLY') && (
            <CodeExplainer3DCanvas
              isAnalyzing={loading}
              graphNodes={result?.visual3dGraphNodes || []}
              selectedNode={selected3DNode}
              onSelectNode={(node) => setSelected3DNode(node)}
            />
          )}

          {/* Complexity Metrics Banner */}
          {result?.complexity && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3.5 rounded-xl bg-slate-900/60 border border-cyan-500/20 text-center">
                <p className="text-[10px] font-bold uppercase text-slate-400 font-mono">Time Complexity</p>
                <p className="text-sm font-extrabold text-cyan-400 mt-1">{result.complexity.timeComplexity}</p>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-900/60 border border-purple-500/20 text-center">
                <p className="text-[10px] font-bold uppercase text-slate-400 font-mono">Space Complexity</p>
                <p className="text-sm font-extrabold text-purple-400 mt-1">{result.complexity.spaceComplexity}</p>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-900/60 border border-emerald-500/20 text-center">
                <p className="text-[10px] font-bold uppercase text-slate-400 font-mono">Estimated Ops</p>
                <p className="text-sm font-extrabold text-emerald-400 mt-1">~{result.complexity.estimatedOperations}</p>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-900/60 border border-amber-500/20 text-center">
                <p className="text-[10px] font-bold uppercase text-slate-400 font-mono">Memory Model</p>
                <p className="text-[11px] font-extrabold text-amber-300 mt-1 truncate" title={result.complexity.memoryPattern}>
                  {result.complexity.memoryPattern}
                </p>
              </div>
            </div>
          )}

          {/* Detailed Analysis Output */}
          {loading ? (
            <Card className="flex flex-col items-center justify-center min-h-[300px] p-6 text-center border-slate-800">
              <div className="relative mb-4">
                <div className="h-14 w-14 animate-spin rounded-full border-2 border-cyan-400 border-t-transparent" />
                <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-cyan-400 font-mono">8081</div>
              </div>
              <p className="text-sm font-semibold text-slate-200">{loadingPhrase}</p>
              <p className="mt-1 font-mono text-[10px] text-slate-500">Streaming microservice execution payload...</p>
            </Card>
          ) : result ? (
            <div className="space-y-6">
              
              {/* Architecture Overview */}
              <Card className="p-6 relative overflow-hidden border-slate-800 bg-slate-900/50">
                <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-cyan-400">Microservice Architectural Summary</h3>
                  <span className="text-[10px] font-mono text-slate-500">HTTP 200 OK</span>
                </div>
                <p className="text-sm text-slate-200 leading-relaxed font-medium">
                  {result.explanation}
                </p>
              </Card>

              {/* Step-by-Step Breakdown */}
              {result.executionSteps && result.executionSteps.length > 0 && (
                <Card className="p-6 border-slate-800 bg-slate-900/40">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">Step-by-Step Logic Flow</h3>
                  <div className="space-y-3.5">
                    {result.executionSteps.map((step, idx) => (
                      <div key={idx} className="flex gap-3.5 items-start p-2.5 rounded-xl hover:bg-slate-800/40 transition-colors">
                        <div className="h-6 w-6 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-extrabold flex items-center justify-center flex-shrink-0">
                          {idx + 1}
                        </div>
                        <p className="text-xs text-slate-300 leading-relaxed pt-0.5">{step}</p>
                      </div>
                    ))}
                  </div>
                </Card>
              )}

              {/* Syntax Highlights */}
              {result.syntaxHighlights && result.syntaxHighlights.length > 0 && (
                <Card className="p-6 border-slate-800 bg-slate-900/40">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">Core Syntactic Highlights</h3>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {result.syntaxHighlights.map((hl, idx) => (
                      <div key={idx} className="p-3.5 rounded-xl border border-slate-800 bg-slate-950/60">
                        <div className="flex items-center justify-between gap-2">
                          <code className="text-[10px] font-bold text-cyan-300 font-mono bg-slate-900 px-2 py-0.5 rounded border border-cyan-500/20">
                            {hl.codeSnippet}
                          </code>
                          <span className="text-[8px] font-bold uppercase tracking-wider text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded">
                            {hl.type}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-400 mt-2.5 leading-relaxed">{hl.explanation}</p>
                      </div>
                    ))}
                  </div>
                </Card>
              )}

              {/* Best Practices */}
              {result.optimizationTips && result.optimizationTips.length > 0 && (
                <Card className="p-6 border-l-4 border-l-cyan-400 border-slate-800 bg-slate-900/40">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-slate-300 mb-3">Optimization & Best Practices</h3>
                  <ul className="space-y-2.5">
                    {result.optimizationTips.map((tip, idx) => (
                      <li key={idx} className="text-xs text-slate-300 flex gap-2.5 items-start leading-relaxed">
                        <span className="text-cyan-400 font-bold">⚡</span>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </Card>
              )}

              {/* Refactoring suggestions */}
              {result.refactoredCode && (
                <Card className="overflow-hidden border-slate-800 bg-slate-950">
                  <div className="border-b border-slate-800 bg-slate-900/60 px-5 py-3.5 flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-300">Recommended Microservice Refactoring</span>
                    <button
                      onClick={handleCopyCode}
                      className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 text-[10px] font-bold text-cyan-400 hover:text-cyan-300 transition-all flex items-center gap-1.5"
                    >
                      {copied ? '✓ Copied' : '📄 Copy Code'}
                    </button>
                  </div>
                  <pre className="overflow-auto bg-[#050911] p-5 font-mono text-[11px] leading-6 text-emerald-400 max-h-[300px]">
                    {result.refactoredCode}
                  </pre>
                </Card>
              )}

            </div>
          ) : (
            <Card className="flex flex-col items-center justify-center min-h-[300px] p-8 text-center bg-slate-900/20 border-dashed border-2 border-slate-800">
              <div className="text-4xl select-none animate-bounce">🌌</div>
              <h3 className="text-sm font-bold text-slate-300 mt-3">Interactive 3D Workspace Ready</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm leading-relaxed">
                Paste or choose a snippet in the input console, then hit <span className="text-cyan-400 font-semibold">Deconstruct & Render 3D AST</span> to spin up instant microservice predictions and 3D graphs.
              </p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default AIExplainer;
