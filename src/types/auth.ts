export type User = {
  id: string;
  email: string;
  name: string;
  avatarInitial?: string;
  avatarTone?: 'accent' | 'neutral';
  school?: string;
  grade?: string;
  targetExam?: string;
  state?: string;
  district?: string;
  role: 'student' | 'admin';
  totalXp: number;
  totalAttempts: number;
  totalCorrect: number;
}

export type AuthResponse = {
  accessToken: string;
}
