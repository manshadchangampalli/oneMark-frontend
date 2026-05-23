import { apiClient } from './axios';

export interface LeaderboardEntry {
  rank:          number;
  userId:        string;
  name:          string;
  avatarInitial: string | null;
  xp:            number;
  isMe:          boolean;
}

export interface LeaderboardResponse {
  scope: 'exam' | 'global';
  total: number;
  top:   LeaderboardEntry[];
}

export interface LeaderboardParams {
  scope?: 'exam' | 'global';
  limit?: number;
}

export const leaderboardApi = {
  list: async (params: LeaderboardParams = {}): Promise<LeaderboardResponse> => {
    const { data } = await apiClient.get<LeaderboardResponse>('/leaderboard', { params });
    return data;
  },
};
