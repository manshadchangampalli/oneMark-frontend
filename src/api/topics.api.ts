import { apiClient } from './axios';
import { ApiRoute } from '@/services/api';

export interface TopicProgress {
  topicId:         string;
  topic:           string;
  subject:         string;
  color:           string;
  attempted:       number;
  total:           number;
  correct:         number;
  lastAttemptedAt: string;
}

export const topicsApi = {
  getProgress: async (limit = 4): Promise<TopicProgress[]> => {
    const { data } = await apiClient.get<TopicProgress[]>(ApiRoute.TOPICS_PROGRESS, {
      params: { limit },
    });
    return data;
  },
};
