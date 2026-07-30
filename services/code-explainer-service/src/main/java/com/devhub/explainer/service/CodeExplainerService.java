package com.devhub.explainer.service;

import com.devhub.explainer.dto.CodeExplainerRequest;
import com.devhub.explainer.dto.CodeExplainerResponse;
import com.devhub.explainer.dto.CodeExplainerResponse.CodeHighlight;
import com.devhub.explainer.dto.CodeExplainerResponse.ComplexityMetrics;
import com.devhub.explainer.dto.CodeExplainerResponse.Graph3DNode;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Locale;

@Service
public class CodeExplainerService {

    public CodeExplainerResponse explainCode(CodeExplainerRequest request) {
        String code = request.code();
        String language = request.language() != null ? request.language().toLowerCase(Locale.ROOT) : "javascript";
        String level = request.level() != null ? request.level().toUpperCase(Locale.ROOT) : "INTERMEDIATE";

        if (code == null || code.trim().isEmpty()) {
            return new CodeExplainerResponse(
                "No code snippet was provided. Paste your code into the editor to receive a deep-dive AI explanation.",
                List.of("Waiting for code snippet input..."),
                List.of(),
                List.of("Ensure code contains valid syntax for your selected language."),
                "// Paste code to see refactoring recommendations",
                new ComplexityMetrics("O(1)", "O(1)", 0, "Idle"),
                generateDefault3DNodes("Empty Input")
            );
        }

        String lowerCode = code.toLowerCase(Locale.ROOT);
        
        String explanation;
        List<String> steps = new ArrayList<>();
        List<CodeHighlight> highlights = new ArrayList<>();
        List<String> improvements = new ArrayList<>();
        String refactoredCode;
        ComplexityMetrics metrics;

        if (lowerCode.contains("async") || lowerCode.contains("await") || lowerCode.contains("promise") || lowerCode.contains("fetch(")) {
            // Asynchronous Pattern
            if ("BEGINNER".equals(level)) {
                explanation = "This code handles asynchronous tasks—actions that take time to complete, like downloading files or requesting data from another website. It prevents the app from freezing while it waits.";
                steps.add("The function is declared with `async`, indicating it can run in the background.");
                steps.add("It uses the `await` keyword, which tells the computer: 'Pause here, let other tasks run, and resume once the requested data arrives'.");
                steps.add("It wraps the network request in a `try-catch` safety block to catch errors without crashing.");
            } else if ("ADVANCED".equals(level)) {
                explanation = "Asynchronous task orchestration using the JavaScript Event Loop. Leverages non-blocking I/O microtasks to pause execution contexts without locking the main thread.";
                steps.add("Registers execution frames in the stack and yields control back to the event loop upon encountering an unresolved Promise.");
                steps.add("Queues microtasks inside V8 PromiseJobs queue to resolve callbacks with high execution priority.");
                steps.add("Employs structured exception propagation via rejection bubbles in the try-catch block.");
            } else {
                explanation = "Demonstrates asynchronous programming using ES6 Promises and async/await syntax. It handles long-running operations sequentially without blocking the call stack.";
                steps.add("Declares an asynchronous context using the `async` function modifier.");
                steps.add("Uses `await` to pause execution sequentially for promise settlements.");
                steps.add("Implements error handling using `try/catch` blocks to gracefully intercept network exceptions.");
            }

            highlights.add(new CodeHighlight("async", "Keyword", "Declares an asynchronous context so the function runs non-blockingly."));
            highlights.add(new CodeHighlight("await", "Keyword", "Pauses execution sequentially until the promise resolves."));
            highlights.add(new CodeHighlight("try { ... } catch", "Block Pattern", "Intercepts runtime errors or failed server requests."));

            improvements.add("Consider setting a request timeout so network requests don't hang indefinitely if the server is offline.");
            improvements.add("If fetching multiple independent assets, trigger them concurrently using `Promise.all()` to speed up load times.");
            improvements.add("Add user loading indicators in the UI so users know a fetch is actively in progress.");

            refactoredCode = "// Optimized Asynchronous fetch with standard timeout bounds:\n" +
                             "async function fetchDataWithTimeout(url, timeoutMs = 5000) {\n" +
                             "  const controller = new AbortController();\n" +
                             "  const id = setTimeout(() => controller.abort(), timeoutMs);\n" +
                             "  try {\n" +
                             "    const response = await fetch(url, { signal: controller.signal });\n" +
                             "    clearTimeout(id);\n" +
                             "    if (!response.ok) throw new Error(`HTTP status: ${response.status}`);\n" +
                             "    return await response.json();\n" +
                             "  } catch (error) {\n" +
                             "    clearTimeout(id);\n" +
                             "    console.error('Fetch failed:', error.message);\n" +
                             "    throw error;\n" +
                             "  }\n" +
                             "}";

            metrics = new ComplexityMetrics("O(1) async dispatch", "O(1) stack allocation", 3, "Event-loop Non-blocking Microtask Queue");

        } else if (lowerCode.contains("fib") || lowerCode.contains("fact") || lowerCode.contains("recur") || lowerCode.contains("solve(") || (lowerCode.contains("function") && countOccurrences(lowerCode, getFunctionName(code)) > 1)) {
            // Recursive Pattern
            String funcName = getFunctionName(code);
            if ("BEGINNER".equals(level)) {
                explanation = "This function is recursive! Recursion means a function calls itself to solve a smaller piece of the same problem.";
                steps.add("The function checks a 'base case' (exit rule) so it knows when to stop calling itself.");
                steps.add("If not at the exit rule yet, it runs logic and calls itself with a smaller input.");
                steps.add("Once it hits the base case, return values wind back up to compute the final answer.");
            } else if ("ADVANCED".equals(level)) {
                explanation = "Classical recursive algorithm. It leverages call stack frame allocations to solve self-similar subproblems. Deep recursion demands Memoization or Tail-Call Optimization (TCO).";
                steps.add("Pushes a new activation record onto the call stack with each recursive iteration.");
                steps.add("Evaluates the boundary base case to prevent StackOverflowError exceptions.");
                steps.add("Unwinds active frames sequentially, accumulating return values across the thread stack.");
            } else {
                explanation = "Implements a recursive algorithm. The function continuously invokes itself to divide the problem into smaller sub-problems until a base case exit condition is met.";
                steps.add("Defines the crucial base case condition to terminate recursion.");
                steps.add("Reduces input parameters iteratively to approach the base case boundary.");
                steps.add("Combines results of recursive calls as active call stack frames unwind.");
            }

            highlights.add(new CodeHighlight("if (n <= 1) return ...", "Base Case", "The essential exit rule that stops recursion."));
            highlights.add(new CodeHighlight(funcName + "(n - 1)", "Recursive Call", "Function invoking itself with a smaller input parameter."));

            improvements.add("Unoptimized recursion is highly inefficient (exponential O(2^n) time complexity). Use memoization cache or dynamic programming.");
            improvements.add("Consider rewrite as an iterative loop (using `while` or `for`) to utilize O(1) auxiliary memory.");

            refactoredCode = "// Optimized Memoized Recursive pattern:\n" +
                             "const memoCache = new Map();\n" +
                             "function fibonacciMemo(n) {\n" +
                             "  if (n <= 1) return n;\n" +
                             "  if (memoCache.has(n)) return memoCache.get(n);\n" +
                             "  const result = fibonacciMemo(n - 1) + fibonacciMemo(n - 2);\n" +
                             "  memoCache.set(n, result);\n" +
                             "  return result;\n" +
                             "}";

            metrics = new ComplexityMetrics("O(2^N) default / O(N) optimized", "O(N) stack frame depth", 1024, "Stack-frame allocation tree");

        } else if (lowerCode.contains("use") && (lowerCode.contains("state") || lowerCode.contains("effect") || lowerCode.contains("memo") || lowerCode.contains("callback"))) {
            // React Hooks Pattern
            if ("BEGINNER".equals(level)) {
                explanation = "This is a React component utilizing Hooks! Hooks manage reactive state and side effects when rendering components on screen.";
                steps.add("Sets up reactive memory (state) using `useState` and setter functions.");
                steps.add("Triggers side effects using `useEffect` for data fetching or timers.");
                steps.add("Whenever state updates, the component re-renders with fresh data.");
            } else if ("ADVANCED".equals(level)) {
                explanation = "State allocation and side-effect synchronization utilizing React Fiber architecture. Employs persistent hook index arrays to map state cells across rendering passes.";
                steps.add("Instantiates state buckets within Fiber node memory arrays.");
                steps.add("Schedules side-effects on the commit phase using dependency array change comparisons.");
                steps.add("Fires state updates triggering concurrent scheduler reconciliation.");
            } else {
                explanation = "Demonstrates reactive state management and lifecycle side-effects utilizing React Hooks. Binds component data values to state buckets.";
                steps.add("Initializes a reactive state cell with `useState`.");
                steps.add("Fires secondary actions with `useEffect`.");
                steps.add("Schedules component re-renders when state update functions are called.");
            }

            highlights.add(new CodeHighlight("useState", "React Hook", "Creates a reactive variable that React watches for automatic UI updates."));
            highlights.add(new CodeHighlight("useEffect", "React Hook", "Triggers actions after mounting or when dependencies change."));

            improvements.add("Always specify all state dependencies in your `useEffect` dependency array.");
            improvements.add("Ensure you return a cleanup function in `useEffect` to prevent memory leaks.");

            refactoredCode = "// Optimized React hook component:\n" +
                             "import React, { useState, useEffect } from 'react';\n" +
                             "export function TimerComponent() {\n" +
                             "  const [count, setCount] = useState(0);\n" +
                             "  useEffect(() => {\n" +
                             "    const id = setInterval(() => setCount((p) => p + 1), 1000);\n" +
                             "    return () => clearInterval(id);\n" +
                             "  }, []);\n" +
                             "  return <div className=\"text-cyan-400\">Duration: {count}s</div>;\n" +
                             "}";

            metrics = new ComplexityMetrics("O(1) state lookup / O(R) renders", "O(H) hook cell memory", 5, "Fiber Tree LinkedList Memory");

        } else {
            // General Logic
            explanation = "Sequential algorithmic logic block. Processes data inputs, performs conditional operations, and returns computed results.";
            steps.add("Initializes parameters and stack scopes.");
            steps.add("Evaluates control conditions and conditional branches.");
            steps.add("Returns calculated output values.");

            highlights.add(new CodeHighlight("return", "Keyword", "Exits execution scope, returning results."));

            improvements.add("Minimize nested blocks using early return statements (Guard Clause pattern).");
            improvements.add("Use descriptive variable names to improve codebase maintainability.");

            refactoredCode = "// Refactored Guard-clause pattern:\n" +
                             "function processData(input) {\n" +
                             "  if (!input) return null;\n" +
                             "  return { status: 'success', data: input };\n" +
                             "}";

            metrics = new ComplexityMetrics("O(N) iteration", "O(1) heap allocation", 12, "Linear Execution Trace");
        }

        List<Graph3DNode> nodes3d = generateDynamic3DNodes(lowerCode, highlights, steps);

        return new CodeExplainerResponse(
            explanation,
            steps,
            highlights,
            improvements,
            refactoredCode,
            metrics,
            nodes3d
        );
    }

