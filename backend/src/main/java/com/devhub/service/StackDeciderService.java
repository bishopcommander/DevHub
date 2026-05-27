package com.devhub.service;

import com.devhub.dto.StackDeciderRequest;
import com.devhub.dto.StackDeciderResponse;
import com.devhub.dto.StackDeciderResponse.TechnologySuggestion;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Locale;

@Service
public class StackDeciderService {

    public StackDeciderResponse decideStack(StackDeciderRequest request) {
        String idea = request.idea();
        if (idea == null || idea.trim().isEmpty()) {
            return new StackDeciderResponse(
                "",
                "Low",
                "No project idea provided. Please enter a description.",
                new TechnologySuggestion("React (Vite)", "Standard modern frontend library.", List.of("Fast setup"), List.of("Requires build step")),
                new TechnologySuggestion("Node.js (Express)", "Lightweight API layer.", List.of("Fast to ship"), List.of("Single-threaded")),
                new TechnologySuggestion("PostgreSQL", "Relational database standard.", List.of("ACID transactions"), List.of("Schema migrations required")),
                List.of("Please describe your project idea to see specific warnings."),
                List.of("Start with a simple React template."),
                "Not tailored (No idea supplied)"
            );
        }

        String lowerIdea = idea.toLowerCase(Locale.ROOT);
        String category = "general";
        String estimatedComplexity = "Medium";
        String rationale = "";

        // Heuristics for project category & complexity
        if (matchesAny(lowerIdea, "portfolio", "blog", "landing page", "static", "resume", "website", "documentation", "markdown", "linktree")) {
            category = "static";
            estimatedComplexity = "Low";
            rationale = "Your project is primarily static or read-heavy display content, which doesn't require complex server state or complex backend pipelines.";
        } else if (matchesAny(lowerIdea, "blockchain", "crypto", "nft", "smart contract", "solidity", "web3", "wallet", "ethereum")) {
            category = "web3";
            estimatedComplexity = "High";
            rationale = "Crypto and Web3 applications deal with blockchain node interactions, smart contract logic, and wallet connection states, which are inherently complex.";
        } else if (matchesAny(lowerIdea, "ai", "llm", "gpt", "rag", "langchain", "vector", "openai", "claude", "agent", "bot", "assistant", "recommend", "prediction")) {
            category = "ai";
            estimatedComplexity = "High";
            rationale = "AI/LLM-powered apps require secure API routing, server-side streaming responses, vector index lookup, and managing asynchronous context queues.";
        } else if (matchesAny(lowerIdea, "chat", "messaging", "realtime", "live", "collab", "multiplayer", "socket", "webrtc", "game", "canvas")) {
            category = "realtime";
            estimatedComplexity = "Medium";
            rationale = "Real-time sync demands persistent state connections (WebSockets or Server-Sent Events) and fast, low-latency publish-subscribe caching.";
        } else if (matchesAny(lowerIdea, "shop", "ecommerce", "e-commerce", "store", "marketplace", "stripe", "checkout", "cart", "product")) {
            category = "ecommerce";
            estimatedComplexity = "Medium";
            rationale = "E-commerce apps require transactional guarantees (ACID), product catalog indexing, and external payment provider gateways.";
        } else if (matchesAny(lowerIdea, "saas", "dashboard", "crm", "tracker", "billing", "invoice", "productivity", "management", "tool", "b2b", "api", "database", "crud", "admin")) {
            category = "saas";
            estimatedComplexity = "Medium";
            rationale = "SaaS dashboards revolve around relational user roles, tenant separation, charting data, and structured CRUD tables.";
        } else {
            category = "general";
            estimatedComplexity = "Medium";
            rationale = "This is a general web application focusing on CRUD patterns, user authentication, and relational data.";
        }

        // Base suggestions
        TechnologySuggestion frontend;
        TechnologySuggestion backend;
        TechnologySuggestion database;
        List<String> warnings = new ArrayList<>();
        List<String> overengineeringAlternatives = new ArrayList<>();

        if ("static".equals(category)) {
            frontend = new TechnologySuggestion(
                "Astro or Next.js (SSG)",
                "Ideal for static content, blogs, or landing pages with blazing-fast loads and excellent SEO out-of-the-box.",
                List.of("Near-zero JavaScript by default", "Perfect lighthouse/SEO scores", "Incredibly easy Markdown support"),
                List.of("Not suitable for highly dynamic, authenticated portals", "Must build/redeploy for content additions")
            );
            backend = new TechnologySuggestion(
                "None (Serverless / Supabase)",
                "For static sites, hosting a dedicated 24/7 backend is wasteful. Use serverless API endpoints or Supabase if database access is needed.",
                List.of("Zero hosting costs on Vercel/Netlify", "Auth & databases are instantly ready", "Highly scalable without server crashes"),
                List.of("Cold starts on serverless functions", "Vendor dependency lock-in")
            );
            database = new TechnologySuggestion(
                "Supabase PostgreSQL (or LocalStorage)",
                "If data only needs to persist for a single browser user, use browser LocalStorage. Otherwise, use Supabase for instant serverless data storage.",
                List.of("Zero setup overhead", "SQL support with full Postgres power", "Autogenerated APIs"),
                List.of("Overkill if your app is truly static", "Relies on external network requests")
            );

            warnings.add("Overengineering Alert: Do not set up Docker or AWS for a simple website. Deploy static HTML/JS files to GitHub Pages, Netlify, or Vercel for free.");
            warnings.add("State Management Warning: Do not install Redux or MobX. Standard React useState or simple browser LocalStorage is more than enough.");
            overengineeringAlternatives.add("Instead of React + Node.js + Express + PostgreSQL -> Use Astro + Tailwind + static hosting.");
        } else if ("ai".equals(category)) {
            frontend = new TechnologySuggestion(
                "Next.js (App Router)",
                "Highly recommended because of native support for Server-Sent Events (SSE), streaming UI responses, and secure environment variables.",
                List.of("Built-in support for streaming responses (AI chat effect)", "API routes to securely wrap API keys", "Fast page loads via Server Components"),
                List.of("Steeper learning curve than vanilla React", "Requires Vercel or Node server hosting to utilize SSR")
            );
            backend = new TechnologySuggestion(
                "FastAPI (Python)",
                "Python is the undisputed center of gravity for AI libraries. FastAPI is fast, simple, and connects perfectly with OpenAI/LangChain.",
                List.of("Direct imports of pandas, numpy, and LangChain", "Fast response times with async support", "Autogenerated API documentation"),
                List.of("Python's dynamic typing can lead to runtime errors if not strict", "Requires deploying a separate Python runtime")
            );
            database = new TechnologySuggestion(
                "PostgreSQL + pgvector",
                "Store vectors (embeddings) directly alongside your standard relational user accounts. Avoid standalone vector databases initially.",
                List.of("Unified storage — no syncing embeddings with another DB", "PostgreSQL is production-hardened", "Low cost compared to Pinecone"),
                List.of("Requires pgvector extension", "Indexing millions of vectors can consume substantial RAM")
            );

            warnings.add("Vector Storage: Do not pay $100/mo for Pinecone or Milvus. PostgreSQL with pgvector is free and handles up to millions of embeddings easily.");
            warnings.add("Response Latency: AI queries are slow. Do not keep HTTP connections hanging without feedback; use Next.js response streaming to display letters as they generate.");
            overengineeringAlternatives.add("Instead of Python + Pinecone + LangSmith + Celery -> Use Next.js API Routes + pgvector + simple fetch requests.");
        } else if ("realtime".equals(category)) {
            frontend = new TechnologySuggestion(
                "React (Vite) + Zustand",
                "Vite compiles in milliseconds, and Zustand manages client-side socket states without Redux's excessive boilerplate.",
                List.of("Lightweight client build size", "Zustand is fast and easy to link to websockets", "Responsive dev server"),
                List.of("Client-side routing must be added manually (e.g. React Router)")
            );
            backend = new TechnologySuggestion(
                "Node.js (Socket.io / Fastify)",
                "An event-driven backend is perfect for holding open thousands of persistent WebSocket connections with low RAM overhead.",
                List.of("Very high socket throughput", "Shared models/TypeScript interfaces between frontend and backend", "Vibrant real-time library ecosystem"),
                List.of("A single blocked thread can freeze all user socket connections", "CPU-heavy data processing must be delegated")
            );
            database = new TechnologySuggestion(
                "Redis + PostgreSQL",
                "Redis holds active room counts, ephemeral chat queues, and user online statuses, while Postgres acts as the permanent record log.",
                List.of("Sub-millisecond write times in Redis", "Postgres guarantees chat message durability", "Decoupled memory and storage layers"),
                List.of("Need to coordinate data synchronization between memory cache and Postgres")
            );

            warnings.add("WebSocket Overload: Don't set up complex WebSocket infrastructure on day one. If real-time needs are simple (e.g., updates every 10s), standard HTTP polling or Server-Sent Events (SSE) is much easier.");
            warnings.add("RabbitMQ Risk: Avoid RabbitMQ or Kafka unless you have massive scale. Redis pub/sub can handle hundreds of thousands of events with near-zero setup.");
            overengineeringAlternatives.add("Instead of SocketCluster + Kafka + MongoDB + Go -> Use Node.js Socket.io + Redis + Postgres.");
        } else if ("web3".equals(category)) {
            frontend = new TechnologySuggestion(
                "Next.js + RainbowKit / Wagmi",
                "Next.js manages RPC connection states securely and handles server rendering. RainbowKit provides a polished wallet connection interface.",
                List.of("Pre-made UI elements for Metamask, Coinbase, etc.", "Efficient SSR metadata for SEO", "Easy state synchronization hooks"),
                List.of("Potential React hydration mismatches on client wallet state")
            );
            backend = new TechnologySuggestion(
                "NestJS (TypeScript)",
                "NestJS provides modular architecture, dependency injection, and clean typescript decorators to index ledger events safely.",
                List.of("Strict object-oriented code architecture", "Native TypeScript compiling", "Great modularity for scaling services"),
                List.of("Steep learning curve", "Heavy codebase files size")
            );
            database = new TechnologySuggestion(
                "PostgreSQL + Redis",
                "Postgres records users, profiles, and processed block heights. Redis caches smart contract read states to avoid hitting RPC node rate limits.",
                List.of("Prevents costly repetitive RPC node queries", "Relational stability for token ledger tracking", "Easy caching schemas"),
                List.of("Syncing block events reliably requires setting up listener cron tasks")
            );

            warnings.add("Blockchain RPC Rate Limits: Free RPC nodes will rate limit you instantly. Cache all smart contract reads in Redis, and index logs using a local background script.");
            warnings.add("Decentralization Trap: Do not store everything on IPFS or the chain. It is slow and expensive. Use standard Postgres for user profiles/likes/comments.");
            overengineeringAlternatives.add("Instead of Custom Subgraph indexing + IPFS state matching -> Use a simple cron job indexing chain events into PostgreSQL.");
        } else {
            // saas, ecommerce, general
            frontend = new TechnologySuggestion(
                "React (Vite) + Tailwind CSS",
                "The gold standard for modern developers. It offers extremely rapid UI construction, a vast component ecosystem, and instant dev hot reload.",
                List.of("Rapid styling with Tailwind classes", "Massive open-source package ecosystem", "Lightweight SPA output"),
                List.of("Needs careful layout structures to avoid huge index.js files")
            );
            backend = new TechnologySuggestion(
                "Node.js (Express / NestJS)",
                "Enables lightning-fast REST API production, allowing you to use a single programming language across your entire codebase.",
                List.of("Write TypeScript on both client and server", "Fast JSON marshalling", "Easy deploy to Railway or Render"),
                List.of("Lacks structural standards (unless NestJS is used)")
            );
            database = new TechnologySuggestion(
                "PostgreSQL",
                "The undisputed default database. Relational schemas, transactions, indexing, and JSONB fields give you SQL and NoSQL powers combined.",
                List.of("ACID transactions for billing/checkout", "Native JSON support (JSONB column types)", "Extremely robust and open-source"),
                List.of("Schema migrations require discipline as the app grows")
            );

            warnings.add("Kubernetes Danger: Avoid Kubernetes (K8s) or AWS ECS. Deploy your monolith in one click to Railway, Render, or Fly.io.");
            warnings.add("Microservices Trap: Do not split your app into 5 microservices. Build a modular monolith. Splitting your database will kill your shipping velocity.");
            overengineeringAlternatives.add("Instead of Next.js + Microservices (Go, Python, Java) + MongoDB + Elasticsearch -> Use React (Vite) + Monolithic Node.js + Postgres.");
        }

        // Apply GitHub tailoring if requested
        String tailorStatus = "Not tailored (Select the toggle and link GitHub to personalize)";
        if (request.tailorGitHub() && request.gitHubLanguages() != null && !request.gitHubLanguages().isEmpty()) {
            // Find the user's primary languages from the list
            String primaryLanguage = request.gitHubLanguages().get(0);
            String cleanLang = primaryLanguage.trim().toLowerCase(Locale.ROOT);

            if ("java".equals(cleanLang)) {
                backend = new TechnologySuggestion(
                    "Spring Boot (Java)",
                    "Tailored to your Java expertise. Spring Boot provides compile-time safety, robust architecture, and enterprise-ready security configurations that fit your active profile.",
                    List.of("Extremely strict type safety and compiler checks", "Sophisticated dependency injection", "First-class SQL mapper integrations (JPA/Hibernate)"),
                    List.of("Slow startup time compared to Node/Go", "Verbose boilerplate code requirements")
                );
                tailorStatus = "Tailored to your Java profile. Recommended Spring Boot backend.";
            } else if ("python".equals(cleanLang)) {
                backend = new TechnologySuggestion(
                    "FastAPI (Python)",
                    "Tailored to your Python profile. FastAPI gets you high-performance endpoints with autogenerated docs in seconds, utilizing a language you're highly proficient in.",
                    List.of("Excellent readability and clean Python syntax", "Native compatibility with ML/AI libraries", "Extremely fast async support"),
                    List.of("Global Interpreter Lock (GIL) can affect pure multi-threaded CPU tasks")
                );
                tailorStatus = "Tailored to your Python profile. Recommended FastAPI backend.";
            } else if ("javascript".equals(cleanLang) || "typescript".equals(cleanLang)) {
                backend = new TechnologySuggestion(
                    "Node.js (Express / Fastify)",
                    "Tailored to your JavaScript/TypeScript profile. Allows you to write code in a single language across the entire stack, maximizing your development speed.",
                    List.of("Code reuse (models, validation libraries)", "Massive npm package ecosystem", "Instant startup and deployments"),
                    List.of("Single-threaded CPU bound tasks can block event loop")
                );
                tailorStatus = "Tailored to your JS/TS profile. Recommended Node.js backend.";
            } else if ("go".equals(cleanLang)) {
                backend = new TechnologySuggestion(
                    "Go (Fiber / Gin)",
                    "Tailored to your Go expertise. Go compiles to a single binary with zero dependencies, yielding extreme speed and low memory usage.",
                    List.of("Sub-millisecond API response times", "First-class concurrency support", "Extremely low memory footprint"),
                    List.of("More verbose code", "Smaller library ecosystem than Node/Python")
                );
                tailorStatus = "Tailored to your Go profile. Recommended Go backend.";
            } else {
                tailorStatus = "Languages detected (" + primaryLanguage + "), but standard defaults are recommended for this specific project category.";
            }
        }

        // General fallback warnings to help developers avoid overengineering
        warnings.add("Database Choice: Don't use a NoSQL database (like MongoDB) just because you want schema flexibility. Schema-less usually turns into messy app-level validation code. Postgres handles JSON columns perfectly.");
        warnings.add("State Management: Keep state close to the components that need it. Do not implement complex global stores for simple UI states.");

        return new StackDeciderResponse(
            idea,
            estimatedComplexity,
            rationale,
            frontend,
            backend,
            database,
            warnings,
            overengineeringAlternatives,
            tailorStatus
        );
    }

    private boolean matchesAny(String text, String... keywords) {
        for (String kw : keywords) {
            if (text.contains(kw)) {
                return true;
            }
        }
        return false;
    }
}
