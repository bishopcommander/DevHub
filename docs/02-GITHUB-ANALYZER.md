# GitHub Analyzer - Complete Feature Specification

## 📋 Overview

**Purpose:** Transform raw GitHub data into actionable insights about a developer's coding patterns, productivity, and growth.

**Key Insight:** Most developers write code but never analyze it. This feature is the mirror they didn't know they needed.

---

## 🎯 MVP Features

### 1. **Data Ingestion**
- ✅ Fetch user profile (name, bio, avatar, public repos count)
- ✅ Fetch all repositories (name, description, language, stars, forks)
- ✅ Fetch recent commits (last 1 year, grouped by repo)
- ✅ Language distribution
- ✅ Repository activity status (active/inactive)

### 2. **Analytics Engine**
- ✅ **Commit Patterns:** Daily/weekly activity heatmap
- ✅ **Peak Hours:** Most active coding time (by hour of day)
- ✅ **Language Stats:** Top languages, language diversification score
- ✅ **Consistency Score:** How regularly user commits (0-100)
- ✅ **Productivity Trend:** Activity over past 3/6/12 months
- ✅ **Repository Health:** Active vs. inactive repo count

### 3. **Insights Generation**
- ✅ Funky observations ("You code mostly at 2 AM")
- ✅ Productivity warnings ("You've been quiet for 30 days")
- ✅ Language recommendations ("You should explore [language]")
- ✅ Streak tracking ("15-day commit streak!")

---

## 🔌 Backend API Design

### Endpoints

#### 1. **Trigger Analysis** (Manual refresh or scheduled)
```
POST /api/v1/github/analyze
Headers: Authorization: Bearer {token}
Body: {} (or optional { force: true })

Response:
{
  "status": "analyzing",
  "jobId": "uuid",
  "estimatedTime": 30
}
```

#### 2. **Get Latest Analysis**
```
GET /api/v1/github/analysis
Headers: Authorization: Bearer {token}

Response:
{
  "userId": "uuid",
  "analyzedAt": "2026-05-06T10:00:00Z",
  "summary": {
    "totalRepos": 45,
    "totalCommits": 3200,
    "languages": ["Java", "TypeScript", "Python"],
    "consistencyScore": 78,
    "averageCommitsPerDay": 2.5
  },
  "insights": [
    {
      "type": "peak_hours",
      "value": "2-4 AM",
      "funFact": "You're a night owl! 62% of your commits are between midnight and 6 AM."
    },
    {
      "type": "language_diversity",
      "value": 12,
      "funFact": "You code in 12 different languages. Are you learning or exploring?"
    },
    {
      "type": "consistency",
      "value": 78,
      "trend": "up",
      "funFact": "Your consistency is improving! +5 points from last month."
    }
  ],
  "trends": {
    "last30Days": { "commits": 75, "avgPerDay": 2.5 },
    "last90Days": { "commits": 210, "avgPerDay": 2.3 },
    "last12Months": { "commits": 950, "avgPerDay": 2.6 }
  },
  "repositories": [
    {
      "name": "awesome-project",
      "language": "TypeScript",
      "commits": 250,
      "lastActivity": "2026-05-05T14:30:00Z",
      "status": "active",
      "daysInactive": 1
    }
  ]
}
```

#### 3. **Get Activity Heatmap**
```
GET /api/v1/github/heatmap?period=week|month|year
Headers: Authorization: Bearer {token}

Response:
{
  "data": [
    { "date": "2026-04-28", "hour": 0, "commits": 3 },
    { "date": "2026-04-28", "hour": 1, "commits": 0 },
    // ... 24 hours/day for period
  ],
  "stats": {
    "peakHour": 2,
    "peakDay": "Saturday",
    "busyDays": ["Friday", "Saturday", "Sunday"]
  }
}
```

