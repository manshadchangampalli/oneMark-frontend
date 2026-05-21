import { apiClient } from './axios';
import { ApiRoute } from '@/services/api';

export interface Subject {
  id: string;
  code: string;
  label: string;
  short: string;
  colorHex: string;
}

export const subjectsApi = {
  list: async (): Promise<Subject[]> => {
    const { data } = await apiClient.get<Subject[]>(ApiRoute.SUBJECTS);
    return data;
  },
};
