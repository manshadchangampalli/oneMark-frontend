import { useQuery } from '@tanstack/react-query';
import { usersApi } from '@/api/users.api';

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