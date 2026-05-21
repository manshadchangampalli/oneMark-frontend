import { apiClient } from './axios';
import { ApiRoute } from '@/services/api';

export interface PracticeOption {
  id: string;
  label: string;
  text: string;
  sub: string | null;
  sortOrder: number;
}

export interface PracticeQuestion {
  id: string;
  difficulty: 'easy' | 'medium' | 'hard';
  type: string;
  xpReward: number;
  revision: {
    id: string;
    prompt: string;
    correctOptionLabel?: string;
    officialExplanation?: { steps: string[] } | null;
  } | null;
  options: PracticeOption[];
  // Present on GET /practice/sessions/:id — used to restore submitted state on refresh
  myStatus?: 'unattempted' | 'correct' | 'incorrect';
  mySelectedOptionId?: string | null;
  myXpAwarded?: number | null;
}

export interface PracticeSession {
  id: string;
  mode: string;
  examId: string;
  questionCount: number;
  timeLimitSec: number | null;
  startedAt: string;
}

export interface CreateSessionDto {
  mode: 'quick' | 'drill';
  subjectId?: string;
  topicId?: string;
  difficulty?: 'easy' | 'medium' | 'hard' | 'mixed';
  questionCount?: number;
}

export interface SubmitAttemptResult {
  attempt: { id: string; isCorrect: boolean; xpAwarded: number };
  isCorrect: boolean;
  correctOptionLabel: string;
  officialExplanation: { steps: string[] } | null;
  runningScore: number;
}

export interface FinishResult {
  score: number;
  total: number;
  accuracy: number;
  timeSpentSec: number;
  xpAwarded: number;
  byTopic: { topicId: string; correct: number; total: number }[];
}

export interface SessionState {
  session: PracticeSession;
  questions: PracticeQuestion[];
}

export const practiceApi = {
  createSession: async (dto: CreateSessionDto): Promise<SessionState> => {
    const { data } = await apiClient.post<SessionState>(ApiRoute.PRACTICE_SESSIONS, dto);
    return data;
  },

  getSession: async (
    sessionId: string,
  ): Promise<SessionState & { score: number; total: number; finishedAt: string | null; timeSpentSec: number }> => {
    const { data } = await apiClient.get(`${ApiRoute.PRACTICE_SESSIONS}/${sessionId}`);
    return data;
  },

  submitAttempt: async (
    sessionId: string,
    dto: { questionId: string; selectedOptionId?: string; timeSeconds: number },
  ): Promise<SubmitAttemptResult> => {
    const { data } = await apiClient.post<SubmitAttemptResult>(
      `${ApiRoute.PRACTICE_SESSIONS}/${sessionId}/attempts`,
      dto,
    );
    return data;
  },

  finishSession: async (sessionId: string): Promise<FinishResult> => {
    const { data } = await apiClient.post<FinishResult>(
      `${ApiRoute.PRACTICE_SESSIONS}/${sessionId}/finish`,
    );
    return data;
  },
};
