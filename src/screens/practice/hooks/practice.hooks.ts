import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { practiceApi, type CreateSessionDto } from '@/api/practice.api';
import { subjectsApi } from '@/api/subjects.api';

export function useSubjects() {
  return useQuery({
    queryKey: ['subjects'],
    queryFn:  subjectsApi.list,
    staleTime: 10 * 60 * 1000,
  });
}

export function useRecentSessions(limit = 5) {
  return useQuery({
    queryKey: ['practice-sessions', { limit }],
    queryFn:  () => practiceApi.listSessions({ limit }),
    staleTime: 30 * 1000,
  });
}

export function useSessionsFirstPage(limit = 20) {
  return useQuery({
    queryKey: ['practice-sessions', 'history-first', { limit }],
    queryFn:  () => practiceApi.listSessions({ limit }),
    staleTime: 30 * 1000,
  });
}

export function useCreatePracticeSession() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (dto: CreateSessionDto) => practiceApi.createSession(dto),
    onSuccess: () => {
      // Refetch the recent attempts list so the new session shows up.
      qc.invalidateQueries({ queryKey: ['practice-sessions'] });
    },
  });
}

/** Imperative loader for cursor-based "Load more" — keeps the same key
 *  shape as the hooks above so the React Query cache stays consistent. */
export function loadMoreSessions(limit: number, cursor: string) {
  return practiceApi.listSessions({ limit, cursor });
}
