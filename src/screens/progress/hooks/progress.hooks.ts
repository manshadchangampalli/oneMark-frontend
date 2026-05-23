import { useQuery } from '@tanstack/react-query';
import { usersApi } from '@/api/users.api';
import { leaderboardApi, type LeaderboardParams } from '@/api/leaderboard.api';

export function useUserActivity(days: number) {
  return useQuery({
    queryKey: ['user-activity', { days }],
    queryFn: () => usersApi.getActivity(days),
    staleTime: 5 * 60 * 1000,
  });
}


export function useUserProgress() {
  return useQuery({
    queryKey: ['user-progress'],
    queryFn: () => usersApi.getProgress(),
    staleTime: 5 * 60 * 1000,
  });
}

export function useLeaderboard(params: LeaderboardParams = {}) {
  return useQuery({
    queryKey: ['leaderboard', params],
    queryFn:  () => leaderboardApi.list(params),
    staleTime: 60 * 1000,
  });
}