import { useQuery } from '@tanstack/react-query';
import { fetchLandingData } from '../api/devhubApi';

export const useLandingData = () => {
  return useQuery({
    queryKey: ['landing-data'],
    queryFn: fetchLandingData,
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });
};
