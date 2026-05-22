import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { usersApi, type UpdateMeDto } from '@/api/users.api';
import { examsApi } from '@/api/exams.api';

export function useUserStats() {
  return useQuery({
    queryKey: ['user-stats'],
    queryFn:  usersApi.getStats,
    staleTime: 30 * 1000,
  });
}

export function useUpdateMe() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (dto: UpdateMeDto) => usersApi.updateMe(dto),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['user-stats'] });
    },
  });
}

export function useAllExams(enabled = true) {
  return useQuery({
    queryKey: ['exams'],
    queryFn:  examsApi.list,
    enabled,
    staleTime: 5 * 60 * 1000,
  });
}

export function useMyExams(enabled = true) {
  return useQuery({
    queryKey: ['my-exams'],
    queryFn:  examsApi.myExams,
    enabled,
  });
}

/** Enrols if needed, then sets as primary exam. */
export function useSwitchExam() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ examId, enrolledIds }: { examId: string; enrolledIds: Set<string> }) => {
      if (!enrolledIds.has(examId)) {
        await examsApi.enrol(examId);
      }
      return examsApi.setPrimary(examId);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['my-exams'] });
    },
  });
}
