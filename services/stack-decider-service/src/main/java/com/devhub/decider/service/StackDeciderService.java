package com.devhub.decider.service;

import com.devhub.decider.dto.StackDeciderRequest;
import com.devhub.decider.dto.StackDeciderResponse;
import com.devhub.decider.dto.StackDeciderResponse.TechnologySuggestion;
import com.devhub.decider.dto.StackDeciderResponse.Galaxy3DNode;
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
                "", "Low", "No project idea provided. Please enter a description.",
                new TechnologySuggestion("React (Vite)", "Standard modern frontend library.", List.of("Fast setup"), List.of("Requires build step")),
                new TechnologySuggestion("Node.js (Express)", "Lightweight API layer.", List.of("Fast to ship"), List.of("Single-threaded")),
                new TechnologySuggestion("PostgreSQL", "Relational database standard.", List.of("ACID transactions"), List.of("Schema migrations required")),
                List.of("Please describe your project idea to see specific warnings."),
                List.of("Start with a simple React template."),
                "Not tailored (No idea supplied)",
                generateDefaultGalaxy()
            );
        }

        String lowerIdea = idea.toLowerCase(Locale.ROOT);
        String category = "general";
        String estimatedComplexity = "Medium";
        String rationale = "";

        if (matchesAny(lowerIdea, "portfolio", "blog", "landing page", "static", "resume", "website")) {
            category = "static";
            estimatedComplexity = "Low";
            rationale = "Your project is primarily static or read-heavy display content.";
        } else if (matchesAny(lowerIdea, "blockchain", "crypto", "nft", "smart contract", "web3")) {
            category = "web3";
            estimatedComplexity = "High";
            rationale = "Crypto and Web3 applications deal with blockchain node interactions, which are inherently complex.";
        } else if (matchesAny(lowerIdea, "ai", "llm", "gpt", "rag", "langchain", "vector", "openai")) {
            category = "ai";
            estimatedComplexity = "High";
            rationale = "AI/LLM-powered apps require secure API routing, server-side streaming responses, and vector index lookup.";
        } else if (matchesAny(lowerIdea, "chat", "messaging", "realtime", "live", "socket")) {
            category = "realtime";
            estimatedComplexity = "Medium";
            rationale = "Real-time sync demands persistent state connections and fast publish-subscribe caching.";
        } else if (matchesAny(lowerIdea, "shop", "ecommerce", "store", "marketplace")) {
            category = "ecommerce";
            estimatedComplexity = "Medium";
            rationale = "E-commerce apps require transactional guarantees (ACID) and product catalog indexing.";
        } else if (matchesAny(lowerIdea, "saas", "dashboard", "crm", "tracker", "b2b")) {
            category = "saas";
            estimatedComplexity = "Medium";
            rationale = "SaaS dashboards revolve around relational user roles, tenant separation, and structured CRUD tables.";
        } else {
            category = "general";
            estimatedComplexity = "Medium";
            rationale = "This is a general web application focusing on CRUD patterns and relational data.";
        }

        TechnologySuggestion frontend;
        TechnologySuggestion backend;
        TechnologySuggestion database;
        List<String> warnings = new ArrayList<>();
        List<String> overengineeringAlternatives = new ArrayList<>();

        if ("static".equals(category)) {
            frontend = new TechnologySuggestion("Astro or Next.js (SSG)", "Ideal for static content.", List.of("Fast loads"), List.of("Requires rebuilds for content"));
            backend = new TechnologySuggestion("Serverless / Supabase", "For static sites, hosting a 24/7 backend is wasteful.", List.of("Zero hosting costs"), List.of("Cold starts"));
            database = new TechnologySuggestion("Supabase PostgreSQL", "Instant serverless data storage.", List.of("Zero setup overhead"), List.of("Overkill if truly static"));
        } else if ("ai".equals(category)) {
            frontend = new TechnologySuggestion("Next.js (App Router)", "Native support for Server-Sent Events.", List.of("Built-in streaming"), List.of("Steeper learning curve"));
            backend = new TechnologySuggestion("FastAPI (Python)", "Python is the center of AI.", List.of("Direct ML imports"), List.of("Dynamic typing"));
            database = new TechnologySuggestion("PostgreSQL + pgvector", "Store vectors directly alongside relational data.", List.of("Unified storage"), List.of("Requires pgvector"));
        } else if ("realtime".equals(category)) {
            frontend = new TechnologySuggestion("React (Vite) + Zustand", "Zustand manages client-side socket states easily.", List.of("Lightweight"), List.of("Manual routing"));
            backend = new TechnologySuggestion("Node.js (Socket.io)", "Event-driven backend is perfect for WebSockets.", List.of("High socket throughput"), List.of("Blocked thread freezes sockets"));
            database = new TechnologySuggestion("Redis + PostgreSQL", "Redis holds ephemeral state, Postgres is permanent.", List.of("Fast writes"), List.of("Sync coordination"));
        } else if ("web3".equals(category)) {
            frontend = new TechnologySuggestion("Next.js + Wagmi", "Manages RPC connections securely.", List.of("Pre-made UI"), List.of("Hydration mismatches"));
            backend = new TechnologySuggestion("NestJS (TypeScript)", "Modular architecture to index ledger events safely.", List.of("Strict types"), List.of("Steep learning curve"));
            database = new TechnologySuggestion("PostgreSQL + Redis", "Postgres for relational, Redis caches smart contract reads.", List.of("Prevents costly RPC"), List.of("Listener cron tasks needed"));
        } else {
            frontend = new TechnologySuggestion("React (Vite) + Tailwind CSS", "The gold standard for modern developers.", List.of("Rapid styling"), List.of("Needs careful layouts"));
            backend = new TechnologySuggestion("Node.js (Express / NestJS)", "Lightning-fast REST API production.", List.of("Write TS on client and server"), List.of("Lacks structural standards"));
            database = new TechnologySuggestion("PostgreSQL", "The undisputed default database.", List.of("ACID transactions"), List.of("Schema migrations required"));
        }

        String tailorStatus = "Not tailored (No GitHub profile linked)";
        if (request.tailorGitHub() && request.gitHubLanguages() != null && !request.gitHubLanguages().isEmpty()) {
            String primaryLanguage = request.gitHubLanguages().get(0).toLowerCase(Locale.ROOT);
            if ("java".equals(primaryLanguage)) {
                backend = new TechnologySuggestion("Spring Boot (Java)", "Tailored to your Java expertise.", List.of("Strict type safety"), List.of("Verbose boilerplate"));
                tailorStatus = "Tailored to your Java profile. Recommended Spring Boot backend.";
            } else if ("python".equals(primaryLanguage)) {
                backend = new TechnologySuggestion("FastAPI (Python)", "Tailored to your Python profile.", List.of("Native AI compatibility"), List.of("GIL limits threading"));
                tailorStatus = "Tailored to your Python profile. Recommended FastAPI backend.";
            } else if ("go".equals(primaryLanguage)) {
                backend = new TechnologySuggestion("Go (Fiber / Gin)", "Tailored to your Go expertise.", List.of("Sub-millisecond responses"), List.of("More verbose code"));
                tailorStatus = "Tailored to your Go profile. Recommended Go backend.";
            }
        }

        return new StackDeciderResponse(
            idea, estimatedComplexity, rationale,
            frontend, backend, database,
            warnings, overengineeringAlternatives, tailorStatus,
            generateGalaxy(frontend.name(), backend.name(), database.name())
        );
    }

    private boolean matchesAny(String text, String... keywords) {
        for (String kw : keywords) if (text.contains(kw)) return true;
        return false;
    }

    private List<Galaxy3DNode> generateDefaultGalaxy() {
        return List.of(
            new Galaxy3DNode("fe", "Frontend", "frontend", new double[]{-2, 0, 0}, "#38bdf8", 0.6),
            new Galaxy3DNode("be", "Backend", "backend", new double[]{2, 0, 0}, "#10b981", 0.6),
            new Galaxy3DNode("db", "Database", "database", new double[]{0, 2, 0}, "#a855f7", 0.6)
        );
    }

    private List<Galaxy3DNode> generateGalaxy(String feName, String beName, String dbName) {
        return List.of(
            new Galaxy3DNode("fe", feName, "frontend", new double[]{-2.5, 0.5, 1}, "#38bdf8", 0.8),
            new Galaxy3DNode("be", beName, "backend", new double[]{2.5, 0.5, -1}, "#10b981", 0.8),
            new Galaxy3DNode("db", dbName, "database", new double[]{0, -2, 1.5}, "#f59e0b", 0.7)
        );
    }
}
