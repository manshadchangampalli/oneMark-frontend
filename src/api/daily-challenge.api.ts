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
  subject: string | null;
  topic: string | null;
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
  dailyBonus: number;
  question: DailyChallengeQuestion;
  myAttempt: MyAttempt | null;
  startedAt: string | null;
}

export interface SubmitAttemptDto {
  selectedOptionId: string;
  timeSeconds?: number;
}

export interface SubmitAttemptResult {
  isCorrect: boolean;
  correctOptionLabel: string;
  officialExplanation: { steps: string[] };
  attempt: { id: string; isCorrect: boolean; xpAwarded: number };
}

export interface TopSolver {
  rank:          number;
  userId:        string;
  name:          string;
  avatarInitial: string | null;
  timeSeconds:   number;
  isMe:          boolean;
}

export const dailyChallengeApi = {
  getToday: async (): Promise<DailyChallenge> => {
    const res = await apiClient.get<DailyChallenge>(ApiRoute.DAILY_CHALLENGE);
    return res.data;
  },
  recordStart: async (): Promise<{ startedAt: string }> => {
    const res = await apiClient.post<{ startedAt: string }>(
      `${ApiRoute.DAILY_CHALLENGE}/start`,
    );
    return res.data;
  },
  submitAttempt: async (dto: SubmitAttemptDto): Promise<SubmitAttemptResult> => {
    const res = await apiClient.post<SubmitAttemptResult>(
      `${ApiRoute.DAILY_CHALLENGE}/attempt`,
      dto,
    );
    return res.data;
  },
  topSolvers: async (challengeId: string, limit = 5): Promise<TopSolver[]> => {
    const res = await apiClient.get<TopSolver[]>(
      `${ApiRoute.DAILY_CHALLENGE}/${challengeId}/top-solvers`,
      { params: { limit } },
    );
    return res.data;
  },
};
