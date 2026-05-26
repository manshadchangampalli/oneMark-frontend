export type PrimaryExam = {
  id: string;
  code: string;
  label: string;
  tier: string | null;
  category: {
    id: string;
    code: string;
    label: string;
    colorHex: string | null;
  };
}

export type User = {
  id: string;
  email: string;
  name: string;
  avatarInitial?: string;
  avatarTone?: 'accent' | 'neutral';
  school?: string;
  grade?: string;
  /** @deprecated — use `primaryExam.code` instead. Kept for backwards compatibility. */
  targetExam?: string;
  /** Source of truth for the user's primary exam, derived from UserExam.isPrimary. */
  primaryExam?: PrimaryExam | null;
  state?: string;
  district?: string;
  role: 'student' | 'admin';
  totalXp: number;
  totalAttempts: number;
  totalCorrect: number;
  currentStreak?: number;
  longestStreak?: number;
}

export type AuthResponse = {
  accessToken: string;
}
