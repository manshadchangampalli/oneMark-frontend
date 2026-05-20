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
  question: DailyChallengeQuestion;
  myAttempt: MyAttempt | null;
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

export const dailyChallengeApi = {
  getToday: async (): Promise<DailyChallenge> => {
    const res = await apiClient.get<DailyChallenge>(ApiRoute.DAILY_CHALLENGE);
    return res.data;
  },
  submitAttempt: async (dto: SubmitAttemptDto): Promise<SubmitAttemptResult> => {
    const res = await apiClient.post<SubmitAttemptResult>(
      `${ApiRoute.DAILY_CHALLENGE}/attempt`,
      dto,
    );
    return res.data;
  },
};
