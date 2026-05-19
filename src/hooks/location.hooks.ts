import { useQuery } from '@tanstack/react-query';
import { locationApi } from '@/api/location.api';

export function useStates() {
  return useQuery({
    queryKey: ['states'],
    queryFn: locationApi.getStates,
  });
}

export function useDistricts(stateId: string) {
  return useQuery({
    queryKey: ['districts', stateId],
    queryFn: () => locationApi.getDistricts(stateId),
    enabled: !!stateId,
  });
}

export function useExams() {
  return useQuery({
    queryKey: ['exams'],
    queryFn: locationApi.getExams,
  });
}
