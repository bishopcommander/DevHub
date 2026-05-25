# Project Graveyard - Complete Feature Specification

## 📋 Overview

**Purpose:** Help developers learn from abandoned projects and reflect on failure patterns instead of feeling shame.

**Why it works:** Developers rarely quantify why they fail. This gamifies failure as learning data.

---

## 🎯 MVP Features

### 1. **Manual Entry**
- ✅ Add abandoned project with: name, language, start date, end date, GitHub URL (optional)
- ✅ Select 1+ abandonment reasons (tags: lost interest, too complex, no time, tutorial hell, scope creep, team issues, burnout)
- ✅ Optional reflection notes (what would you do differently?)
- ✅ Estimated hours spent on project

### 2. **Project Management**
- ✅ View all abandoned projects (table/card view)
- ✅ Edit project details + reasons
- ✅ Delete project (with confirmation)
- ✅ Mark project as "Revived" (move back to active)

### 3. **Statistics & Insights**
- ✅ Total projects abandoned + average lifespan
- ✅ Most common abandonment reasons (pie chart)
- ✅ Time distribution (how long before abandonment)
- ✅ Language analysis (which languages have highest fail rate)
- ✅ "Resurrection streak" (projects revived this month)

### 4. **Auto-Detection (Optional MVP+)**
- ✅ Scan user's GitHub repos
- ✅ Flag inactive repos (no commits for 30/90/180 days)
- ✅ Suggest adding them to graveyard with 1-click action

---

## 🔌 Backend API Design

### Endpoints

#### 1. **Create Abandoned Project**
```
POST /api/v1/graveyard/projects
Headers: Authorization: Bearer {token}
Body:
{
  "projectName": "awesome-saas-idea",
  "language": "TypeScript",
  "startDate": "2024-01-15",
  "endDate": "2024-06-30",
  "hoursSpent": 120,
  "abandonmentReasons": ["lost_interest", "scope_creep"],
  "githubUrl": "https://github.com/user/repo",
  "reflectionNotes": "Tried to build too much at once. Should have MVP'd first.",
  "projectType": "side-project"  // or "work", "learning"
}

Response:
{
  "id": "uuid",
  "status": "created",
  "project": { /* full project object */ }
}
```

#### 2. **Get All Abandoned Projects**
```
GET /api/v1/graveyard/projects?sort=newest|oldest|duration
Headers: Authorization: Bearer {token}

Response:
{
  "projects": [
    {
      "id": "uuid",
      "projectName": "awesome-saas-idea",
      "language": "TypeScript",
      "startDate": "2024-01-15",
      "endDate": "2024-06-30",
      "durationDays": 167,
      "durationDisplay": "5 months 12 days",
      "hoursSpent": 120,
      "abandonmentReasons": ["lost_interest", "scope_creep"],
      "githubUrl": "https://github.com/user/repo",
      "reflectionNotes": "...",
      "projectType": "side-project",
      "createdAt": "2026-04-01T10:00:00Z",
      "status": "abandoned"
    }
  ],
  "totalCount": 15,
  "averageDuration": 92  // days
}
```

#### 3. **Get Graveyard Statistics**
```
GET /api/v1/graveyard/stats
Headers: Authorization: Bearer {token}

Response:
{
  "totalAbandoned": 15,
  "totalRevived": 2,
  "totalHoursSpent": 1240,
  "averageDurationDays": 92,
  "averageHoursPerProject": 82,
  "abandonmentReasons": [
    { "reason": "lost_interest", "count": 7, "percentage": 47 },
    { "reason": "too_complex", "count": 4, "percentage": 27 },
    { "reason": "no_time", "count": 3, "percentage": 20 },
    { "reason": "tutorial_hell", "count": 1, "percentage": 6 }
  ],
  "durationDistribution": {
    "lessThan1Week": 2,
    "1To4Weeks": 4,
    "1To3Months": 5,
    "3To6Months": 3,
    "moreThan6Months": 1
  },
  "languageStats": [
    { "language": "TypeScript", "abandoned": 5, "failRate": 0.45 },
    { "language": "Python", "abandoned": 4, "failRate": 0.33 },
    { "language": "Java", "abandoned": 2, "failRate": 0.20 }
  ],
  "insights": [
    {
      "type": "pattern",
      "message": "You abandon 47% of projects due to lost interest. Try starting smaller, more focused projects."
    },
    {
      "type": "encouragement",
      "message": "You revived 2 projects this year! That's awesome persistence."
    }
  ]
}
```

#### 4. **Revive Project** (Mark as active again)
```
PUT /api/v1/graveyard/projects/{id}/revive
Headers: Authorization: Bearer {token}
Body:
{
  "reviveDate": "2026-05-06",
  "newGoals": "Focus on MVP with just auth + core feature"
}

Response:
{
  "id": "uuid",
  "status": "active",
  "revivedAt": "2026-05-06T10:00:00Z",
  "project": { /* updated project */ }
}
```

