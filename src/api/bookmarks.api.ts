import { apiClient } from './axios';

export interface BookmarkRow {
  questionId: string;
  createdAt:  string;
  prompt:     string;
  difficulty: 'easy' | 'medium' | 'hard';
  xpReward:   number;
  subject:    { id: string; label: string; colorHex: string };
  topic:      { id: string; label: string };
}

export interface BookmarksPage {
  data:       BookmarkRow[];
  nextCursor: string | null;
}

export const bookmarksApi = {
  listIds: async (): Promise<string[]> => {
    const { data } = await apiClient.get<string[]>('/bookmarks/ids');
    return data;
  },

  list: async (params: { limit?: number; cursor?: string } = {}): Promise<BookmarksPage> => {
    const { data } = await apiClient.get<BookmarksPage>('/bookmarks', { params });
    return data;
  },

  add: async (questionId: string): Promise<void> => {
    await apiClient.post('/bookmarks', { questionId });
  },

  remove: async (questionId: string): Promise<void> => {
    await apiClient.delete(`/bookmarks/${questionId}`);
  },
};
