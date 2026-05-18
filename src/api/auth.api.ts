import { apiClient } from './axios';
import type { AuthResponse, User } from '@/types/auth';

export const authApi = {
  signup: async (data: any) => {
    const res = await apiClient.post<AuthResponse>('/auth/signup', data);
    return res.data;
  },
  login: async (data: any) => {
    const res = await apiClient.post<AuthResponse>('/auth/login', data);
    return res.data;
  },
  logout: async () => {
    await apiClient.post('/auth/logout');
  },
  getMe: async (token?: string) => {
    const res = await apiClient.get<User>('/auth/me', {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    return res.data;
  },
};
