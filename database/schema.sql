-- DevHub Database Schema
-- PostgreSQL 14+
-- Run this to set up the complete database

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "btree_gin";

-- ============================================
-- CORE TABLES
-- ============================================

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  github_id BIGINT UNIQUE NOT NULL,
  github_username VARCHAR(255) UNIQUE NOT NULL,
  github_name VARCHAR(255),
  github_avatar_url VARCHAR(512),
  github_bio TEXT,
  github_company VARCHAR(255),
  github_location VARCHAR(255),
  github_blog VARCHAR(255),
  github_public_repos INT DEFAULT 0,
  github_followers INT DEFAULT 0,
  github_following INT DEFAULT 0,
  
  -- Authentication
  github_access_token VARCHAR(512), -- Encrypted in production
  token_expires_at TIMESTAMP,
  
  -- User preferences
  email VARCHAR(255),
  is_active BOOLEAN DEFAULT true,
  last_login TIMESTAMP,
  
  -- Metadata
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_users_github_id ON users(github_id);
CREATE INDEX idx_users_github_username ON users(github_username);
CREATE INDEX idx_users_is_active ON users(is_active);

-- ============================================
-- GITHUB ANALYZER TABLES
-- ============================================

CREATE TABLE IF NOT EXISTS github_analyses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
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
  last_365_days_commits INT,
  commit_streak_days INT DEFAULT 0,
  max_streak_days INT DEFAULT 0,
  status VARCHAR(20) DEFAULT 'completed', -- 'analyzing', 'completed', 'failed'
  error_message TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_github_analyses_user_id ON github_analyses(user_id);
CREATE INDEX idx_github_analyses_analyzed_at ON github_analyses(analyzed_at DESC);

-- GitHub Insights
CREATE TABLE IF NOT EXISTS github_insights (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  analysis_id UUID NOT NULL REFERENCES github_analyses(id) ON DELETE CASCADE,
  insight_type VARCHAR(50) NOT NULL,
  insight_value VARCHAR(255),
  insight_metric DECIMAL(10,2),
  fun_fact TEXT,
  trend VARCHAR(10),
  priority INT DEFAULT 0, -- 1=high, 2=medium, 3=low
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_github_insights_analysis_id ON github_insights(analysis_id);
CREATE INDEX idx_github_insights_type ON github_insights(insight_type);

-- Activity Heatmap
CREATE TABLE IF NOT EXISTS github_activity_heatmap (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  activity_date DATE NOT NULL,
  hour_of_day INT CHECK (hour_of_day >= 0 AND hour_of_day <= 23),
  commit_count INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, activity_date, hour_of_day)
);

CREATE INDEX idx_heatmap_user_id ON github_activity_heatmap(user_id);
CREATE INDEX idx_heatmap_user_date ON github_activity_heatmap(user_id, activity_date);

-- GitHub Repositories
CREATE TABLE IF NOT EXISTS github_repositories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
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
  is_fork BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, github_repo_id)
);

CREATE INDEX idx_repos_user_id ON github_repositories(user_id);
CREATE INDEX idx_repos_is_active ON github_repositories(is_active);
CREATE INDEX idx_repos_language ON github_repositories(language);

-- Language Stats
CREATE TABLE IF NOT EXISTS github_language_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  analysis_id UUID NOT NULL REFERENCES github_analyses(id) ON DELETE CASCADE,
  language VARCHAR(50) NOT NULL,
  bytes BIGINT,
  percentage DECIMAL(5,2),
  repo_count INT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_language_stats_analysis_id ON github_language_stats(analysis_id);
CREATE INDEX idx_language_stats_language ON github_language_stats(language);

-- ============================================
-- PROJECT GRAVEYARD TABLES
-- ============================================

