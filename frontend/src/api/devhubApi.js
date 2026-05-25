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
