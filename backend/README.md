# DevHub Backend - Spring Boot API Server

A comprehensive developer analytics platform backend built with Spring Boot 3.x, PostgreSQL, and GitHub API integration.

## 🎯 Features

### GitHub Analyzer
- Fetch and analyze GitHub repositories and commit history
- Calculate developer consistency scores and coding patterns
- Identify peak productivity hours and coding trends
- Generate actionable insights and fun facts
- Track language usage and diversity

### Project Graveyard
- Track abandoned/incomplete projects with detailed metadata
- Auto-detect inactive GitHub repositories
- Categorize abandonment reasons with statistics
- Reflect on failure patterns and learning opportunities
- "Revive" projects to track re-engagement

### Stack Decider
- Generate tech stack recommendations based on project needs
- Provide opinionated suggestions with reasoning
- Estimate project complexity and time-to-ship
- Detect overengineering risks
- Show alternative stacks with pros/cons

---

## 🏗️ Architecture

### Technology Stack
- **Runtime:** Java 17+
- **Framework:** Spring Boot 3.2
- **Database:** PostgreSQL 14+
- **Cache:** Redis (optional)
- **Authentication:** Spring Security + OAuth2 (GitHub)
- **API Documentation:** Swagger/OpenAPI 3.0
- **Build Tool:** Maven

### Project Structure
```
backend/
├── src/main/java/com/devhub/
│   ├── controller/          # REST endpoints
│   ├── service/             # Business logic
│   ├── repository/          # Data access layer
│   ├── entity/              # JPA entities
│   ├── dto/                 # Data transfer objects
│   ├── config/              # Spring configuration
│   ├── security/            # Auth & security
│   ├── exception/           # Custom exceptions
│   └── util/                # Utility classes
├── src/main/resources/
│   └── application.yml      # Configuration
├── pom.xml                  # Maven dependencies
└── README.md               # This file
```

---

## 🚀 Getting Started

### Prerequisites
- Java 17 or higher
- Maven 3.8+
- PostgreSQL 14+
- Git
- GitHub OAuth App credentials (for local development)

### 1. Clone & Setup

```bash
# Clone the repository
git clone https://github.com/yourusername/devhub.git
cd devhub/backend

# Create database
createdb devhub
createuser devhub_user -P  # Set password to: devhub_password
```

### 2. Initialize Database Schema

```bash
# Run SQL schema
psql -U devhub_user -d devhub -f ../database/schema.sql
```

### 3. Configure GitHub OAuth

1. Go to GitHub Settings → Developer settings → OAuth Apps
2. Create a new OAuth App:
   - **Application name:** DevHub Local Dev
   - **Homepage URL:** http://localhost:3000
   - **Authorization callback URL:** http://localhost:8080/api/login/oauth2/code/github
3. Copy Client ID and Client Secret

### 4. Update Configuration

Edit `src/main/resources/application.yml`:

```yaml
spring.security.oauth2.client.registration.github.client-id=YOUR_CLIENT_ID
spring.security.oauth2.client.registration.github.client-secret=YOUR_CLIENT_SECRET
app.jwt.secret=your-secret-key-min-32-chars
```

### 5. Build & Run

```bash
# Build the project
mvn clean package

# Run with Maven
mvn spring-boot:run

# Or run the JAR
java -jar target/devhub-backend-1.0.0-SNAPSHOT.jar
```

The server will start on `http://localhost:8080/api`

---

## 📚 API Documentation

### Swagger UI
Visit `http://localhost:8080/api/swagger-ui.html` to explore all endpoints interactively.

### Authentication Flow

1. **Login with GitHub:**
   ```
   GET /api/login/oauth2/authorization/github
   → Redirects to GitHub OAuth
   → Redirects back with code
   ```

2. **Get JWT Token:**
   ```
   POST /api/auth/github-callback?code={code}
   Response: { "token": "jwt_token", "user": {...} }
   ```

3. **Use Token in Requests:**
   ```
   Authorization: Bearer {jwt_token}
   ```

---

## 🔌 Core API Endpoints

### Authentication
- `POST /api/auth/github-callback` - GitHub OAuth callback
- `GET /api/auth/me` - Get current user
- `POST /api/auth/refresh` - Refresh JWT token
- `POST /api/auth/logout` - Logout

### GitHub Analyzer
- `POST /api/v1/github/analyze` - Trigger analysis
- `GET /api/v1/github/analysis` - Get latest analysis
- `GET /api/v1/github/heatmap` - Activity heatmap
- `GET /api/v1/github/languages` - Language breakdown
- `GET /api/v1/github/inactive` - Inactive repositories

