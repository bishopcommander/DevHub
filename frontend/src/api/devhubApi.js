import apiClient from './client';

export const fetchLandingData = async () => {
  const { data } = await apiClient.get('/v1/landing');
  return data;
};

export const fetchDashboardData = async () => {
  const { data } = await apiClient.get('/v1/dashboard');
  return data;
};

export const fetchHealth = async () => {
  const { data } = await apiClient.get('/v1/health');
  return data;
};

export const getStackSuggestion = async (requestData) => {
  const { data } = await apiClient.post('/v1/stack-decider', requestData);
  return data;
};

export const explainCode = async (requestData) => {
  const { data } = await apiClient.post('/v1/code-explainer', requestData);
  return data;
};

