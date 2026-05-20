import { apiClient } from './axios';
import { ApiRoute } from '@/services/api';

export interface DailyChallengeOption {
  id: string;
  label: string;
  text: string;
  sub: string | null;
  sortOrder: number;
}

export interface DailyChallengeRevision {
  id: string;
  prompt: string;
  difficulty: 'easy' | 'medium' | 'hard';
  xpReward: number;
  correctOptionLabel?: string;
  officialExplanation?: { steps: string[] };
}

export interface DailyChallengeQuestion {
  id: string;
  difficulty: 'easy' | 'medium' | 'hard';
  xpReward: number;
  revision: DailyChallengeRevision;
  options: DailyChallengeOption[];
}

export interface MyAttempt {
  id: string;
  isCorrect: boolean;
  selectedOptionId: string | null;
  xpAwarded: number;
}

export interface DailyChallenge {
  id: string;
  date: string;
  totalSolvers: number;
  question: DailyChallengeQuestion;
  myAttempt: MyAttempt | null;
}

export const dailyChallengeApi = {
  getToday: async (): Promise<DailyChallenge> => {
    const res = await apiClient.get<DailyChallenge>(ApiRoute.DAILY_CHALLENGE);
    return res.data;
  },
};