#### 4. **Get Language Breakdown**
```
GET /api/v1/github/languages
Headers: Authorization: Bearer {token}

Response:
{
  "languages": [
    { "name": "Java", "bytes": 1500000, "percentage": 45, "repoCount": 12 },
    { "name": "TypeScript", "bytes": 800000, "percentage": 24, "repoCount": 8 },
    // ...
  ],
  "diversityScore": 7.5,
  "insight": "You're well-rounded across multiple languages."
}
```

#### 5. **Get Inactive Repositories**
```
GET /api/v1/github/inactive?daysThreshold=30
Headers: Authorization: Bearer {token}

Response:
{
  "inactiveRepos": [
    {
      "name": "old-project",
      "daysInactive": 450,
      "lastActivity": "2024-09-01T10:00:00Z",
      "language": "Python",
      "starCount": 12,
      "reason": null
    }
  ]
}
```

---

## 🗄️ Database Schema

### Tables

#### `github_analyses`
```sql
CREATE TABLE github_analyses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  analyzed_at TIMESTAMP DEFAULT NOW(),
  total_repos INT,
  total_commits INT,
  consistency_score INT CHECK (consistency_score >= 0 AND consistency_score <= 100),
  language_diversity_score DECIMAL(5,2),
  peak_coding_hour INT CHECK (peak_coding_hour >= 0 AND peak_coding_hour <= 23),
  peak_coding_day VARCHAR(20),
  average_commits_per_day DECIMAL(10,2),
  last_30_days_commits INT,
  last_90_days_commits INT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_github_analyses_user_id ON github_analyses(user_id);
CREATE INDEX idx_github_analyses_analyzed_at ON github_analyses(analyzed_at DESC);
```

#### `github_insights`
```sql
CREATE TABLE github_insights (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  analysis_id UUID NOT NULL REFERENCES github_analyses(id) ON DELETE CASCADE,
  insight_type VARCHAR(50) NOT NULL, -- 'peak_hours', 'language_diversity', 'consistency', etc.
  insight_value VARCHAR(255),
  insight_metric DECIMAL(10,2),
  fun_fact TEXT,
  trend VARCHAR(10), -- 'up', 'down', 'stable'
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_github_insights_analysis_id ON github_insights(analysis_id);
```

#### `github_activity_heatmap`
```sql
CREATE TABLE github_activity_heatmap (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  activity_date DATE NOT NULL,
  hour_of_day INT CHECK (hour_of_day >= 0 AND hour_of_day <= 23),
  commit_count INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, activity_date, hour_of_day)
);

CREATE INDEX idx_heatmap_user_date ON github_activity_heatmap(user_id, activity_date);
```

#### `github_repositories`
```sql
CREATE TABLE github_repositories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  github_repo_id BIGINT NOT NULL,
  name VARCHAR(255) NOT NULL,
  url VARCHAR(512),
  description TEXT,
  language VARCHAR(50),
  stars INT DEFAULT 0,
  forks INT DEFAULT 0,
  commit_count INT DEFAULT 0,
  last_commit_date TIMESTAMP,
  last_analyzed TIMESTAMP DEFAULT NOW(),
  is_active BOOLEAN DEFAULT true,
  days_inactive INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, github_repo_id)
);

CREATE INDEX idx_repos_user_id ON github_repositories(user_id);
CREATE INDEX idx_repos_last_analyzed ON github_repositories(last_analyzed DESC);
```

#### `github_language_stats`
```sql
CREATE TABLE github_language_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  analysis_id UUID NOT NULL REFERENCES github_analyses(id) ON DELETE CASCADE,
  language VARCHAR(50) NOT NULL,
  bytes BIGINT,
  percentage DECIMAL(5,2),
  repo_count INT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_language_stats_analysis_id ON github_language_stats(analysis_id);
```

---

## 🔧 Backend Services & Logic

### Core Services

