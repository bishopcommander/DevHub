# 🚀 DevHub - Getting Started Guide

Welcome! This guide will help you get started with DevHub development.

---

## 📦 What You Have

You now have a complete, production-ready project structure for **DevHub** - a developer analytics platform with three core features:

1. **GitHub Analyzer** - Turn GitHub data into insights
2. **Project Graveyard** - Learn from abandoned projects
3. **Stack Decider** - Get confident tech stack recommendations

---

## 📂 Project Structure

```
DevHub/
├── 📚 docs/
│   ├── 01-FEATURE-OVERVIEW.md       ← START HERE: Product vision
│   ├── 02-GITHUB-ANALYZER.md        ← Feature spec with APIs & DB schema
│   ├── 03-PROJECT-GRAVEYARD.md      ← Feature spec with APIs & DB schema
│   ├── 04-STACK-DECIDER.md          ← Feature spec with APIs & DB schema
│   ├── 05-ARCHITECTURE.md           ← Technical architecture & design
│   └── 06-IMPLEMENTATION-GUIDE.md   ← Step-by-step execution plan
│
├── 🏗️ backend/
│   ├── pom.xml                      ← Maven dependencies
│   ├── src/main/java/com/devhub/
│   │   ├── entity/                  ← JPA entities (User, GitHubAnalysis, etc.)
│   │   ├── controller/              ← REST endpoints (to be filled)
│   │   ├── service/                 ← Business logic (to be filled)
│   │   ├── repository/              ← Data access layer (to be filled)
│   │   ├── dto/                     ← Data transfer objects (to be filled)
│   │   ├── config/                  ← Spring configuration (to be filled)
│   │   └── DevHubApplication.java   ← Main app class
│   ├── src/main/resources/
│   │   └── application.yml          ← Configuration file
│   └── README.md                    ← Backend setup guide
│
├── 💻 frontend/
│   ├── package.json                 ← NPM dependencies
│   ├── src/                         ← React components (to be created)
│   └── README.md                    ← Frontend setup guide (coming soon)
│
├── 💾 database/
│   └── schema.sql                   ← Complete PostgreSQL schema
│
└── 📋 README.md                     ← Main project overview
```

---

## 🎯 Quick Start (5 Minutes)

### 1. Read the Vision Document
```bash
# Understand what you're building
open docs/01-FEATURE-OVERVIEW.md
```

### 2. Understand the Architecture
```bash
# See how everything fits together
open docs/05-ARCHITECTURE.md
```

### 3. Check Implementation Plan
```bash
# See what to build first
open docs/06-IMPLEMENTATION-GUIDE.md
```

---

## 🛠️ Development Setup

### Prerequisites
- Java 17+
- Maven 3.8+
- Node.js 18+
- PostgreSQL 14+
- Git

### Backend Setup (15 min)

```bash
# Navigate to backend
cd backend

# Read the detailed setup guide
cat README.md

# Install dependencies
mvn clean install

# Create database
createdb devhub
createuser devhub_user -P  # password: devhub_password

# Initialize schema
psql -U devhub_user -d devhub < ../database/schema.sql

# Configure GitHub OAuth
# Edit src/main/resources/application.yml
# Add your GitHub OAuth credentials

# Run the application
mvn spring-boot:run

# Verify (in another terminal)
curl http://localhost:8080/api/health
```

### Frontend Setup (10 min)

```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Create .env file
echo 'VITE_API_URL=http://localhost:8080/api' > .env
echo 'VITE_GITHUB_CLIENT_ID=YOUR_ID' >> .env

# Start dev server
npm run dev

# Visit http://localhost:5173
```

---

## 📖 Documentation Roadmap

Read these in order to understand the project:

