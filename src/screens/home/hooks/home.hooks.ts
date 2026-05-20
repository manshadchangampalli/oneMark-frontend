import { useQuery } from '@tanstack/react-query';
import { dailyChallengeApi } from '@/api/daily-challenge.api';

export function useDailyChallenge() {
  return useQuery({
    queryKey: ['daily-challenge'],
    queryFn: dailyChallengeApi.getToday,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
}
