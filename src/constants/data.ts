export const SUBJECTS = [
  { id: 'math', label: 'Math', short: 'MA' },
  { id: 'phys', label: 'Physics', short: 'PH' },
  { id: 'chem', label: 'Chemistry', short: 'CH' },
  { id: 'bio', label: 'Biology', short: 'BI' },
  { id: 'eng', label: 'English', short: 'EN' },
  { id: 'reason', label: 'Reasoning', short: 'LR' },
] as const;

export const MASTERY = [
  { id: 'math', label: 'Mathematics', pct: 72 },
  { id: 'phys', label: 'Physics', pct: 64 },
  { id: 'chem', label: 'Chemistry', pct: 81 },
  { id: 'bio', label: 'Biology', pct: 47 },
  { id: 'eng', label: 'English', pct: 88 },
  { id: 'reason', label: 'Logical Reasoning', pct: 53 },
] as const;

export const WEEK = ['M', 'T', 'W', 'T', 'F', 'S', 'S'] as const;
export const WEEK_ACTIVE = [true, true, true, true, true, true, false] as const;

export const TOPICS = [
  { id: 't1', subject: 'Physics', title: 'Rotational Dynamics', done: 12, total: 18, color: '#D4541A' },
  { id: 't2', subject: 'Mathematics', title: 'Logarithms & Exponents', done: 8, total: 14, color: '#3D7A4E' },
  { id: 't3', subject: 'Chemistry', title: 'Mole Concept', done: 5, total: 16, color: '#C8941E' },
  { id: 't4', subject: 'Biology', title: 'Cell Structure', done: 3, total: 12, color: '#6B6760' },
] as const;

export const RECOMMENDED = [
  { id: 'r1', subject: 'Biology', reason: 'Weak area · 47% mastery', title: 'Photosynthesis basics' },
  { id: 'r2', subject: 'Reasoning', reason: 'Suggested · 12 students stuck here', title: 'Blood relations' },
  { id: 'r3', subject: 'Physics', reason: 'Last attempted 4 days ago', title: 'Projectile motion drill' },
] as const;

export const RECENT_ATTEMPTS = [
  { id: 'a1', kind: 'Mock Test', subject: 'Full mock · JEE-style', score: '68/100', acc: 68, time: '02:48:12', when: 'Yesterday' },
  { id: 'a2', kind: 'Quick Practice', subject: 'Mathematics', score: '8/10', acc: 80, time: '11:24', when: '2 days ago' },
  { id: 'a3', kind: 'Topic Drill', subject: 'Chemistry · Mole concept', score: '15/20', acc: 75, time: '24:08', when: '3 days ago' },
  { id: 'a4', kind: 'Quick Practice', subject: 'Physics', score: '6/10', acc: 60, time: '14:51', when: '4 days ago' },
] as const;

export const DAILY_Q = {
  id: 'q-projectile-1',
  subject: 'Physics',
  topic: 'Projectile motion',
  difficulty: 'Medium',
  options: [
    { id: 'A', text: '20·√3 m', sub: '≈ 34.64 m' },
    { id: 'B', text: '40 m', sub: '' },
    { id: 'C', text: '20 m', sub: '' },
    { id: 'D', text: '40·√3 m', sub: '≈ 69.28 m' },
  ],
  correct: 'A',
  official: [
    'Use the level-ground range formula R = v² · sin(2θ) / g.',
    'Substitute v = 20, θ = 60°, g = 10 → R = 400 · sin(120°) / 10.',
    'sin(120°) = √3 / 2, so R = 400 · (√3/2) / 10 = 20·√3 m.',
    'That’s about 34.64 m. Answer: A.',
  ],
  community: [
    {
      id: 'c1',
      author: 'Aarav Mehta',
      grade: 'Class 12 · JEE 2026',
      avatar: 'A',
      tone: 'steps' as const,
      upvotes: 312,
      helpful: 287,
      text:
        `ok so the trick here is just remembering R = v²·sin(2θ)/g. Don't break it into x and y unless you have to.\n\n` +
        `1) v² = 400\n` +
        `2) 2θ = 120°, sin(120°) = √3/2\n` +
        `3) R = 400 · (√3/2) / 10 = 20√3\n\n` +
        `if you tried decomposing into vx, vy and finding time of flight you'd get the same thing but it takes 3x longer. save that for non-level ground problems.`,
    },
    {
      id: 'c2',
      author: 'Priya Nair',
      grade: 'Class 11 · NEET 2027',
      avatar: 'P',
      tone: 'analogy' as const,
      upvotes: 184,
      helpful: 161,
      text: `I always forget this but here's how I keep it straight: think of 60° and 30° as "complementary partners" — they give the SAME range because sin(120°) = sin(60°). So a ball thrown at 60° lands the same distance as one thrown at 30° (with the same speed). The 45° throw is the maximum. That mental picture saves me every time.`,
    },
    {
      id: 'c3',
      author: 'Daniel Okafor',
      grade: 'A-Levels · Cambridge',
      avatar: 'D',
      tone: 'short' as const,
      upvotes: 96,
      helpful: 88,
      text: `R = v² sin(2θ)/g = (400)(√3/2)/10 = 20√3. Done.`,
    },
  ],
} as const;