| Document | Purpose | Read Time |
|----------|---------|-----------|
| [01-FEATURE-OVERVIEW.md](./docs/01-FEATURE-OVERVIEW.md) | Product vision & why each feature matters | 10 min |
| [02-GITHUB-ANALYZER.md](./docs/02-GITHUB-ANALYZER.md) | Detailed spec: API, database, frontend | 25 min |
| [03-PROJECT-GRAVEYARD.md](./docs/03-PROJECT-GRAVEYARD.md) | Detailed spec: API, database, frontend | 25 min |
| [04-STACK-DECIDER.md](./docs/04-STACK-DECIDER.md) | Detailed spec: API, database, frontend | 25 min |
| [05-ARCHITECTURE.md](./docs/05-ARCHITECTURE.md) | System design, scaling, security | 30 min |
| [06-IMPLEMENTATION-GUIDE.md](./docs/06-IMPLEMENTATION-GUIDE.md) | Step-by-step execution plan | 20 min |

**Total: ~2 hours to fully understand the project**

---

## 🗺️ Implementation Phases

### Phase 1: Authentication (Days 1-2)
- [ ] Set up GitHub OAuth
- [ ] Create User entity & JwtProvider
- [ ] Build login flow
- **Backend target:** 4 endpoints

### Phase 2: GitHub Analyzer (Days 3-5)
- [ ] Fetch GitHub data
- [ ] Calculate metrics
- [ ] Generate insights
- [ ] Build dashboard UI
- **Backend target:** 5 endpoints, 3 services

### Phase 3: Project Graveyard (Days 6-8)
- [ ] Create CRUD endpoints
- [ ] Calculate statistics
- [ ] Build UI
- **Backend target:** 7 endpoints

### Phase 4: Stack Decider (Days 9-10)
- [ ] Implement rules engine
- [ ] Create recommendation logic
- [ ] Build wizard UI
- **Backend target:** 4 endpoints

### Phase 5: Integration & Polish (Days 11-14)
- [ ] End-to-end testing
- [ ] Performance optimization
- [ ] Bug fixes
- [ ] Deployment

---

## 🔑 Key Technologies

### Backend Stack
```
Spring Boot 3.2          → Framework
PostgreSQL 14+           → Database
Redis                    → Caching (optional for MVP)
Spring Security + JWT    → Authentication
GitHub API               → Data source
Maven                    → Build tool
JUnit 5                  → Testing
```

### Frontend Stack
```
React 18 + TypeScript    → UI Framework
Vite                     → Build tool
Material-UI              → Component library
Recharts                 → Charts & graphs
Axios                    → HTTP client
Zustand                  → State management
React Query              → Data fetching
```

---

## 📊 Database Quick Facts

- **15+ tables** with relationships
- **PostgreSQL-specific** (JSON, arrays, full-text search)
- **Pre-populated presets** for Stack Decider
- **Audit trails** for Project Graveyard

Key tables:
- `users` - GitHub profiles
- `github_analyses` - Periodic analyses
- `graveyard_projects` - Abandoned projects
- `stack_recommendations` - Saved recommendations

---

## 🧪 Testing Approach

### For Backend
```bash
# Run all tests
mvn test

# Test specific class
mvn test -Dtest=GitHubAnalyzerServiceTest

# With coverage
mvn test jacoco:report
```

### For Frontend
```bash
# Run tests
npm test

# Watch mode
npm test -- --watch

# Coverage
npm test -- --coverage
```

---

## 🚀 API Preview

### GitHub Analyzer
```
POST   /api/v1/github/analyze           → Trigger analysis
GET    /api/v1/github/analysis          → Get latest analysis
GET    /api/v1/github/heatmap           → Activity heatmap
GET    /api/v1/github/languages         → Language breakdown
GET    /api/v1/github/inactive          → Inactive repos
```

### Project Graveyard
```
POST   /api/v1/graveyard/projects       → Add project
GET    /api/v1/graveyard/projects       → List projects
GET    /api/v1/graveyard/projects/{id}  → Get details
PUT    /api/v1/graveyard/projects/{id}  → Update
DELETE /api/v1/graveyard/projects/{id}  → Delete
PUT    /api/v1/graveyard/projects/{id}/revive  → Revive
GET    /api/v1/graveyard/stats          → Statistics
```

### Stack Decider
```
POST   /api/v1/stack-decider/recommend  → Generate recommendation
GET    /api/v1/stack-decider/presets    → Get preset stacks
POST   /api/v1/stack-decider/saved      → Save recommendation
GET    /api/v1/stack-decider/my-stacks  → Get saved stacks
```