    private List<Graph3DNode> generateDynamic3DNodes(String lowerCode, List<CodeHighlight> highlights, List<String> steps) {
        List<Graph3DNode> nodes = new ArrayList<>();
        
        // Root Node
        nodes.add(new Graph3DNode("root", "Entry Point", "ROOT", new double[]{0.0, 2.0, 0.0}, "#38bdf8", "Main Execution Context Entry"));
        
        // Highlights Nodes
        double angleStep = 2.0 * Math.PI / Math.max(1, highlights.size());
        for (int i = 0; i < highlights.size(); i++) {
            CodeHighlight h = highlights.get(i);
            double angle = i * angleStep;
            double x = 2.5 * Math.cos(angle);
            double z = 2.5 * Math.sin(angle);
            double y = 0.5 - (i * 0.4);
            
            nodes.add(new Graph3DNode(
                "hl_" + i,
                h.codeSnippet(),
                h.type().toUpperCase(Locale.ROOT),
                new double[]{x, y, z},
                i % 2 == 0 ? "#10b981" : "#a855f7",
                h.explanation()
            ));
        }

        // Steps Nodes
        for (int i = 0; i < steps.size(); i++) {
            double y = -1.2 - (i * 0.8);
            double x = (i % 2 == 0 ? 1.5 : -1.5);
            nodes.add(new Graph3DNode(
                "step_" + i,
                "Step " + (i + 1),
                "EXECUTION_STEP",
                new double[]{x, y, (i % 2 == 0 ? 1.0 : -1.0)},
                "#f59e0b",
                steps.get(i)
            ));
        }

        return nodes;
    }

    private List<Graph3DNode> generateDefault3DNodes(String label) {
        return List.of(
            new Graph3DNode("root", label, "IDLE", new double[]{0, 0, 0}, "#94a3b8", "Awaiting active code input...")
        );
    }

    private int countOccurrences(String source, String token) {
        if (token == null || token.isEmpty()) return 0;
        int count = 0;
        int idx = 0;
        while ((idx = source.indexOf(token, idx)) != -1) {
            count++;
            idx += token.length();
        }
        return count;
    }

    private String getFunctionName(String code) {
        try {
            int funcIdx = code.indexOf("function ");
            if (funcIdx != -1) {
                int start = funcIdx + 9;
                int end = code.indexOf("(", start);
                if (end != -1) return code.substring(start, end).trim();
            }
            int constIdx = code.indexOf("const ");
            if (constIdx != -1) {
                int start = constIdx + 6;
                int end = code.indexOf("=", start);
                if (end != -1) return code.substring(start, end).trim();
            }
        } catch (Exception ignored) {}
        return "fn";
    }
}
