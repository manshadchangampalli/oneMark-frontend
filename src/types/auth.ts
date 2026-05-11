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
}

export type AuthResponse = {
  accessToken: string;
}