```
com.devhub.github.service/
  ├── GitHubApiService
  │   ├── fetchUserProfile()
  │   ├── fetchRepositories()
  │   ├── fetchCommits()
  │   ├── fetchLanguages()
  │   └── detectInactiveRepos()
  │
  ├── AnalysisService
  │   ├── analyzeUser() [Main orchestrator]
  │   ├── calculateConsistencyScore()
  │   ├── calculateLanguageDiversity()
  │   ├── identifyPeakHours()
  │   ├── generateInsights()
  │   └── updateHeatmap()
  │
  ├── InsightGeneratorService
  │   ├── generateFunFact(type, data)
  │   ├── generatePeakHourInsight()
  │   ├── generateLanguageInsight()
  │   ├── generateConsistencyInsight()
  │   └── generateProductivityTrendInsight()
  │
  └── CacheService
      ├── cacheAnalysis()
      ├── getCachedAnalysis()
      └── invalidateCache()
```

### Key Algorithms

#### Consistency Score (0-100)
```
- Check last 365 days
- Count days with at least 1 commit
- Calculate streak (current continuous streak bonus: +5 to +15)
- Calculate frequency variance (penalty for irregular patterns)
- Final: (commitDays / 365) * 100 + streakBonus - variancePenalty
```

#### Language Diversity Score
```
- Number of unique languages used
- Weighted by commit percentage
- Formula: sqrt(uniqueLanguages) * (1 + variance)
- Range: 1-10 (10 = extremely diverse)
```

#### Peak Hour Detection
```
- Group commits by hour of day
- Find hour with max commits
- If tied, pick earliest time
- Mark if statistically significant (>2 std dev from mean)
```

---

## 💡 Frontend Components

### Pages/Views

1. **Dashboard**
   - Quick stats cards (Total repos, commits, consistency score)
   - Consistency meter (circular progress)
   - Recent activity chart (line graph)
   - "Fun facts" carousel

2. **Heatmap View**
   - Calendar heatmap (commits by day)
   - Hour-of-day distribution (bar chart)
   - Peak hours badge

3. **Language Stats**
   - Language breakdown (pie/donut chart)
   - Diversity score visual
   - Language recommendations

4. **Repositories**
   - List of repos with activity status
   - Sort/filter options
   - Quick links to GitHub

5. **Trends**
   - 30/90/365 day comparison charts
   - Consistency trend line
   - Productivity alerts

### UI Components

```
<StatCard /> - Shows metric + trend
<InsightCard /> - Displays fun facts
<ActivityHeatmap /> - Calendar visualization
<ConsistencyMeter /> - Circular progress indicator
<RepositoryCard /> - Repo summary with activity badge
<TrendChart /> - Line/bar charts
<LoadingState /> - Skeleton/spinner during analysis
<EmptyState /> - When no data yet
```

---

## 🎯 MVP Checklist

- [x] GitHub OAuth flow (already done in user auth)
- [x] Fetch user repos + commits
- [x] Calculate basic metrics
- [x] Generate 3-5 standard insights
- [x] Build dashboard view
- [x] Cache analysis results (30 min TTL)
- [x] Error handling + retry logic

---

## 🚀 Advanced Features (Phase 2+)

- 🤖 **ML-based anomaly detection** (unusual commit patterns = burnout warning)
- 📈 **Skill trajectory tracking** (learning curves for languages)
- 🏆 **Comparative analytics** (percentile ranking vs other users)
- 🔮 **Predictive insights** (estimated burnout date, project success probability)
- 🎯 **Goal setting** (set consistency targets, get reminders)
- 📧 **Weekly digest emails** (highlights + trends)

---

## 🛡️ Considerations

### Rate Limiting
- GitHub API: 5000 requests/hour authenticated
- Cache analyses for 30+ min
- Implement exponential backoff

### Privacy
- Only fetch public data
- Don't store tokens permanently
- Log what data was accessed

### Error Handling
- Graceful degradation if API fails
- Show cached data if available
- Clear error messages to user

### Performance
- Fetch and analyze happens in background job
- Don't block UI during analysis (show "analyzing..." state)
- Paginate repo fetching if user has 100+ repos