CREATE TABLE IF NOT EXISTS graveyard_projects (
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
  status VARCHAR(20) NOT NULL DEFAULT 'abandoned',
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
CREATE INDEX idx_graveyard_projects_language ON graveyard_projects(language);

-- Abandonment Reasons
CREATE TABLE IF NOT EXISTS graveyard_abandonment_reasons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES graveyard_projects(id) ON DELETE CASCADE,
  reason VARCHAR(50) NOT NULL,
  weight INT DEFAULT 1,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_abandonment_reasons_project_id ON graveyard_abandonment_reasons(project_id);
CREATE INDEX idx_abandonment_reasons_reason ON graveyard_abandonment_reasons(reason);

-- Project History (Audit Trail)
CREATE TABLE IF NOT EXISTS graveyard_project_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES graveyard_projects(id) ON DELETE CASCADE,
  status_before VARCHAR(20),
  status_after VARCHAR(20),
  event_type VARCHAR(50),
  changes JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_history_project_id ON graveyard_project_history(project_id);
CREATE INDEX idx_history_created_at ON graveyard_project_history(created_at DESC);

-- ============================================
-- STACK DECIDER TABLES
-- ============================================

CREATE TABLE IF NOT EXISTS stack_recommendations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  
  -- Input
  project_idea TEXT NOT NULL,
  project_type VARCHAR(50) NOT NULL,
  primary_goal VARCHAR(50) NOT NULL,
  scale VARCHAR(20) NOT NULL,
  preferred_languages VARCHAR[],
  budget VARCHAR(50),
  
  -- Recommendation
  frontend_framework VARCHAR(100),
  frontend_language VARCHAR(50),
  frontend_reasoning TEXT,
  
  backend_runtime VARCHAR(100),
  backend_framework VARCHAR(100),
  backend_language VARCHAR(50),
  backend_reasoning TEXT,
  
  database_primary VARCHAR(100),
  database_cache VARCHAR(100),
  database_reasoning TEXT,
  
  complexity_level VARCHAR(20),
  complexity_reasoning TEXT,
  
  time_to_first_version VARCHAR(50),
  estimated_days INT,
  
  -- Metadata
  is_saved BOOLEAN DEFAULT false,
  saved_project_name VARCHAR(255),
  saved_notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_recommendations_user_id ON stack_recommendations(user_id);
CREATE INDEX idx_recommendations_is_saved ON stack_recommendations(is_saved);
CREATE INDEX idx_recommendations_project_type ON stack_recommendations(project_type);
CREATE INDEX idx_recommendations_created_at ON stack_recommendations(created_at DESC);

-- Recommendation Tools
CREATE TABLE IF NOT EXISTS stack_recommendation_tools (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recommendation_id UUID NOT NULL REFERENCES stack_recommendations(id) ON DELETE CASCADE,
  tool_name VARCHAR(100),
  category VARCHAR(50),
  reasoning TEXT,
  is_optional BOOLEAN DEFAULT true
);

CREATE INDEX idx_tools_recommendation_id ON stack_recommendation_tools(recommendation_id);

-- Recommendation Warnings
CREATE TABLE IF NOT EXISTS stack_recommendation_warnings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recommendation_id UUID NOT NULL REFERENCES stack_recommendations(id) ON DELETE CASCADE,
  warning_type VARCHAR(50),
  message TEXT,
  severity VARCHAR(20)
);

CREATE INDEX idx_warnings_recommendation_id ON stack_recommendation_warnings(recommendation_id);

-- Stack Alternatives
CREATE TABLE IF NOT EXISTS stack_alternatives (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recommendation_id UUID NOT NULL REFERENCES stack_recommendations(id) ON DELETE CASCADE,
  name VARCHAR(100),
  frontend VARCHAR(100),
  backend VARCHAR(100),
  database VARCHAR(100),
  pros JSONB,
  cons JSONB,
  recommendation_reason TEXT
);

CREATE INDEX idx_alternatives_recommendation_id ON stack_alternatives(recommendation_id);

-- Stack Presets
CREATE TABLE IF NOT EXISTS stack_presets (
  id VARCHAR(100) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  
  frontend_stack VARCHAR(255),
  backend_stack VARCHAR(255),
  database_stack VARCHAR(255),
  
  best_for VARCHAR(255),
  time_to_ship VARCHAR(50),
  scalability_level VARCHAR(20),
  complexity_level VARCHAR(20),
  
  project_types VARCHAR[],
  scales VARCHAR[],
  
  created_at TIMESTAMP DEFAULT NOW(),
  is_active BOOLEAN DEFAULT true
);