#### 5. **Get Revision History** (See past state of project)
```
GET /api/v1/graveyard/projects/{id}/history
Headers: Authorization: Bearer {token}

Response:
{
  "events": [
    { "type": "created", "date": "2024-01-15" },
    { "type": "abandoned", "date": "2024-06-30", "reason": "lost_interest" },
    { "type": "revived", "date": "2026-05-06" },
    { "type": "abandoned_again", "date": "2026-05-20" }
  ]
}
```

#### 6. **Auto-Detect Inactive Repos** (Optional)
```
GET /api/v1/graveyard/detect-inactive?daysThreshold=30
Headers: Authorization: Bearer {token}

Response:
{
  "inactiveRepos": [
    {
      "repoName": "old-project",
      "language": "Python",
      "daysInactive": 450,
      "lastCommit": "2024-09-01T10:00:00Z",
      "suggestAbandon": true
    }
  ]
}

POST /api/v1/graveyard/projects/from-repo
Headers: Authorization: Bearer {token}
Body:
{
  "githubUrl": "https://github.com/user/old-project",
  "abandonmentReasons": ["lost_interest"],
  "startDate": "2023-01-01",
  "endDate": "2024-09-01"
}
```

---

## 🗄️ Database Schema

### Tables

#### `graveyard_projects`
```sql
CREATE TABLE graveyard_projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  project_name VARCHAR(255) NOT NULL,
  description TEXT,
  language VARCHAR(50),
  github_url VARCHAR(512),
  project_type VARCHAR(50), -- 'side-project', 'work', 'learning'
  
  -- Timeline
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  hours_spent INT DEFAULT 0,
  duration_days INT GENERATED ALWAYS AS (end_date - start_date) STORED,
  
  -- Status
  status VARCHAR(20) NOT NULL DEFAULT 'abandoned', -- 'abandoned', 'active', 'completed'
  revived_at TIMESTAMP,
  revive_count INT DEFAULT 0,
  
  -- Reflection
  reflection_notes TEXT,
  lessons_learned TEXT,
  what_i_would_do_differently TEXT,
  
  -- Metadata
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  archived_at TIMESTAMP
);

CREATE INDEX idx_graveyard_projects_user_id ON graveyard_projects(user_id);
CREATE INDEX idx_graveyard_projects_status ON graveyard_projects(status);
CREATE INDEX idx_graveyard_projects_created_at ON graveyard_projects(created_at DESC);
```

#### `graveyard_abandonment_reasons`
```sql
CREATE TABLE graveyard_abandonment_reasons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES graveyard_projects(id) ON DELETE CASCADE,
  reason VARCHAR(50) NOT NULL, -- 'lost_interest', 'too_complex', 'no_time', 'tutorial_hell', 'scope_creep', 'team_issues', 'burnout'
  weight INT DEFAULT 1, -- Allow marking certain reasons as more important
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_reasons_project_id ON graveyard_abandonment_reasons(project_id);
```

#### `graveyard_project_history` (Audit trail)
```sql
CREATE TABLE graveyard_project_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES graveyard_projects(id) ON DELETE CASCADE,
  status_before VARCHAR(20),
  status_after VARCHAR(20),
  event_type VARCHAR(50), -- 'created', 'abandoned', 'revived', 'updated', 'completed'
  changes JSONB, -- Store what changed
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_history_project_id ON graveyard_project_history(project_id);
```

#### `graveyard_reflection_prompts` (Pre-filled templates)
```sql
CREATE TABLE graveyard_reflection_prompts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  prompt_text TEXT NOT NULL,
  category VARCHAR(50), -- 'what_worked', 'what_failed', 'next_time'
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Pre-populate with standard prompts
INSERT INTO graveyard_reflection_prompts (prompt_text, category) VALUES
('What was the main blocker?', 'what_failed'),
('How long could you have continued?', 'what_failed'),
('Would you restart this with a different approach?', 'what_worked'),
('What did you learn from this?', 'what_worked');
```

---

## 🔧 Backend Services & Logic

### Core Services

```
com.devhub.graveyard.service/
  ├── GraveyardProjectService
  │   ├── addAbandonedProject()
  │   ├── updateProject()
  │   ├── reviveProject()
  │   ├── getAllProjects()
  │   ├── getProjectById()
  │   └── deleteProject()
  │
  ├── GraveyardAnalyticsService
  │   ├── calculateStats()
  │   ├── getAbandonmentReasonStats()
  │   ├── getLanguageFailureRates()
  │   ├── getDurationDistribution()
  │   ├── generateInsights()
  │   └── calculateResurrectionStreak()
  │
  ├── GraveyardAutoDetectionService
  │   ├── detectInactiveRepos()
  │   ├── suggestAbandonment()
  │   └── autoCreateFromRepo()
  │
  └── GraveyardHistoryService
      ├── recordEvent()
      ├── getProjectHistory()
      └── getRevisionTimeline()
```

### Key Logic

#### Statistics Calculation
```
totalAbandoned = COUNT(projects WHERE status='abandoned')
totalHoursSpent = SUM(hours_spent)
averageDuration = AVG(end_date - start_date)
mostCommonReason = MODE(abandonment_reasons.reason)
languageFailRate = abandoned_projects_with_lang / total_projects_with_lang
resurrectStreak = COUNT(revived_at >= DATE_SUB(NOW(), INTERVAL 30 DAY))
```

