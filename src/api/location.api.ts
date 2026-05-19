import { apiClient } from './axios';

export interface State { id: string; name: string; code: string; }
export interface District { id: string; name: string; }
export interface Exam { id: string; code: string; label: string; description: string | null; }

export const locationApi = {
  getStates: async (): Promise<State[]> => {
    const res = await apiClient.get<State[]>('/location/states');
    return res.data;
  },
  getDistricts: async (stateId: string): Promise<District[]> => {
    const res = await apiClient.get<District[]>(`/location/states/${stateId}/districts`);
    return res.data;
  },
  getExams: async (): Promise<Exam[]> => {
    const res = await apiClient.get<Exam[]>('/exams');
    return res.data;
  },
};