-- Pre-populate Stack Presets
INSERT INTO stack_presets (id, name, description, frontend_stack, backend_stack, database_stack, best_for, time_to_ship, scalability_level, complexity_level, project_types, scales, is_active)
VALUES
  ('nextjs-postgres', 'The Full-Stack Classic', 'Ship fast with Next.js full-stack. Everything in one language.', 'Next.js + TypeScript', 'Next.js API Routes', 'PostgreSQL', 'MVPs, side projects, solo devs', '2 weeks', 'medium', 'low', ARRAY['web_app'], ARRAY['solo', 'small_team'], true),
  ('react-express-pg', 'Separation of Concerns', 'Separate frontend and backend for team scaling.', 'React + TypeScript', 'Express + Node.js', 'PostgreSQL', 'Team projects, structured apps', '3 weeks', 'high', 'medium', ARRAY['web_app'], ARRAY['small_team', 'enterprise'], true),
  ('springboot-react', 'Enterprise Grade', 'Proven enterprise stack with Spring Boot and React.', 'React + TypeScript', 'Spring Boot (Java)', 'PostgreSQL', 'Enterprise projects, long-term apps', '4 weeks', 'high', 'high', ARRAY['web_app', 'api'], ARRAY['enterprise'], true),
  ('fastapi-react', 'Python Power', 'Fast API development with Python and React.', 'React + TypeScript', 'FastAPI + Python', 'PostgreSQL', 'Data-heavy apps, APIs', '3 weeks', 'medium', 'medium', ARRAY['web_app', 'api'], ARRAY['small_team', 'enterprise'], true),
  ('api-only', 'API First', 'Headless API development with FastAPI or Express.', 'N/A', 'Express + Node.js', 'PostgreSQL', 'APIs, microservices, mobile backends', '2 weeks', 'high', 'low', ARRAY['api'], ARRAY['solo', 'small_team', 'enterprise'], true);

-- ============================================
-- ANALYTICS & AUDIT TABLES
-- ============================================

CREATE TABLE IF NOT EXISTS user_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  event_type VARCHAR(100) NOT NULL, -- 'github_analysis', 'graveyard_add', 'stack_recommend', etc.
  event_data JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_user_events_user_id ON user_events(user_id);
CREATE INDEX idx_user_events_type ON user_events(event_type);
CREATE INDEX idx_user_events_created_at ON user_events(created_at DESC);

-- ============================================
-- CREATE VIEWS FOR COMMON QUERIES
-- ============================================

-- Most common abandonment reasons
CREATE OR REPLACE VIEW vw_abandonment_reason_stats AS
SELECT 
  gr.reason,
  COUNT(*) as count,
  ROUND(COUNT(*)::numeric / (SELECT COUNT(DISTINCT project_id) FROM graveyard_abandonment_reasons)::numeric * 100, 2) as percentage
FROM graveyard_abandonment_reasons gr
GROUP BY gr.reason
ORDER BY count DESC;

-- Average project duration by language
CREATE OR REPLACE VIEW vw_project_duration_by_language AS
SELECT 
  language,
  COUNT(*) as project_count,
  ROUND(AVG(duration_days)::numeric, 2) as avg_duration_days,
  MAX(duration_days) as max_duration,
  MIN(duration_days) as min_duration
FROM graveyard_projects
WHERE status = 'abandoned'
GROUP BY language
ORDER BY project_count DESC;

-- User productivity summary
CREATE OR REPLACE VIEW vw_user_productivity_summary AS
SELECT 
  u.id as user_id,
  u.github_username,
  COUNT(DISTINCT gr.id) as repo_count,
  COALESCE(ga.consistency_score, 0) as consistency_score,
  COALESCE(ga.average_commits_per_day, 0) as avg_commits_per_day,
  COALESCE(ga.peak_coding_hour, 0) as peak_hour,
  ga.analyzed_at as last_analysis
FROM users u
LEFT JOIN github_repositories gr ON u.id = gr.user_id AND gr.is_active = true
LEFT JOIN github_analyses ga ON u.id = ga.user_id
WHERE u.is_active = true
GROUP BY u.id, u.github_username, ga.consistency_score, ga.average_commits_per_day, ga.peak_coding_hour, ga.analyzed_at;

-- ============================================
-- STORED PROCEDURES
-- ============================================

-- Update activity heatmap for a user
CREATE OR REPLACE FUNCTION update_activity_heatmap(p_user_id UUID, p_date DATE, p_hour INT, p_commit_count INT)
RETURNS void AS $$
BEGIN
  INSERT INTO github_activity_heatmap (user_id, activity_date, hour_of_day, commit_count)
  VALUES (p_user_id, p_date, p_hour, p_commit_count)
  ON CONFLICT (user_id, activity_date, hour_of_day) 
  DO UPDATE SET commit_count = p_commit_count;
END;
$$ LANGUAGE plpgsql;

-- Mark analysis as complete
CREATE OR REPLACE FUNCTION complete_analysis(p_analysis_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE github_analyses
  SET status = 'completed', updated_at = NOW()
  WHERE id = p_analysis_id;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- SAMPLE DATA (For development/testing)
-- ============================================

-- Insert a test user (comment out for production)
-- INSERT INTO users (github_id, github_username, github_name, github_avatar_url, github_public_repos)
-- VALUES (12345, 'testuser', 'Test User', 'https://...', 5)
-- ON CONFLICT (github_id) DO NOTHING;
