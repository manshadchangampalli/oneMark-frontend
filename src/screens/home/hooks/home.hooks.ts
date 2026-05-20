import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { dailyChallengeApi, type SubmitAttemptDto } from '@/api/daily-challenge.api';

export function useDailyChallenge() {
  return useQuery({
    queryKey: ['daily-challenge'],
    queryFn: dailyChallengeApi.getToday,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
}

export function useSubmitDailyChallenge() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (dto: SubmitAttemptDto) => dailyChallengeApi.submitAttempt(dto),
    onSuccess: () => {
      // Refetch so myAttempt + correctOptionLabel are up to date
      queryClient.invalidateQueries({ queryKey: ['daily-challenge'] });
    },
  });
}
