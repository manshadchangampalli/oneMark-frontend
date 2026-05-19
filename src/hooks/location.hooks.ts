import { useQuery } from '@tanstack/react-query';
import { locationApi } from '@/api/location.api';
import type { Exam } from '@/api/location.api';

// Shown immediately while the real data loads or if the API is unreachable.
// All marked inactive so they render as disabled until the server confirms otherwise.
const EXAM_PLACEHOLDER: Exam[] = [
  { id: 'psc',     code: 'psc',     label: 'Kerala PSC', description: 'Kerala Public Service Commission', isActive: false },
  { id: 'jee',     code: 'jee',     label: 'JEE',        description: 'Main + Advanced',                  isActive: false },
  { id: 'neet',    code: 'neet',    label: 'NEET',       description: 'Medical entrance',                 isActive: false },
  { id: 'cuet',    code: 'cuet',    label: 'CUET',       description: 'Central universities',             isActive: false },
  { id: 'boards',  code: 'boards',  label: 'Boards',     description: 'CBSE / ICSE / State',             isActive: false },
  { id: 'gate',    code: 'gate',    label: 'GATE',       description: 'Engineering PG',                  isActive: false },
  { id: 'cat',     code: 'cat',     label: 'CAT',        description: 'Management',                      isActive: false },
];

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
    placeholderData: EXAM_PLACEHOLDER,
  });
}
