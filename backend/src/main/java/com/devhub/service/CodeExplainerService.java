package com.devhub.service;

import com.devhub.dto.CodeExplainerRequest;
import com.devhub.dto.CodeExplainerResponse;
import com.devhub.dto.CodeExplainerResponse.CodeHighlight;
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
                "// Paste code to see refactoring recommendations"
            );
        }

        String lowerCode = code.toLowerCase(Locale.ROOT);
        
        // 1. Core Explanation & Steps Selection based on Pattern Detection
        String explanation;
        List<String> steps = new ArrayList<>();
        List<CodeHighlight> highlights = new ArrayList<>();
        List<String> improvements = new ArrayList<>();
        String refactoredCode;

        if (lowerCode.contains("async") || lowerCode.contains("await") || lowerCode.contains("promise") || lowerCode.contains("fetch(")) {
            // Asynchronous Execution Pattern
            if ("BEGINNER".equals(level)) {
                explanation = "This code handles asynchronous tasks—actions that take time to complete, like downloading files or requesting data from another website. It prevents the app from freezing while it waits.";
                steps.add("The function is declared with `async`, indicating it can run in the background.");
                steps.add("It uses the `await` keyword, which tells the computer: 'Pause here, let other tasks run, and resume once the requested data arrives'.");
                steps.add("It wraps the network request in a `try-catch` safety block to catch errors (like a bad internet connection) without crashing the app.");
            } else if ("ADVANCED".equals(level)) {
                explanation = "Asynchronous task orchestration using the JavaScript Event Loop. Leverages non-blocking I/O microtasks to pause execution contexts without locking the main thread, yielding highly concurrent, performant operations.";
                steps.add("Registers execution frames in the stack and yields control back to the event loop upon encountering an unresolved Promise.");
                steps.add("Queue microtasks inside the PromiseJobs queue (V8) to resolve callbacks with high execution priority over macro tasks (like setTimeout).");
                steps.add("Employs structured exception propagation via rejection bubbles in the try-catch block to handle network timeouts and failures securely.");
            } else { // INTERMEDIATE default
                explanation = "Demonstrates asynchronous programming using ES6 Promises and async/await syntax. It handles long-running operations sequentially without blocking the call stack or nesting callbacks (avoiding callback hell).";
                steps.add("Declares an asynchronous context using the `async` function modifier.");
                steps.add("Uses `await` to pause execution sequentially for promise settlements (fulfillment or rejection).");
                steps.add("Implements error handling using `try/catch` blocks to gracefully intercept network exceptions.");
            }

            highlights.add(new CodeHighlight("async", "Keyword", "Declares an asynchronous context so the function can run non-blockingly."));
            highlights.add(new CodeHighlight("await", "Keyword", "Pauses code execution sequentially until the promise resolves."));
            highlights.add(new CodeHighlight("try { ... } catch", "Block Pattern", "Intercepts runtime errors or failed server requests gracefully."));

            improvements.add("Consider setting a request timeout so network requests don't hang indefinitely if the server is offline.");
            improvements.add("If fetching multiple independent assets, trigger them concurrently using `Promise.all()` to speed up load times.");
            improvements.add("Add user loading indicators in the UI so users know a fetch is actively in progress.");

            refactoredCode = "// Optimized Asynchronous fetch with standard timeout bounds:\n" +
                             "async function fetchDataWithTimeout(url, timeoutMs = 5000) {\n" +
                             "  const controller = new AbortController();\n" +
                             "  const id = setTimeout(() => controller.abort(), timeoutMs);\n" +
                             "\n" +
                             "  try {\n" +
                             "    const response = await fetch(url, {\n" +
                             "      signal: controller.signal\n" +
                             "    });\n" +
                             "    clearTimeout(id);\n" +
                             "    if (!response.ok) throw new Error(`HTTP status: ${response.status}`);\n" +
                             "    return await response.json();\n" +
                             "  } catch (error) {\n" +
                             "    clearTimeout(id);\n" +
                             "    console.error('Fetch failed:', error.message);\n" +
                             "    throw error;\n" +
                             "  }\n" +
                             "}";

        } else if (lowerCode.contains("fib") || lowerCode.contains("fact") || lowerCode.contains("recur") || lowerCode.contains("solve(") || (lowerCode.contains("function") && countOccurrences(lowerCode, getFunctionName(code)) > 1)) {
            // Recursive Algorithm Pattern
            String funcName = getFunctionName(code);
            if ("BEGINNER".equals(level)) {
                explanation = "This function is recursive! Recursion means a function calls itself to solve a smaller piece of the same problem. Think of it like Russian nesting dolls: you open a big doll to find a slightly smaller doll inside, until you hit the smallest doll (the base case).";
                steps.add("The function starts by checking a 'base case' (the exit rule) so it knows when to stop calling itself.");
                steps.add("If it isn't at the exit rule yet, it runs some logic and calls itself with a slightly smaller value.");
                steps.add("Once it hits the base case, all the nesting dolls close back up, returning the final computed answer.");
            } else if ("ADVANCED".equals(level)) {
                explanation = "Classical recursive algorithm. It leverages call stack frame allocations to solve self-similar subproblems. Unoptimized recursion will cause stack overflows on deep bounds, demanding Memoization or Tail-Call Optimization (TCO).";
                steps.add("Pushes a new activation record (stack frame) containing local variables and registers onto the call stack with each recursive iteration.");
                steps.add("Evaluates the boundary base case to prevent infinite regression and inevitable StackOverflowError exceptions.");
                steps.add("Unwinds active frames sequentially, accumulating return values across the thread stack.");
            } else { // INTERMEDIATE
                explanation = "Implements a recursive algorithm. The function continuously invokes itself to divide the problem into smaller sub-problems, storing intermediate variables on the call stack until a base case exit condition is met.";
                steps.add("Defines the crucial base case condition to terminate recursion and prevent infinite loops.");
                steps.add("Reduces input parameters iteratively to approach the base case boundary.");
                steps.add("Combines results of recursive calls as the active call stack frames unwind.");
            }

            highlights.add(new CodeHighlight("if (n <= 1) return ...", "Base Case", "The essential exit rule that stops recursion and prevents crashing the browser."));
            highlights.add(new CodeHighlight(funcName + "(n - 1)", "Recursive Call", "The function invoking itself with a smaller input parameter to break down the task."));

            improvements.add("Unoptimized recursion is highly inefficient (exponential O(2^n) time complexity). Use a memoization cache or dynamic programming instead.");
            improvements.add("Consider rewrite as an iterative loop (using standard `while` or `for`) to utilize O(1) auxiliary memory and avoid stack limits.");

            refactoredCode = "// Optimized Memoized Recursive pattern (reduces time complexity from O(2^n) to O(n)):\n" +
                             "const memoCache = new Map();\n" +
                             "function fibonacciMemo(n) {\n" +
                             "  if (n <= 1) return n;\n" +
                             "  if (memoCache.has(n)) return memoCache.get(n);\n" +
                             "\n" +
                             "  const result = fibonacciMemo(n - 1) + fibonacciMemo(n - 2);\n" +
                             "  memoCache.set(n, result);\n" +
                             "  return result;\n" +
                             "}";

        } else if (lowerCode.contains("use") && (lowerCode.contains("state") || lowerCode.contains("effect") || lowerCode.contains("memo") || lowerCode.contains("callback"))) {
            // React Hooks Pattern
            if ("BEGINNER".equals(level)) {
                explanation = "This is a React component utilizing Hooks! Hooks are special functions that allow you to manage state (data that changes over time) and trigger reactions when your component renders on the screen.";
                steps.add("It sets up a piece of reactive memory (state) using `useState` and provides a matching setter function to update it.");
                steps.add("It triggers a side effect using `useEffect` to do things like fetching data from a server or setting up timers.");
                steps.add("Whenever the state updates, the component automatically re-draws (re-renders) itself on the screen with the fresh data.");
            } else if ("ADVANCED".equals(level)) {
                explanation = "State allocation and side-effect synchronization utilizing the React Fiber architecture. Employs persistent hook index arrays to map state cells across recursive rendering passes, aligning state synchronization with the component layout lifecycle.";
                steps.add("Instantiates state buckets within the component's Fiber node memory array, maintaining index pointer alignment across renders.");
                steps.add("Schedules side-effects on the commit phase using dependency array change comparisons (Object.is).");
                steps.add("Fires state updates which trigger reconciliation, pushing updates to the concurrent scheduler.");
            } else { // INTERMEDIATE
                explanation = "Demonstrates reactive state management and lifecycle side-effects utilizing React Hooks. It binds component data values to state buckets and runs custom logic in sync with state or dependency updates.";
                steps.add("Initializes a reactive state cell with `useState`, exposing the getter and a re-render setter.");
                steps.add("Fires secondary actions with `useEffect`, binding dependency arrays to control execution frequency.");
                steps.add("Schedules standard component re-renders when state update functions are called.");
            }

            highlights.add(new CodeHighlight("useState", "React Hook", "Creates a reactive variable that React watches for changes, causing automatic UI updates."));
            highlights.add(new CodeHighlight("useEffect", "React Hook", "Triggers actions after the component mounts or when specific variables change (synchronization)."));
            highlights.add(new CodeHighlight("[]", "Dependency Array", "Controls when the side effect fires. An empty array runs the effect exactly once."));

            improvements.add("Always specify all state dependencies in your `useEffect` dependency array to prevent stale closure bugs.");
            improvements.add("Ensure you return a cleanup function in `useEffect` to remove event listeners or clear active intervals.");
            improvements.add("Use `useMemo` or `useCallback` if passing complex functions or objects down to child components to prevent redundant renders.");

            refactoredCode = "// Optimized React component hook with cleanup integration:\n" +
                             "import React, { useState, useEffect } from 'react';\n" +
                             "\n" +
                             "export function TimerComponent() {\n" +
                             "  const [count, setCount] = useState(0);\n" +
                             "\n" +
                             "  useEffect(() => {\n" +
                             "    const intervalId = setInterval(() => {\n" +
                             "      setCount((prev) => prev + 1);\n" +
                             "    }, 1000);\n" +
                             "\n" +
                             "    // Cleanup: prevents memory leaks if component unmounts\n" +
                             "    return () => clearInterval(intervalId);\n" +
                             "  }, []);\n" +
                             "\n" +
                             "  return <div className=\"text-cyan-400\">Session Duration: {count}s</div>;\n" +
                             "}";

        } else if (lowerCode.contains("go ") || lowerCode.contains("chan ") || lowerCode.contains("select {") || lowerCode.contains("wg.add")) {
            // Go Concurrency Pattern
            if ("BEGINNER".equals(level)) {
                explanation = "This is concurrent code written in Go! It uses lightweight workers (Goroutines) and channels to run multiple tasks at the exact same time, communicating safely between them.";
                steps.add("It spins up a new worker thread in the background using the `go` keyword followed by a function.");
                steps.add("It creates a channel (`chan`) to act as a secure physical pipe to pass messages between different concurrent workers.");
                steps.add("It blocks or releases execution states until a message is sent or received from the channel, keeping everything synchronized.");
            } else if ("ADVANCED".equals(level)) {
                explanation = "Concurrency implementation in Go using Communicating Sequential Processes (CSP) concepts. Leverages Go's GMP scheduler to multiplex green-threads onto active OS threads, using atomic channel operations to avoid low-level mutex locking.";
                steps.add("Instantiates goroutines onto runtime queues, scheduling lightweight context switches (stack size starts at 2KB).");
                steps.add("Coordinates thread communication via lock-free ring buffers within Go channels, employing select blocks for non-blocking polls.");
                steps.add("Employs sync.WaitGroup counters to orchestrate batch concurrency synchronization.");
            } else { // INTERMEDIATE
                explanation = "Implements Go concurrency patterns. Uses lightweight Goroutines for concurrent task execution, combined with typed Go channels to handle synchronized message-passing safely without race conditions.";
                steps.add("Spins up lightweight concurrent processes using the `go` statement.");
                steps.add("Declares typed channels to facilitate thread-safe communication and memory sharing.");
                steps.add("Controls worker lifecycle orchestration using Go `sync.WaitGroup` components.");
            }

            highlights.add(new CodeHighlight("go ", "Concurrency Primitive", "Spins up an independent, concurrent execution process (Goroutine) managed by Go."));
            highlights.add(new CodeHighlight("make(chan type)", "Communication Channel", "Creates a typed communication pipe to synchronize data between concurrent goroutines."));

            improvements.add("Always ensure Go channels are closed from the sender side to avoid goroutine leaks or blocking locks.");
            improvements.add("Utilize buffered channels if you want to avoid locking sender goroutines before receiver loops read the data.");
            improvements.add("Execute your code with the `-race` flag during tests to confirm there are no concurrent memory race conditions.");

            refactoredCode = "// Optimized thread-safe Go worker pool utilizing channels and WaitGroups:\n" +
                             "package main\n" +
                             "import (\n" +
                             "\t\"fmt\"\n" +
                             "\t\"sync\"\n" +
                             ")\n" +
                             "\n" +
                             "func worker(id int, jobs <-chan int, results chan<- int, wg *sync.WaitGroup) {\n" +
                             "\tdefer wg.Done()\n" +
                             "\tfor j := range jobs {\n" +
                             "\t\tresults <- j * 2\n" +
                             "\t}\n" +
                             "}\n" +
                             "\n" +
                             "func main() {\n" +
                             "\tjobs := make(chan int, 100)\n" +
                             "\tresults := make(chan int, 100)\n" +
                             "\tvar wg sync.WaitGroup\n" +
                             "\n" +
                             "\t// Spin up 3 concurrent workers\n" +
                             "\tfor w := 1; w <= 3; w++ {\n" +
                             "\t\twg.Add(1)\n" +
                             "\t\tgo worker(w, jobs, results, &wg)\n" +
                             "\t}\n" +
                             "\n" +
                             "\tfor j := 1; j <= 5; j++ {\n" +
                             "\t\tjobs <- j\n" +
                             "\t}\n" +
                             "\tclose(jobs)\n" +
                             "\n" +
                             "\twg.Wait()\n" +
                             "\tclose(results)\n" +
                             "\n" +
                             "\tfor r := range results {\n" +
                             "\t\tfmt.Println(r)\n" +
                             "\t}\n" +
                             "}";

        } else {
            // General Code/Algorithm logic
            if ("BEGINNER".equals(level)) {
                explanation = "This is a block of programming logic. It defines sequential instructions for the computer to process data inputs, execute calculations, and direct output paths based on conditional criteria.";
                steps.add("The code declares variables to store data inputs.");
                steps.add("It runs a loop or branches into if/else decisions to evaluate condition states.");
                steps.add("It returns a value or modifies state variables to capture computed outcomes.");
            } else if ("ADVANCED".equals(level)) {
                explanation = "Imperative logic block. Employs traditional control flow structures to compute transformations. Optimize execution bounds by simplifying complex conditions and avoiding redundant heap allocations.";
                steps.add("Initializes references within stack scopes to prevent unnecessary heap escape profiling.");
                steps.add("Evaluates control conditions using boolean shortcuts to skip redundant comparisons.");
                steps.add("Exits early upon encountering negative conditions to reduce nesting depths.");
            } else { // INTERMEDIATE
                explanation = "Implements logical execution flow containing custom processing criteria. It utilizes basic control blocks, loops, or functional utility methods to perform data modifications and return results.";
                steps.add("Declares input constraints and holds transient values in local variables.");
                steps.add("Sequences calculations or filters lists of data arrays.");
                steps.add("Applies conditional branches to direct logic paths depending on run states.");
            }

            highlights.add(new CodeHighlight("return", "Keyword", "Exits the execution scope, yielding the calculated results back to the caller."));

            improvements.add("Minimize the depth of nested blocks by using early return statements (the Guard Clause pattern).");
            improvements.add("Ensure variables are given descriptive, readable names rather than short letters to improve system maintenance.");
            improvements.add("Consider separating large complex logic into small, unit-testable helper functions.");

            refactoredCode = "// Refactored modular design using Guard Clauses for extreme readability:\n" +
                             "function processUserData(user) {\n" +
                             "  // Early exits / Guard clauses\n" +
                             "  if (!user) throw new Error('User context is required');\n" +
                             "  if (!user.isActive) return { status: 'suspended', data: null };\n" +
                             "  if (!user.emailVerified) return { status: 'pending_verification', data: null };\n" +
                             "\n" +
                             "  // Core modular operations\n" +
                             "  const permissions = fetchUserPermissions(user.role);\n" +
                             "  return {\n" +
                             "    status: 'authorized',\n" +
                             "    data: {\n" +
                             "      id: user.id,\n" +
                             "      email: user.email,\n" +
                             "      permissions\n" +
                             "    }\n" +
                             "  };\n" +
                             "}";
        }

        return new CodeExplainerResponse(
            explanation,
            steps,
            highlights,
            improvements,
            refactoredCode
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
                if (end != -1) {
                    return code.substring(start, end).trim();
                }
            }
            // arrow function or const name
            int constIdx = code.indexOf("const ");
            if (constIdx != -1) {
                int start = constIdx + 6;
                int end = code.indexOf("=", start);
                if (end != -1) {
                    return code.substring(start, end).trim();
                }
            }
        } catch (Exception e) {
            return "fn";
        }
        return "fn";
    }
}
