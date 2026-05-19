import { apiClient } from './axios';
import { ApiRoute } from '@/services/api';
import type { AuthResponse, User } from '@/types/auth';

export const authApi = {
  signup: async (data: any) => {
    const res = await apiClient.post<AuthResponse>(ApiRoute.SIGNUP, data);
    return res.data;
  },
  login: async (data: any) => {
    const res = await apiClient.post<AuthResponse>(ApiRoute.LOGIN, data);
    return res.data;
  },
  logout: async () => {
    await apiClient.post(ApiRoute.LOGOUT);
  },
  getMe: async (token?: string) => {
    const res = await apiClient.get<User>(ApiRoute.ME, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    return res.data;
  },
};
