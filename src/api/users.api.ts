import { apiClient } from './axios';
import type { User } from '@/types/auth';

export interface UserStats {
  solved:        number;
  accuracy:      number;
  streak:        number;
  longestStreak: number;
}

export interface UpdateMeDto {
  name?:   string;
  school?: string | null;
  grade?:  string | null;
}

export interface ActivityDay {
  date:  string; // YYYY-MM-DD
  count: number;
  level: number; // 0..4
}

export const usersApi = {
  getStats: async (): Promise<UserStats> => {
    const { data } = await apiClient.get<UserStats>('/users/me/stats');
    return data;
  },

  updateMe: async (dto: UpdateMeDto): Promise<User> => {
    const { data } = await apiClient.patch<User>('/users/me', dto);
    return data;
  },

  getActivity: async (days = 365): Promise<ActivityDay[]> => {
    const { data } = await apiClient.get<ActivityDay[]>('/users/me/activity', { params: { days } });
    return data;
  },
};
