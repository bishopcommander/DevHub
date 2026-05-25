import { useQuery } from '@tanstack/react-query';
import { fetchDashboardData } from '../api/devhubApi';

export const useDashboardData = () => {
  return useQuery({
    queryKey: ['dashboard-data'],
    queryFn: fetchDashboardData,
    staleTime: 1000 * 60 * 2,
    retry: 1,
  });
};