### Project Graveyard
- `POST /api/v1/graveyard/projects` - Add abandoned project
- `GET /api/v1/graveyard/projects` - List all projects
- `GET /api/v1/graveyard/projects/{id}` - Get project details
- `PUT /api/v1/graveyard/projects/{id}` - Update project
- `DELETE /api/v1/graveyard/projects/{id}` - Delete project
- `PUT /api/v1/graveyard/projects/{id}/revive` - Revive project
- `GET /api/v1/graveyard/stats` - Statistics dashboard

### Stack Decider
- `POST /api/v1/stack-decider/recommend` - Generate recommendation
- `GET /api/v1/stack-decider/presets` - Get preset stacks
- `POST /api/v1/stack-decider/saved` - Save recommendation
- `GET /api/v1/stack-decider/my-stacks` - Get saved stacks

---

## 🔧 Development

### Running Tests
```bash
mvn test
```

### Code Style
- Follow Google Java Style Guide
- Use Lombok for boilerplate reduction
- Comprehensive Javadoc on public methods

### Debugging
```bash
# Run with debug flag
mvn spring-boot:run -Dspring-boot.run.jvmArguments="-Xdebug -Xrunjdwp:transport=dt_socket,server=y,suspend=y,address=5005"
```

### Database Migrations
We use Liquibase for schema versioning. Add changelogs to:
```
src/main/resources/db/changelog/
```

---

## 🚀 Deployment

### Docker
```bash
# Build Docker image
docker build -t devhub-backend:latest .

# Run with Docker Compose
docker-compose up
```

### Environment Variables
```
SPRING_DATASOURCE_URL=jdbc:postgresql://host:5432/devhub
SPRING_DATASOURCE_USERNAME=user
SPRING_DATASOURCE_PASSWORD=password
GITHUB_CLIENT_ID=xxx
GITHUB_CLIENT_SECRET=xxx
JWT_SECRET=xxx
```

### Production Checklist
- [ ] Set strong JWT secret
- [ ] Enable HTTPS
- [ ] Configure CORS properly
- [ ] Set up monitoring/alerting
- [ ] Enable audit logging
- [ ] Use encrypted credentials storage
- [ ] Set up automated backups
- [ ] Configure rate limiting

---

## 📊 Monitoring & Metrics

### Health Check
```
GET /api/actuator/health
```

### Metrics
```
GET /api/actuator/metrics
GET /api/actuator/metrics/{metric}
```

### Logs
- Location: `logs/` directory
- Level: Configured in `application.yml`
- Format: JSON (recommended for production)

---

## 🔐 Security Considerations

1. **GitHub Token Storage:**
   - Encrypted at rest
   - Never logged
   - Short-lived when possible

2. **JWT Tokens:**
   - 24-hour expiration
   - Refresh token rotation
   - Secure HttpOnly cookies (frontend)

3. **Rate Limiting:**
   - GitHub API: 5000 req/hour
   - Implement per-user limits

4. **CORS:**
   - Only allow trusted domains
   - Credentials: Include only when needed

---

## 🐛 Troubleshooting

### Connection to GitHub API fails
```
- Check internet connectivity
- Verify OAuth credentials in application.yml
- Check GitHub rate limits: https://api.github.com/rate_limit
```

### Database connection errors
```
- Verify PostgreSQL is running
- Check connection string in application.yml
- Ensure database and user exist: psql -l
```

### Port already in use
```
# Change port in application.yml:
server.port=8081
```

### Out of Memory
```bash
# Increase heap size
export JAVA_OPTS="-Xmx2g -Xms1g"
mvn spring-boot:run
```

---

## 📝 Contributing

1. Create feature branch: `git checkout -b feature/my-feature`
2. Commit changes: `git commit -am 'Add feature'`
3. Push branch: `git push origin feature/my-feature`
4. Create Pull Request

---

## 📄 License

MIT License - see LICENSE file

---

## 🤝 Support

For issues and questions:
- GitHub Issues: [Create issue](https://github.com/devhub/issues)
- Email: support@devhub.local
- Docs: [Full documentation](../docs/)

---

## 🎯 Roadmap

### MVP (Current)
- ✅ GitHub Analyzer (basic stats)
- ✅ Project Graveyard (manual entry)
- ✅ Stack Decider (rule-based)

### Phase 2
- 🔲 ML-powered insights
- 🔲 Automated GitHub sync
- 🔲 User comparison/rankings
- 🔲 Email digests

### Phase 3
- 🔲 Mobile app
- 🔲 Slack integration
- 🔲 AI chat recommendations
- 🔲 Learning paths

---

**Built with ❤️ by the DevHub team**