---

## 🔐 Security Checklist

- [ ] GitHub OAuth app created
- [ ] JWT secret configured (min 32 chars)
- [ ] Database user with limited permissions
- [ ] HTTPS enabled (production)
- [ ] CORS whitelist configured
- [ ] Rate limiting implemented
- [ ] Input validation added
- [ ] Security headers configured

---

## 📈 Success Metrics

### Development
- [ ] 100+ unit tests
- [ ] >80% code coverage
- [ ] <5 min build time
- [ ] All linting/formatting passes

### Functionality
- [ ] All 3 features working
- [ ] Zero critical bugs
- [ ] API documentation complete
- [ ] Frontend responsive on mobile

### Performance
- [ ] API p95 response time < 200ms
- [ ] Frontend FCP < 1s
- [ ] Database queries < 50ms
- [ ] Cache hit rate > 60%

### Deployment
- [ ] Docker containerized
- [ ] Single-command deployment
- [ ] Health checks passing
- [ ] Monitoring alerts configured

---

## 💡 Pro Tips

1. **Start with backend**
   - Get APIs working with mock data
   - Test with Postman/Insomnia
   - Then build frontend against real APIs

2. **Use seed data**
   - Pre-populate test data in database
   - Don't wait for real GitHub data

3. **Deploy early, deploy often**
   - Docker container from day 1
   - Staging environment early
   - Reduces surprise issues

4. **Document as you go**
   - Comments in code
   - Update API docs
   - Record decisions (ADR)

5. **Test in parallel**
   - Backend and frontend teams work simultaneously
   - Use API mocks on frontend

---

## 🐛 Common Issues

### Port already in use
```bash
# Change in application.yml
server.port=8081
```

### Database connection failed
```bash
# Check PostgreSQL running
psql -l

# Check credentials in application.yml
# Recreate database if needed
```

### GitHub OAuth not working
```bash
# Verify credentials in application.yml
# Check callback URL matches GitHub app settings
# Ensure internet connectivity
```

### Frontend API calls failing
```bash
# Check proxy in package.json points to backend
# Check CORS is enabled on backend
# Check backend is running on :8080
```

---

## 📚 Learning Resources

### Spring Boot
- https://spring.io/guides - Official guides
- https://spring.io/projects/spring-boot - Main page
- Spring Data JPA docs

### React
- https://react.dev - Official docs
- TypeScript handbook
- Material-UI component API

### PostgreSQL
- Official documentation
- Query optimization guides
- JSON & array types

### GitHub API
- https://docs.github.com/en/rest
- GraphQL API reference
- Rate limiting info

---

## 🎯 Your Next Steps

1. **Read Feature Overview** (10 min)
   ```bash
   open docs/01-FEATURE-OVERVIEW.md
   ```

2. **Set Up Development Environment** (30 min)
   - Install Java, Node, PostgreSQL
   - Clone repository
   - Run database schema

3. **Explore Backend Structure** (20 min)
   - Look at entities in `backend/src/main/java/com/devhub/entity/`
   - Check application.yml
   - Review schema.sql

4. **Read Implementation Guide** (20 min)
   ```bash
   open docs/06-IMPLEMENTATION-GUIDE.md
   ```

5. **Start Building!** 🚀
   - Follow the phased approach
   - Complete each phase's checklist
   - Deploy incrementally

---

## 📞 Support

### If You Get Stuck

1. Check the relevant feature documentation (02, 03, or 04)
2. Review the architecture document (05)
3. Look at the implementation guide (06)
4. Search existing issues/discussions
5. Ask in GitHub discussions or create an issue

### Key Contacts
- Architecture questions → See [05-ARCHITECTURE.md](./docs/05-ARCHITECTURE.md)
- Feature questions → See specific feature docs (02-04)
- Build/deployment → See [backend/README.md](./backend/README.md)

---

## 🎉 You're Ready!

You have everything you need to build DevHub. The documentation is comprehensive, the architecture is solid, and the project structure is clean.

**Time to build something awesome!** 🚀

---

**Need more help?** Start with [01-FEATURE-OVERVIEW.md](./docs/01-FEATURE-OVERVIEW.md)
