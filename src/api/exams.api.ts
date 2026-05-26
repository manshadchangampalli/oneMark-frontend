import { apiClient } from './axios';
import { ApiRoute } from '@/services/api';

export interface Exam {
  id:          string;
  code:        string;
  label:       string;
  description: string | null;
  isActive:    boolean;
  tier?:       string | null;
  categoryId?: string | null;
}

export interface ExamCategoryWithTiers {
  id:          string;
  code:        string;
  label:       string;
  description: string | null;
  colorHex:    string | null;
  iconKey:     string | null;
  isActive:    boolean;
  tiers: {
    tier:  string | null;
    exams: { id: string; code: string; label: string; description: string | null; tier: string | null }[];
  }[];
}

export interface UserExam {
  examId:    string;
  isPrimary: boolean;
  enrolledAt: string;
  exam:      Exam;
}

export const examsApi = {
  list: async (): Promise<Exam[]> => {
    const { data } = await apiClient.get<Exam[]>(ApiRoute.EXAMS);
    return data;
  },

  listCategories: async (): Promise<ExamCategoryWithTiers[]> => {
    const { data } = await apiClient.get<ExamCategoryWithTiers[]>(`${ApiRoute.EXAMS}/categories`);
    return data;
  },

  myExams: async (): Promise<UserExam[]> => {
    const { data } = await apiClient.get<UserExam[]>('/me/exams');
    return data;
  },

  enrol: async (examId: string): Promise<UserExam> => {
    const { data } = await apiClient.post<UserExam>('/me/exams', { examId });
    return data;
  },

  setPrimary: async (examId: string): Promise<UserExam> => {
    const { data } = await apiClient.patch<UserExam>(`/me/exams/${examId}`);
    return data;
  },
};
