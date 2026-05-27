# DevHub - Developer Analytics & Insights Platform

<div align="center">

### 🎯 "Spotify Wrapped for Developers"

A developer-focused platform that transforms GitHub data into actionable insights, tracks abandoned projects, and helps you make better tech stack decisions.

[Live Demo](#) • [Documentation](./docs/01-FEATURE-OVERVIEW.md) • [GitHub](#) • [Report Issue](#)

</div>

---

## 📦 What is DevHub?

DevHub is a comprehensive platform designed to help developers understand their coding patterns, reflect on failed projects, and make confident tech stack decisions. It combines analytics, self-reflection, and practical decision-making tools into one cohesive experience.

**Think of it as:**
- 📊 **Spotify Wrapped** but for your GitHub activity
- 🪦 **Project Graveyard** for learning from abandoned projects
- 🛠️ **Stack Decision Engine** to end analysis paralysis

---

## 🎮 Three Core Features

### 1. **GitHub Analyzer** 📈
Transform raw GitHub data into meaningful insights about your coding patterns.

**What it does:**
- Analyze your repositories, commits, and languages
- Detect your peak productivity hours
- Calculate consistency scores
- Generate fun facts ("You're a night owl coder!")
- Track your tech stack evolution

[→ Full Documentation](./docs/02-GITHUB-ANALYZER.md)

---

### 2. **Project Graveyard** 🪦
Learn from abandoned projects instead of feeling shame about them.

**What it does:**
- Manually log projects you started but didn't finish
- Tag reasons for abandonment (lost interest, too complex, no time, etc.)
- Auto-detect inactive GitHub repositories
- View statistics on failure patterns
- "Revive" projects to track re-engagement

[→ Full Documentation](./docs/03-PROJECT-GRAVEYARD.md)

---

### 3. **Stack Decider** 🛠️
Get confident, opinionated tech stack recommendations.

**What it does:**
- Answer a few questions about your project
- Get personalized frontend, backend, and database suggestions
- See complexity estimates and time-to-ship
- Discover overengineering risks
- Compare alternative stacks

[→ Full Documentation](./docs/04-STACK-DECIDER.md)

---

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                      Frontend (React)                        │
│  Dashboard | Analyzer | Graveyard | Stack Decider | Profile │
└─────────────────────┬───────────────────────────────────────┘
                      │ REST API
┌─────────────────────┴───────────────────────────────────────┐
│                  Backend (Spring Boot)                       │
│  Auth │ GitHub Analyzer │ Graveyard │ Stack Decider │ Cache │
└─────────────────────┬───────────────────────────────────────┘
                      │ SQL
┌─────────────────────┴───────────────────────────────────────┐
│              PostgreSQL Database                             │
│  Users │ Analyses │ Projects │ Recommendations │ Analytics   │
└─────────────────────────────────────────────────────────────┘
```

---

## 🚀 Quick Start

### Option 1: Full Stack Setup (Recommended)

```bash
# Clone repository
git clone https://github.com/devhub/devhub.git
cd devhub

# Setup backend
cd backend
mvn clean install
mvn spring-boot:run

# In new terminal, setup frontend
cd frontend
npm install
npm run dev
```

### Option 2: Backend Only

```bash
cd backend
# See backend/README.md for detailed setup
mvn spring-boot:run
```

### Option 3: Frontend Only (Mock Data)

```bash
cd frontend
npm install
npm run dev
```

---

## 📋 Prerequisites

- **Node.js** 18+ (for frontend)
- **Java** 17+ (for backend)
- **PostgreSQL** 14+ (for database)
- **Git**

### GitHub OAuth Setup (Development)

1. Go to GitHub Settings → Developer settings → OAuth Apps
2. Create new OAuth App:
   - **Homepage URL:** http://localhost:3000
   - **Callback URL:** http://localhost:8080/api/login/oauth2/code/github
3. Copy credentials to `.env` (frontend) and `application.yml` (backend)

---

## 📂 Project Structure

```
devhub/
├── docs/                           # Feature documentation
│   ├── 01-FEATURE-OVERVIEW.md     # Product vision & strategy
│   ├── 02-GITHUB-ANALYZER.md      # GitHub Analyzer spec
│   ├── 03-PROJECT-GRAVEYARD.md    # Project Graveyard spec
│   └── 04-STACK-DECIDER.md        # Stack Decider spec
│
├── backend/                        # Spring Boot API
│   ├── src/main/java/com/devhub/
│   │   ├── controller/            # REST endpoints
│   │   ├── service/               # Business logic
│   │   ├── entity/                # Database entities
│   │   ├── repository/            # Data access
│   │   ├── config/                # Spring config
│   │   └── ...
│   ├── src/main/resources/
│   │   └── application.yml        # Configuration
│   ├── pom.xml                    # Maven config
│   └── README.md                  # Backend setup guide
│
├── frontend/                       # React application
│   ├── src/
│   │   ├── pages/                 # Route pages
│   │   ├── components/            # React components
│   │   ├── hooks/                 # Custom hooks
│   │   ├── store/                 # State management
│   │   ├── services/              # API clients
│   │   ├── types/                 # TypeScript types
│   │   └── styles/                # Global styles
│   ├── package.json               # NPM config
│   └── README.md                  # Frontend setup guide
│
├── database/                       # Database schema
│   ├── schema.sql                 # Complete DDL
│   ├── migrations/                # Liquibase changesets
│   └── seeds/                     # Test data
│
└── README.md                       # This file
```

---

## 🔧 Configuration

### Backend (`backend/src/main/resources/application.yml`)

```yaml
# Database
spring.datasource.url=jdbc:postgresql://localhost:5432/devhub
spring.datasource.username=devhub_user
spring.datasource.password=devhub_password

# GitHub OAuth
spring.security.oauth2.client.registration.github.client-id=YOUR_ID
spring.security.oauth2.client.registration.github.client-secret=YOUR_SECRET

# JWT
app.jwt.secret=your-secret-min-32-chars
app.jwt.expiration=86400000
```

### Frontend (`.env`)

```
VITE_API_URL=http://localhost:8080/api
VITE_GITHUB_CLIENT_ID=YOUR_ID
```

---

## 📊 Database Schema

The database includes tables for:
- **Users:** GitHub profiles and authentication
- **GitHub Analyses:** Periodic analyses and metrics
- **Graveyard Projects:** Abandoned projects with metadata
- **Stack Recommendations:** Generated suggestions and history

[→ Full Schema](./database/schema.sql)

---

## 🔌 API Reference

### Authentication
```
POST   /api/auth/github-callback?code=xxx
GET    /api/auth/me
POST   /api/auth/refresh
POST   /api/auth/logout
```

### GitHub Analyzer
```
POST   /api/v1/github/analyze
GET    /api/v1/github/analysis
GET    /api/v1/github/heatmap
GET    /api/v1/github/languages
GET    /api/v1/github/inactive
```

### Project Graveyard
```
POST   /api/v1/graveyard/projects
GET    /api/v1/graveyard/projects
GET    /api/v1/graveyard/projects/{id}
PUT    /api/v1/graveyard/projects/{id}
DELETE /api/v1/graveyard/projects/{id}
PUT    /api/v1/graveyard/projects/{id}/revive
GET    /api/v1/graveyard/stats
```

### Stack Decider
```
POST   /api/v1/stack-decider/recommend
GET    /api/v1/stack-decider/presets
POST   /api/v1/stack-decider/saved
GET    /api/v1/stack-decider/my-stacks
```

[→ Full API Docs (Swagger)](http://localhost:8080/api/swagger-ui.html)

---

## 🎯 Features

### MVP (Current)
- ✅ GitHub OAuth authentication
- ✅ GitHub repository analysis
- ✅ Commit pattern detection
- ✅ Manual project abandonment tracking
- ✅ Rule-based stack recommendations
- ✅ Basic statistics and charts

### Phase 2
- 🔲 Auto-GitHub repo detection
- 🔲 ML-powered insights
- 🔲 User comparison/rankings
- 🔲 Email digests
- 🔲 Advanced filtering

### Phase 3
- 🔲 Mobile app
- 🔲 Slack/Discord integration
- 🔲 AI chat assistant
- 🔲 Learning path recommendations
- 🔲 Team insights

---

## 🛠️ Development

### Running Locally

```bash
# Terminal 1: Backend
cd backend
mvn clean install
mvn spring-boot:run

# Terminal 2: Frontend
cd frontend
npm install
npm run dev

# Terminal 3: Database (optional PostgreSQL)
postgres -D /usr/local/var/postgres
```

### Backend Development

```bash
# Run tests
mvn test

# Build
mvn clean package

# Code formatting
mvn spotless:apply
```

### Frontend Development

```bash
# Start dev server
npm run dev

# Run tests
npm test

# Build for production
npm run build

# Preview production build
npm run preview
```

---

## 📈 Performance & Scalability

### Optimization Strategies
- **Caching:** Redis for frequent queries
- **Batch Processing:** Async GitHub analysis jobs
- **Pagination:** Large result sets paginated
- **Indexes:** Strategic database indexes
- **CDN:** Static assets served via CDN

### Load Testing
```bash
# Backend load test
ab -n 1000 -c 100 http://localhost:8080/api/health
```

---

## 🔐 Security

### Authentication
- GitHub OAuth 2.0 with PKCE
- JWT tokens with 24-hour expiration
- Secure refresh token rotation

### Data Protection
- GitHub tokens encrypted at rest
- User data isolation per tenant
- HTTPS enforced (production)
- CORS whitelist configured

### Best Practices
- Regular dependency updates
- Security headers configured
- SQL injection prevention (prepared statements)
- Rate limiting on API endpoints

---

## 🐛 Troubleshooting

### Backend Issues

**Connection refused on :8080**
```bash
# Check if port is in use
lsof -i :8080

# Use different port
export SERVER_PORT=8081
mvn spring-boot:run
```

**Database connection error**
```bash
# Check PostgreSQL is running
psql -l

# Verify credentials in application.yml
# Recreate database if needed
dropdb devhub && createdb devhub
```

### Frontend Issues

**CORS errors**
```javascript
// Check proxy in package.json
"proxy": "http://localhost:8080/api"

// Or configure in vite.config.ts
server: {
  proxy: {
    '/api': 'http://localhost:8080'
  }
}
```

**Port 3000 already in use**
```bash
# Use different port
npm run dev -- --port 3001
```

### Database Issues

**Schema migration failed**
```bash
# Re-initialize
psql -U devhub_user -d devhub < database/schema.sql

# Or check Liquibase changelogs
ls database/migrations/
```

---

## 📚 Learning Resources

- [GitHub API Documentation](https://docs.github.com/en/rest)
- [Spring Boot Guide](https://spring.io/guides/gs/spring-boot/)
- [React Documentation](https://react.dev)
- [PostgreSQL Manual](https://www.postgresql.org/docs/)

---

## 🤝 Contributing

We welcome contributions! Here's how:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### Development Guidelines
- Follow the code style in [CONTRIBUTING.md](./CONTRIBUTING.md)
- Add tests for new features
- Update documentation
- Keep commits atomic and well-described

---

## 📝 License

MIT License © 2024 DevHub Contributors

See [LICENSE](./LICENSE) file for details.

---

## 🙏 Acknowledgments

- GitHub API for providing powerful data access
- Spring Boot community for excellent framework
- React team for amazing frontend library
- All contributors and users

---

## 🎯 Vision & Roadmap

DevHub is building the future of developer self-reflection and growth. Our mission:

> *Help developers understand themselves better through data, learn from their experiences, and make confident decisions about their projects and growth path.*

### Coming Soon
- Real-time notifications
- AI-powered recommendations
- Collaborative team features
- API for third-party integrations
- Offline-first mobile app

---

<div align="center">

**Built with ❤️ by developers, for developers**

[Star us on GitHub](https://github.com/bishopcommander/DevHub)

</div>
