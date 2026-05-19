import { apiClient } from './axios';
import { ApiRoute, ApiRouteParam } from '@/services/api';

export interface State    { id: string; name: string; code: string; }
export interface District { id: string; name: string; }
export interface Exam     { id: string; code: string; label: string; description: string | null; isActive: boolean; }

export const locationApi = {
  getStates: async (): Promise<State[]> => {
    const res = await apiClient.get<State[]>(ApiRoute.STATES);
    return res.data;
  },
  getDistricts: async (stateId: string): Promise<District[]> => {
    const res = await apiClient.get<District[]>(ApiRouteParam.districts(stateId));
    return res.data;
  },
  getExams: async (): Promise<Exam[]> => {
    const res = await apiClient.get<Exam[]>(ApiRoute.EXAMS);
    return res.data;
  },
};
