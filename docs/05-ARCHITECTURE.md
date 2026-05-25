# DevHub - Technical Architecture & Design Document

## 📋 Document Information

- **Project:** DevHub - Developer Analytics Platform
- **Version:** 1.0
- **Last Updated:** May 6, 2026
- **Status:** MVP Specification

---

## 🎯 Executive Summary

DevHub is a three-feature developer platform that combines GitHub analytics, project reflection, and tech stack recommendations into a cohesive experience. The architecture prioritizes:

1. **Simplicity:** Single backend server (no microservices)
2. **Scalability:** Designed for future growth without major refactoring
3. **Maintainability:** Clean code, clear separation of concerns
4. **Performance:** Strategic caching and async processing
5. **User Experience:** Seamless integration across features

---

## 🏗️ System Architecture

### High-Level Overview

```
┌─────────────────────────────────────────────────────────────┐
│                   Client Layer                               │
│  ┌──────────────┬──────────────┬──────────────┐             │
│  │   Web App    │  Mobile App  │   CLI Tool   │             │
│  │  (React 18)  │  (Future)    │  (Future)    │             │
│  └──────────────┴──────────────┴──────────────┘             │
└─────────────────────────────────────────────────────────────┘
                         │ REST/GraphQL
┌─────────────────────────────────────────────────────────────┐
│                   API Gateway Layer                          │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  Spring Boot REST API (Single Deployment Unit)        │ │
│  │  - Auth & Security                                    │ │
│  │  - Request/Response Validation                        │ │
│  │  - Rate Limiting                                      │ │
│  │  - CORS Configuration                                 │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                         │
    ┌────────────────────┼────────────────────┐
    │                    │                    │
┌───┴────┐         ┌──────┴────┐         ┌───┴────┐
│  Cache │         │ Job Queue │         │  File  │
│ (Redis)│         │ (Internal)│         │Storage │
└────────┘         └───────────┘         └────────┘
    │                    │                    │
    └────────────────────┼────────────────────┘
                         │
┌─────────────────────────────────────────────────────────────┐
│                  Application Layer                          │
│  ┌──────────────┬──────────────┬──────────────┐             │
│  │   GitHub     │   Graveyard  │    Stack     │             │
│  │  Analyzer    │   Service    │   Decider    │             │
│  │  Service     │              │   Engine     │             │
│  └──────────────┴──────────────┴──────────────┘             │
│                                                              │
│  Shared Services:                                           │
│  - Authentication Service                                  │
│  - Authorization Service                                   │
│  - Analytics Service                                       │
│  - Event Service                                           │
│  - Notification Service                                    │
└─────────────────────────────────────────────────────────────┘
                         │
┌─────────────────────────────────────────────────────────────┐
│              Data Access Layer (Repository)                │
│  ┌────────────────────────────────────────────────────────┐ │
│  │            Spring Data JPA                            │ │
│  │  - Automatic query generation                         │ │
│  │  - Lazy loading & relationships                       │ │
│  │  - Transaction management                            │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                         │
┌─────────────────────────────────────────────────────────────┐
│              Persistence Layer                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │            PostgreSQL Database                       │  │
│  │  - 15+ tables with relationships                     │  │
│  │  - Optimized indexes & queries                       │  │
│  │  - ACID transactions                                 │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                         │
┌─────────────────────────────────────────────────────────────┐
│           External Service Integration                      │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  GitHub API (Public Data)                            │  │
│  │  - Repository data                                   │  │
│  │  - Commit history                                    │  │
│  │  - User profile                                      │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔌 Component Design

### 1. Authentication & Authorization Layer

```
GitHub OAuth Flow:
1. User clicks "Login with GitHub"
2. Redirect to GitHub OAuth endpoint
3. User authorizes app
4. GitHub redirects with auth code
5. Backend exchanges code for access token
6. Generate JWT token for client
7. Store refresh token (secure)
8. Client uses JWT for subsequent requests
```

**Key Files:**
- `SecurityConfig.java` - Spring Security configuration
- `OAuth2UserService.java` - GitHub OAuth handling
- `JwtTokenProvider.java` - JWT generation/validation
- `AuthController.java` - Auth endpoints

### 2. GitHub Analyzer Service

```
Flow:
1. User triggers analysis (manual or scheduled)
2. Start async job (don't block UI)
3. Fetch user profile (1 call)
4. Fetch repositories (paginated, ~10 calls)
5. Fetch commits (detailed, ~100+ calls)
6. Calculate metrics offline:
   - Consistency score
   - Peak hours
   - Language distribution
7. Generate insights (ML rules)
8. Store results + cache
9. Notify user when complete
```

**Key Classes:**
- `GitHubAnalyzerService.java` - Main orchestrator
- `GitHubApiService.java` - API client wrapper
- `AnalysisEngine.java` - Calculations & insights
- `ActivityHeatmapGenerator.java` - Data aggregation

**Performance Considerations:**
- Batch GitHub API calls (50 req/min limit)
- Cache user profiles (24 hours)
- Use GraphQL for complex queries (future)

### 3. Project Graveyard Service

```
Core Operations:

Add Project:
1. Validate input
2. Create GraveyardProject entity
3. Add abandonment reasons (many-to-many)
4. Create history entry
5. Return project details

Get Statistics:
1. Count abandoned projects
2. Group by abandonment reason
3. Calculate duration distribution
4. Analyze language failure rates
5. Generate insights
6. Cache results (1 hour)

Revive Project:
1. Update status to "active"
2. Record revival timestamp
3. Increment revive counter
4. Create history entry
5. Trigger notification
```

**Key Classes:**
- `GraveyardProjectService.java` - Core logic
- `GraveyardAnalyticsService.java` - Statistics
- `AbandonmentReasonAnalyzer.java` - Pattern detection
- `ProjectHistoryService.java` - Audit trail

### 4. Stack Decider Engine

```
Recommendation Generation:

1. Parse input:
   - Project idea (NLP later)
   - Project type
   - Primary goal
   - Scale & constraints

2. Apply decision rules:
   - Rule: IF type=web_app AND goal=build_asap
     THEN recommend=Next.js
   - Rule: IF scale=enterprise
     THEN recommend=Spring Boot backend
   - Rule: IF goal=learn
     THEN show tutorials

3. Generate explanation:
   - Why each choice
   - Pros/cons
   - Alternatives

4. Personalize (if logged in):
   - Analyze user's GitHub history
   - Identify strengths/gaps
   - Show relevant insights

5. Detect overengineering:
   - Check complexity vs scale
   - Flag unnecessary tools
   - Suggest simpler alternatives

6. Return recommendation + metadata
```

**Key Classes:**
- `StackDecisionEngine.java` - Rules engine
- `StackRecommendationService.java` - API handler
- `RuleEvaluator.java` - Rule matching
- `PersonalizationEngine.java` - GitHub analysis
- `OverengineeeringDetector.java` - Risk detection

---

## 💾 Data Model

### Core Entities Relationship

```
User (1)
├── N ─ GitHubAnalysis
│        ├── N ─ GitHubInsight
│        ├── N ─ GitHubLanguageStat
│        └── N ─ GitHubActivityHeatmap
│
├── N ─ GitHubRepository
│
├── N ─ GraveyardProject
│        ├── N ─ AbandonmentReason
│        └── N ─ ProjectHistory
│
├── N ─ StackRecommendation
│        ├── N ─ RecommendationTool
│        ├── N ─ RecommendationWarning
│        └── N ─ StackAlternative
│
└── N ─ UserEvent
```

### Key Table Purposes

| Table | Purpose | Retention |
|-------|---------|-----------|
| `users` | User profiles from GitHub | Indefinite |
| `github_analyses` | Periodic analysis snapshots | 2 years |
| `github_activity_heatmap` | Daily commit activity | 2 years |
| `github_repositories` | User's repo cache | Updated daily |
| `graveyard_projects` | Abandoned project log | Indefinite |
| `graveyard_abandonment_reasons` | Tags & categorization | Indefinite |
| `graveyard_project_history` | Audit trail | Indefinite |
| `stack_recommendations` | Saved recommendations | 1 year |
| `user_events` | Analytics & tracking | 90 days |

---

## 🔄 Service Flow Diagrams

### GitHub Analyzer Full Flow

```
┌─ User clicks "Analyze GitHub"
│
├─ POST /api/v1/github/analyze
│  └─ Validate user authenticated
│     └─ Start async job
│        └─ Job ID returned immediately
│
├─ [Background] Fetch GitHub data
│  ├─ Rate limit check
│  ├─ User profile
│  ├─ All repositories (paginated)
│  │  └─ Commits per repo (last 365 days)
│  └─ Language breakdown
│
├─ [Background] Calculate metrics
│  ├─ Consistency score (0-100)
│  ├─ Peak coding hour
│  ├─ Commit streaks
│  ├─ Language diversity
│  └─ Productivity trends
│
├─ [Background] Generate insights
│  ├─ Select top 3-5 insights
│  └─ Fun facts based on patterns
│
├─ [Background] Store results
│  ├─ Save analysis record
│  ├─ Save metrics
│  ├─ Cache for 30 minutes
│  └─ Update last_analysis timestamp
│
└─ User can immediately view (from cache or previous analysis)
   └─ Refresh button to trigger new analysis
```

---

## 🔐 Security Architecture

### Authentication Flow

```
┌─────────┐                                    ┌────────┐
│ Client  │                                    │ GitHub │
└────┬────┘                                    └───┬────┘
     │ 1. GET /oauth/authorize                     │
     ├───────────────────────────────────────────────>
     │                                              │ 2. Redirect to login
     │                                         <─ ──┤
     │ 3. User authorizes                          │
     │                                              │
     │ 4. Redirect with code                   <─ ──┤
     │                                      ┌──┴────┐
     │                                      │ Server │
     │                                      └───┬────┘
     │ 5. POST /auth/callback?code=xxx          │
     ├──────────────────────────────────────────>│
     │                                           │ 6. Exchange code for token
     │                                           │──> GitHub API
     │                                           │<──
     │ 7. Return JWT + Refresh token        <───┤
     │<─ ─────────────────────────────────────────┤
     │                                           │
     │ 8. Store JWT in memory/httpOnly cookie   │
     │                                           │
     │ 9. GET /api/v1/github/analysis          │
     │ Header: Authorization: Bearer JWT        │
     ├──────────────────────────────────────────>│
     │                                      10. Verify JWT
     │                                           │
     │<─ ─────── Response ──────────────────────┤
```

### Security Layers

1. **Transport Security**
   - HTTPS/TLS in production
   - Certificate pinning (mobile)

2. **Authentication**
   - GitHub OAuth 2.0
   - JWT tokens (24-hour expiry)
   - Refresh token rotation

3. **Authorization**
   - Role-based access control
   - Resource ownership verification

4. **Data Protection**
   - GitHub tokens encrypted at rest
   - Password hashing (if applicable)
   - SQL injection prevention (parameterized queries)

5. **Application Security**
   - CORS whitelist
   - CSRF tokens
   - Rate limiting per user/IP
   - Input validation & sanitization

---

## ⚡ Performance Optimization

### Caching Strategy

```
Cache Layer Hierarchy:

Level 1: HTTP Cache Headers
├─ GET /api/v1/github/analysis
│  └─ Cache-Control: max-age=1800 (30 min)
│
Level 2: Redis Cache
├─ Key: user:{userId}:analysis:latest
├─ TTL: 30 minutes
├─ Invalidate on: New analysis triggered
│
Level 3: Database Query Optimization
├─ Indexes on: (user_id), (created_at), (status)
├─ Pagination: 20 items/page
├─ Lazy loading: Relationships fetched on demand
│
Level 4: Application Memory Cache
├─ Config values (stack presets)
├─ Rule definitions
└─ TTL: Application lifetime
```

### Database Optimization

```
Indexes Strategy:
- user_id on all user-scoped tables
- created_at on time-series data
- status fields (high cardinality searches)
- Foreign keys (implicit indexes)
- Composite indexes for common WHERE+ORDER BY

Query Optimization:
- Use EXPLAIN ANALYZE on slow queries
- Avoid N+1 queries (use JOIN or fetch eagerly)
- Batch operations where possible
- Connection pooling: HikariCP (20 max connections)

Table Partitioning (Future):
- Partition github_activity_heatmap by year
- Archive old graveyard projects
```

### API Response Optimization

```
Pagination:
- Default: 20 items
- Max: 100 items
- Cursor pagination for efficiency

Lazy Loading:
- Don't load all relationships by default
- Provide detailed endpoint for full data

Compression:
- Enable gzip compression
- Minify JSON responses
```

---

## 🌊 Async Processing

### Job Queue Architecture

```
Internal Job Queue (No external broker needed for MVP):

1. User triggers long-running operation
   └─ GitHub analysis, bulk email, etc.

2. Create async task
   ├─ Store in database
   ├─ Enqueue for processing
   └─ Return immediately to user

3. Background processor
   ├─ Spring @Scheduled tasks
   ├─ ThreadPoolExecutor for concurrency
   └─ Process N jobs in parallel

4. Update status
   ├─ In-progress → Completed/Failed
   ├─ Store results
   └─ Notify user (WebSocket or polling)

Future: Replace with Redis Queue/Kafka if needed
```

---

## 📊 Monitoring & Observability

### Application Metrics

```
Key Metrics to Track:
- API response times (p50, p95, p99)
- GitHub API call rate & errors
- Database query performance
- Cache hit rate
- Job queue processing time
- User activation rate
- Feature usage statistics

Tools:
- Spring Actuator (built-in)
- Prometheus (metrics collector)
- Grafana (visualization)
- ELK Stack (logging aggregation)
```

### Health Checks

```
Endpoints:
GET /api/actuator/health
├─ Database connectivity
├─ Redis connectivity
├─ GitHub API reachability
└─ Overall status

Response:
{
  "status": "UP",
  "components": {
    "db": {"status": "UP"},
    "redis": {"status": "UP"},
    "github": {"status": "UP"}
  }
}
```

---

## 🚀 Deployment Architecture

### Environment Configuration

```
Development:
- Single machine setup
- SQLite or local PostgreSQL
- No caching needed
- Debug logging enabled

Staging:
- Docker container
- PostgreSQL on separate machine
- Redis caching
- Monitoring enabled

Production:
- Kubernetes cluster (or Docker Compose initially)
- Managed PostgreSQL (AWS RDS, etc.)
- Redis cluster
- CDN for static assets
- Load balancer
- Auto-scaling policies
```

### CI/CD Pipeline

```
Git Commit → GitHub → GitHub Actions
    ├─ Run tests
    ├─ Build Docker image
    ├─ Push to registry
    ├─ Deploy to staging
    ├─ Run integration tests
    ├─ Manual approval
    └─ Deploy to production
```

---

## 🎯 Scalability Roadmap

### Phase 1 (MVP - Now)
- Single Spring Boot instance
- Single PostgreSQL instance
- No caching needed
- ~100 concurrent users

### Phase 2 (Growth)
- Load balancer + 2-3 instances
- Redis for caching
- Database read replicas
- ~1000 concurrent users

### Phase 3 (Scale)
- Auto-scaling groups
- PostgreSQL sharding
- Redis cluster
- CDN integration
- ~10,000 concurrent users

### Phase 4 (Enterprise)
- Multiple regions
- Event streaming (Kafka)
- Elasticsearch for search
- GraphQL API
- ~100,000+ concurrent users

---

## 📋 Technology Decisions & Rationale

| Component | Choice | Why | Alternative |
|-----------|--------|-----|-------------|
| Backend | Spring Boot | Mature, feature-rich, great ecosystem | Node.js, Go |
| Frontend | React | Popular, component-based, large community | Vue, Angular |
| Database | PostgreSQL | Reliable, powerful, good for analytics | MySQL, MongoDB |
| Cache | Redis | Fast, versatile, simple | Memcached |
| Job Queue | Internal/DB | Simple for MVP, no external dependency | RabbitMQ, Kafka |
| Auth | OAuth2/JWT | Industry standard, GitHub native | Session-based |
| ORM | Spring Data JPA | Reduces boilerplate, automatic queries | MyBatis, QueryDSL |
| Testing | JUnit 5 | Modern, extensible | TestNG |
| Logging | SLF4J + Logback | Standard Java logging | Log4j |

---

## 🧪 Testing Strategy

### Test Pyramid

```
       /\
      /  \      E2E (10%)
     /────\     - Full workflows
    /      \    - API integration
   /────────\   - Selenium tests
  /          \
 /────────────\  Integration (30%)
/              \ - Service layer
/────────────────\ - Database tests
                  - API contract tests

Unit (60%)
- Service logic
- Utils
- Controllers
- Repositories
```

### Testing Coverage Targets

- Unit Tests: >80% code coverage
- Integration Tests: All major flows
- E2E Tests: Critical user journeys

---

## 📚 API Design Principles

### RESTful Conventions

```
Resources:
- /api/v1/users → User collection
- /api/v1/users/{id} → Specific user
- /api/v1/users/{id}/analyses → User's analyses

HTTP Methods:
- GET → Retrieve
- POST → Create
- PUT → Update entire resource
- PATCH → Partial update
- DELETE → Delete

Status Codes:
- 200 → Success
- 201 → Created
- 400 → Bad request
- 401 → Unauthorized
- 403 → Forbidden
- 404 → Not found
- 409 → Conflict
- 500 → Server error
```

### Response Format

```json
// Success
{
  "data": {...},
  "meta": {
    "timestamp": "2026-05-06T10:00:00Z",
    "version": "1.0"
  }
}

// Error
{
  "error": {
    "code": "ANALYSIS_FAILED",
    "message": "Failed to fetch GitHub data",
    "details": {...}
  }
}

// List with pagination
{
  "data": [...],
  "pagination": {
    "page": 1,
    "pageSize": 20,
    "totalItems": 100,
    "totalPages": 5
  }
}
```

---

## 🔄 Development Workflow

### Feature Development Cycle

```
1. Design Phase
   └─ Update feature docs
   └─ Create API specs
   └─ Design database schema

2. Backend Development
   ├─ Create entities
   ├─ Create repositories
   ├─ Implement services
   ├─ Create controllers
   └─ Add tests

3. Frontend Development
   ├─ Create API client
   ├─ Create components
   ├─ Add state management
   └─ Add tests

4. Integration
   ├─ Connect frontend to API
   ├─ End-to-end testing
   └─ Performance testing

5. Review & Merge
   ├─ Code review
   ├─ Automated checks
   └─ Deploy to staging

6. Release
   └─ Deploy to production
```

---

## 🎓 Knowledge Base

### Critical Implementation Details

1. **GitHub API Rate Limiting**
   - Authenticated: 5000 req/hour
   - Implement exponential backoff
   - Monitor rate limit headers

2. **Timezone Handling**
   - Store all times in UTC
   - Convert to user timezone on frontend
   - Handle daylight saving time

3. **Large Dataset Handling**
   - Paginate results (20-100 per page)
   - Use database cursors
   - Implement streaming for reports

4. **JWT Token Security**
   - Store in memory or httpOnly cookie
   - Implement refresh token rotation
   - Add token revocation list (future)

---

## 📞 Support & Maintenance

### Runbooks

- [Database Migration Guide](./runbooks/database-migration.md)
- [Emergency Response](./runbooks/emergency-response.md)
- [Performance Troubleshooting](./runbooks/performance-troubleshooting.md)
- [GitHub API Outage](./runbooks/github-api-outage.md)

### SLAs

- API Availability: 99.5%
- Response Time: <200ms (p95)
- GitHub Analysis: Complete within 5 minutes
- Bug Fix: Critical in 24 hours

---

## 🔮 Future Architecture Considerations

### Potential Upgrades

1. **API Gateway**
   - Kong or Ambassador for rate limiting
   - Request/response transformation

2. **Event Streaming**
   - Kafka for event sourcing
   - Real-time notifications

3. **Search & Analytics**
   - Elasticsearch for full-text search
   - Kibana dashboards

4. **Real-time Features**
   - WebSocket connections
   - Server-sent events (SSE)

5. **Distributed System**
   - Service mesh (Istio)
   - Distributed tracing (Jaeger)
   - Service discovery (Consul)

---

**Architecture Document Version 1.0** | Last Updated: May 6, 2026