export const ACHIEVEMENTS = [
  { id: 'a1', label: 'First 100', sub: '100 questions solved', unlocked: true, icon: 'medal' },
  { id: 'a2', label: '7-day streak', sub: 'A week, every day', unlocked: true, icon: 'flame' },
  { id: 'a3', label: 'Mock perfect', sub: 'Full marks on a mock test', unlocked: false, icon: 'trophy' },
  { id: 'a4', label: 'Night owl', sub: 'Solved past midnight x10', unlocked: true, icon: 'moon' },
  { id: 'a5', label: 'Explainer', sub: 'Top community answer', unlocked: false, icon: 'message-square' },
  { id: 'a6', label: '30-day streak', sub: 'A month strong', unlocked: false, icon: 'flame' },
] as const;

export const LEADERBOARD = [
  { id: 'l1', rank: 1, name: 'Ishaan Verma', pts: 4820, change: 0, you: false, avatar: 'I' },
  { id: 'l2', rank: 2, name: 'Mei Tanaka', pts: 4612, change: 1, you: false, avatar: 'M' },
  { id: 'l3', rank: 3, name: 'You', pts: 4488, change: 2, you: true, avatar: 'R' },
  { id: 'l4', rank: 4, name: 'Sofía Restrepo', pts: 4301, change: -1, you: false, avatar: 'S' },
  { id: 'l5', rank: 5, name: 'Arjun Patel', pts: 4109, change: -2, you: false, avatar: 'A' },
] as const;

export const STUDY_BUDDIES = [
  { id: 'b1', name: 'Aarav Mehta', sub: 'JEE 2026 · 31-day streak', avatar: 'A' },
  { id: 'b2', name: 'Priya Nair', sub: 'NEET 2027 · 12-day streak', avatar: 'P' },
  { id: 'b3', name: 'Sofía Restrepo', sub: 'IB · 9-day streak', avatar: 'S' },
] as const;

export function buildHeatmap(): number[][] {
  const weeks = 13;
  const grid: number[][] = [];
  let seed = 7;
  const rnd = () => { seed = (seed * 9301 + 49297) % 233280; return seed / 233280; };
  for (let w = 0; w < weeks; w++) {
    const col: number[] = [];
    for (let d = 0; d < 7; d++) {
      const recency = w / (weeks - 1);
      const base = rnd();
      const score = base * 0.55 + recency * 0.5 - (d >= 5 ? 0.12 : 0);
      let lvl = 0;
      if (score > 0.85) lvl = 4;
      else if (score > 0.65) lvl = 3;
      else if (score > 0.45) lvl = 2;
      else if (score > 0.25) lvl = 1;
      if (w === weeks - 1 && d === 5) lvl = 4;
      if (w === weeks - 1 && d === 6) lvl = -1;
      col.push(lvl);
    }
    grid.push(col);
  }
  return grid;
}
