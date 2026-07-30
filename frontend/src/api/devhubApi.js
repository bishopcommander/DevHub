import apiClient from './client';
import axios from 'axios';

// Microservice endpoint configuration
const CODE_EXPLAINER_SERVICE_URL = 'http://localhost:8081/api/v1/code-explainer';

export const fetchLandingData = async () => {
  const { data } = await apiClient.get('/v1/landing');
  return data;
};

const DASHBOARD_SERVICE_URL = 'http://localhost:8083/api/v1/dashboard';

export const fetchDashboardData = async () => {
  try {
    const response = await axios.get(DASHBOARD_SERVICE_URL, { timeout: 4000 });
    return response.data;
  } catch (err) {
    console.warn('[Microservice Fallback] Dedicated Dashboard microservice unreachable on port 8083. Falling back to API Gateway / Proxy.', err.message);
    const { data } = await apiClient.get('/v1/dashboard');
    return data;
  }
};

export const fetchHealth = async () => {
  const { data } = await apiClient.get('/v1/health');
  return data;
};

const TRACKER_SERVICE_URL = 'http://localhost:8084/api/v1/tracker';

export const fetchTrackerData = async () => {
  try {
    const response = await axios.get(TRACKER_SERVICE_URL, { timeout: 4000 });
    return response.data;
  } catch (err) {
    console.warn('[Microservice Fallback] Dedicated Tracker microservice unreachable on port 8084. Falling back to API Gateway / Proxy.', err.message);
    // Fallback: return static bingo task list only
    return { bingoTasks: [], visual3dAchievementNodes: [] };
  }
};

const STACK_DECIDER_SERVICE_URL = 'http://localhost:8082/api/v1/stack-decider';

export const getStackSuggestion = async (requestData) => {
  try {
    const response = await axios.post(STACK_DECIDER_SERVICE_URL, requestData, { timeout: 4000 });
    return response.data;
  } catch (err) {
    console.warn('[Microservice Fallback] Dedicated Stack Decider microservice unreachable on port 8082. Falling back to API Gateway / Proxy.', err.message);
    const { data } = await apiClient.post('/v1/stack-decider', requestData);
    return data;
  }
};

/**
 * Calls the standalone Code Explainer Microservice (Port 8081)
 * Falls back to main gateway if microservice is unreachable.
 */
export const explainCode = async (requestData) => {
  try {
    const response = await axios.post(CODE_EXPLAINER_SERVICE_URL, requestData, { timeout: 4000 });
    return response.data;
  } catch (err) {
    console.warn('[Microservice Fallback] Dedicated Code Explainer microservice unreachable on port 8081. Falling back to API Gateway / Proxy.', err.message);
    const { data } = await apiClient.post('/v1/code-explainer', requestData);
    return data;
  }
};