#### Insights Generation Rules
```
IF abandoned_count > 10 AND most_common_reason = 'lost_interest'
  → "You might benefit from building smaller projects"

IF total_abandoned > 5 AND resurrect_count > 0
  → "You're learning from past projects - keep going!"

IF average_duration < 14 days
  → "Most of your projects last less than 2 weeks. Try more planning upfront."

IF language_fail_rate[language] > 0.6
  → "You abandon {language} projects more than average. Is it a good fit for you?"
```

---

## 💡 Frontend Components

### Pages/Views

1. **Graveyard Dashboard**
   - Stats cards (Total abandoned, total hours, avg duration)
   - "Reasons" pie chart
   - Timeline visualization (when projects die)
   - Quick action: "+ Add Abandoned Project"

2. **Projects List**
   - Table/card grid of all abandoned projects
   - Columns: Name, Language, Duration, Reasons, Actions
   - Sort/filter by language, duration, reason, date
   - Quick "Revive" button on each

3. **Project Detail**
   - Full project info
   - Abandonment story (reasons + reflection)
   - Timeline/history
   - "Revive" action
   - "Edit" / "Delete" options

4. **Add/Edit Project Form**
   - Project name, language, dates
   - Multi-select for reasons (with explanations)
   - Hours spent slider
   - Reflection prompts
   - GitHub URL (optional, can auto-fill some fields)

5. **Statistics Dashboard**
   - Key metrics cards
   - Abandonment reasons breakdown (pie/bar chart)
   - Language failure rates
   - Time-to-abandonment distribution
   - Insights carousel
   - "Resurrection Challenge" CTA

6. **Project History/Timeline** (Modal or detail page)
   - Event timeline showing status changes
   - When revived, when re-abandoned, etc.

### UI Components

```
<StatCard /> - Big number + trend
<ReasonBadge /> - Tag for abandonment reason
<ProjectCard /> - Project summary (card or row)
<DurationBadge /> - How long project lasted
<InsightCard /> - Fun fact or alert
<ReflectionPrompt /> - Template text for reflection
<ReviveConfirmationModal /> - "Are you sure?"
<AutoDetectModal /> - "Found X inactive repos"
<TimelineVisualization /> - Project lifecycle view
```

---

## 🎯 MVP Checklist

- [x] Create project form (name, language, dates, reasons, reflection)
- [x] List view with filtering/sorting
- [x] Statistics dashboard
- [x] Calculate basic analytics
- [x] Revive functionality
- [x] Delete/Archive projects
- [x] Reflection notes storage
- [x] Pretty UI for reasons (color-coded tags)

---

## 🚀 Advanced Features (Phase 2+)

- 📊 **Pattern recognition:** "Your projects fail faster when you use framework X"
- 🎯 **Success prediction:** "Based on similar projects, you have 30% chance of success"
- 🏆 **Comparison:** "You abandon projects more frequently than {X}% of users"
- 📧 **Monthly email:** "Here's your graveyard report"
- 🤖 **AI reflection:** Auto-generate reflection suggestions based on project type
- 📈 **Learning path:** "To improve success rate, try: smaller scope, more planning"
- 🔄 **Automatic GitHub sync:** Continuously scan for newly inactive repos
- 🎪 **Graveyard events:** "Resurrection week - revive a project and get rewarded"

---

## 💭 Reflection Prompts (Pre-populated)

### What Worked
- "What aspect of this project did you enjoy most?"
- "What did you learn that you'll apply to future projects?"
- "If you were to restart, what would you keep the same?"

### What Failed
- "What was the main reason you abandoned this?"
- "At what point did you lose momentum?"
- "What would have helped you continue?"

### Next Time
- "Would you restart this with a different tech stack?"
- "How would you scope this project differently?"
- "What's the simplest version of this idea?"

---

## 🛡️ Considerations

### Data Privacy
- Only show projects user created
- Don't expose other users' graveyards (no leaderboards of shame!)
- Allow archiving old projects instead of delete

### Motivation
- Celebrate revived projects
- Show positive insights
- Don't shame, educate
- "Abandonment is learning" messaging

### Gamification (Light)
- Resurrection streak counter
- "Hours invested" badge
- "Most common failure" badge (with humor)

---

## Example Use Cases

### User 1: The Endless Learner
- Abandoned 20+ learning projects
- Stats show: 90% reason = "tutorial hell"
- Insight: "You're learning frameworks, not building products. Try building one full project."

### User 2: The Overachiever
- 5 projects, avg 2 weeks each, all different languages
- Stats show: Complex projects abandoned in 2 weeks
- Insight: "You have ambitious ideas but scope creep fast. Try an MVP checklist."

### User 3: The Persistent One
- 8 abandoned, 3 revived and completed
- Stats show: 37% resurrection rate
- Insight: "You come back to projects! Great sign of persistence."
