import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Zap, Timer, Crosshair, ArrowUpRight, BarChart2 } from 'lucide-react';
import { Card, Chip, Segmented, SectionHeader } from '@/components/ui';
import { cn } from '@/utils';
import { practiceApi } from '@/api/practice.api';
import type { CreateSessionDto, RecentSession } from '@/api/practice.api';
import { subjectsApi } from '@/api/subjects.api';

const MODE_LABEL: Record<string, string> = {
  quick: 'Quick Practice',
  drill: 'Topic Drill',
  mock:  'Mock Test',
};

function formatDuration(sec: number): string {
  if (!sec || sec <= 0) return '—';
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = sec % 60;
  const pad = (n: number) => n.toString().padStart(2, '0');
  return h > 0 ? `${pad(h)}:${pad(m)}:${pad(s)}` : `${pad(m)}:${pad(s)}`;
}

function formatRelative(iso: string): string {
  const then = new Date(iso).getTime();
  const diffMs = Date.now() - then;
  const day = 24 * 60 * 60 * 1000;
  if (diffMs < 60 * 1000) return 'Just now';
  if (diffMs < 60 * 60 * 1000) return `${Math.floor(diffMs / 60000)}m ago`;
  if (diffMs < day) return `${Math.floor(diffMs / 3600000)}h ago`;
  if (diffMs < 2 * day) return 'Yesterday';
  if (diffMs < 7 * day) return `${Math.floor(diffMs / day)}d ago`;
  return new Date(iso).toLocaleDateString();
}

function sessionSubjectLabel(a: RecentSession): string {
  if (a.topic && a.subject) return `${a.subject.label} · ${a.topic.label}`;
  if (a.subject) return a.subject.label;
  if (a.topic) return a.topic.label;
  return 'Mixed';
}

type Tone = 'accent' | 'warn' | 'good';

interface Mode {
  id: string;
  title: string;
  desc: string;
  Icon: React.ElementType;
  meta: string;
  tone: Tone;
}

const MODES: Mode[] = [
  { id: 'quick', title: 'Quick Practice', desc: '10 questions · untimed',           Icon: Zap,       meta: '~12 min', tone: 'accent' },
  { id: 'mock',  title: 'Mock Test',      desc: 'Full-length timed exam simulation', Icon: Timer,     meta: '3 hours', tone: 'warn'   },
  { id: 'drill', title: 'Topic Drill',    desc: 'Pick a topic · 20 questions',       Icon: Crosshair, meta: '~25 min', tone: 'good'   },
];

const iconBg: Record<Tone, string> = {
  accent: 'bg-accent-soft text-accent dark:bg-[#3A2218] dark:text-[#F4B89B]',
  warn:   'bg-warn-soft text-warn dark:bg-[#3A2E14] dark:text-[#E5C672]',
  good:   'bg-good-soft text-good dark:bg-[#1D3526] dark:text-[#9DC9A7]',
};

const WEEKLY_STATS = [
  { day: 'Mon', count: 12 },
  { day: 'Tue', count: 8  },
  { day: 'Wed', count: 15 },
  { day: 'Thu', count: 6  },
  { day: 'Fri', count: 20 },
  { day: 'Sat', count: 10 },
  { day: 'Sun', count: 0  },
];
const maxCount = Math.max(...WEEKLY_STATS.map(d => d.count));

export default function Practice() {
  const navigate = useNavigate();
  const [subject, setSubject] = useState('all');
  const [difficulty, setDifficulty] = useState('mixed');
  const [starting, setStarting] = useState<string | null>(null);
  const [startError, setStartError] = useState(false);
  const { data: subjects = [] } = useQuery({
    queryKey: ['subjects'],
    queryFn: subjectsApi.list,
    staleTime: 10 * 60 * 1000,
  });

  async function startSession(mode: 'quick' | 'drill') {
    setStarting(mode);
    setStartError(false);
    try {
      const dto: CreateSessionDto = {
        mode,
        difficulty: difficulty as CreateSessionDto['difficulty'],
        ...(subject !== 'all' ? { subjectId: subject } : {}),
      };
      const data = await practiceApi.createSession(dto);
      navigate(`/practice/sessions/${data.session.id}?q=1`, { state: data });
    } catch {
      setStartError(true);
      setStarting(null);
    }
  }

  return (
    <div className="view-in pb-6 lg:pb-0">
      <div className="lg:grid lg:grid-cols-[1fr_300px] lg:gap-8 lg:items-start">

        {/* ── Left column ── */}
        <div>
          <div className="px-5 pt-4 pb-3 lg:px-0 lg:pt-0">
            <div className="text-[11px] uppercase tracking-[0.14em] text-ink-muted dark:text-ink-muted-dark font-mono">Practice</div>
            <h1 className="mt-1 text-[22px] lg:text-[26px] font-semibold tracking-tight text-ink dark:text-ink-dark">
              What are we drilling today?
            </h1>
          </div>

          {/* Subject chips */}
          <div className="flex gap-2 overflow-x-auto no-scrollbar px-5 lg:px-0 pb-3">
            <Chip active={subject === 'all'} onClick={() => setSubject('all')}>All subjects</Chip>
            {subjects.map((s) => (
              <Chip key={s.id} active={subject === s.id} onClick={() => setSubject(s.id)}>{s.label}</Chip>
            ))}
          </div>

          <div className="px-5 lg:px-0 mt-2">
            {/* Difficulty */}
            <div className="flex items-center justify-between mb-4">
              <div className="text-[11px] uppercase tracking-[0.14em] text-ink-muted dark:text-ink-muted-dark font-mono">Difficulty</div>
              <Segmented
                value={difficulty}
                onChange={setDifficulty}
                options={[
                  { label: 'Easy',   value: 'easy'   },
                  { label: 'Medium', value: 'medium' },
                  { label: 'Hard',   value: 'hard'   },
                  { label: 'Mixed',  value: 'mixed'  },
                ]}
              />
            </div>

            {/* Mode cards */}
            {startError && (
              <p className="mb-3 text-[13px] text-bad text-center">
                Couldn't start session. Check your connection and try again.
              </p>
            )}
            <div className="space-y-3">
              {MODES.map((m) => {
                const isLoading = starting === m.id;
                const clickable = m.id === 'quick' || m.id === 'drill';
                return (
                  <Card
                    key={m.id}
                    padded={false}
                    onClick={clickable && !starting ? () => startSession(m.id as 'quick' | 'drill') : undefined}
                    className={cn(!clickable && 'opacity-50 cursor-not-allowed')}
                  >
                    <div className="p-5 flex items-start gap-4">
                      <div className={cn('shrink-0 w-12 h-12 rounded-xl2 flex items-center justify-center', iconBg[m.tone])}>
                        <m.Icon size={22} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <div className="text-[16px] font-semibold text-ink dark:text-ink-dark tracking-tight">{m.title}</div>
                          <span className="font-mono text-[11px] text-ink-muted dark:text-ink-muted-dark tab-num">{m.meta}</span>
                        </div>
                        <div className="text-[13px] text-ink-muted dark:text-ink-muted-dark mt-0.5">
                          {isLoading ? 'Starting…' : m.desc}
                        </div>
                      </div>
                      <ArrowUpRight size={16} className="text-ink-muted dark:text-ink-muted-dark mt-1" />
                    </div>
                  </Card>
                );
              })}
            </div>

            {/* Recent attempts — mobile only */}
            <div className="mt-7 lg:hidden">
              <SectionHeader eyebrow="History" title="Recent attempts" action="All history" onAction={() => navigate('/practice/history')} />
              <RecentAttemptsCard />
            </div>
          </div>
        </div>

        {/* ── Right column (desktop) ── */}
        <div className="hidden lg:flex flex-col gap-4 lg:sticky lg:top-20">

          {/* This week bar chart */}
          <Card>
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-[11px] uppercase tracking-[0.14em] text-ink-muted dark:text-ink-muted-dark font-mono">This week</div>
                <div className="text-[15px] font-semibold text-ink dark:text-ink-dark mt-0.5">71 solved</div>
              </div>
              <BarChart2 size={18} className="text-ink-muted dark:text-ink-muted-dark" />
            </div>
            <div className="flex items-end gap-1.5 h-16">
              {WEEKLY_STATS.map((d) => (
                <div key={d.day} className="flex-1 flex flex-col items-center gap-1">
                  <div
                    className="w-full rounded-sm bg-accent/80 dark:bg-accent/70 transition-all"
                    style={{ height: d.count === 0 ? '3px' : `${(d.count / maxCount) * 100}%`, opacity: d.count === 0 ? 0.2 : 1 }}
                  />
                  <div className="text-[9px] font-mono text-ink-muted dark:text-ink-muted-dark">{d.day}</div>
                </div>
              ))}
            </div>
          </Card>

          {/* Subject performance */}
          <Card>
            <div className="text-[11px] uppercase tracking-[0.14em] text-ink-muted dark:text-ink-muted-dark font-mono mb-3">Subject accuracy</div>
            <div className="space-y-2.5">
              {[
                { label: 'Chemistry',        pct: 81 },
                { label: 'English',          pct: 88 },
                { label: 'Mathematics',      pct: 72 },
                { label: 'Physics',          pct: 64 },
                { label: 'Logical Reasoning',pct: 53 },
                { label: 'Biology',          pct: 47 },
              ].map((s) => (
                <div key={s.label}>
                  <div className="flex items-baseline justify-between mb-1">
                    <span className="text-[12.5px] text-ink dark:text-ink-dark">{s.label}</span>
                    <span className="font-mono text-[11.5px] tab-num text-ink dark:text-ink-dark">{s.pct}%</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-paper dark:bg-paper-dark overflow-hidden border border-line dark:border-line-dark">
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${s.pct}%`, background: s.pct >= 75 ? '#3D7A4E' : s.pct >= 55 ? '#D4541A' : '#C8941E' }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Recent attempts */}
          <div>
            <SectionHeader eyebrow="History" title="Recent attempts" action="All" onAction={() => navigate('/practice/history')} />
            <RecentAttemptsCard />
          </div>
        </div>
      </div>
    </div>
  );
}

function RecentAttemptsCard() {
  const navigate = useNavigate();
  const { data, isLoading } = useQuery({
    queryKey: ['practice-sessions', { limit: 5 }],
    queryFn:  () => practiceApi.listSessions({ limit: 5 }),
    staleTime: 30 * 1000,
  });

  if (isLoading) {
    return (
      <Card padded={false}>
        <div className="px-4 py-6 text-center text-[12.5px] text-ink-muted dark:text-ink-muted-dark">Loading…</div>
      </Card>
    );
  }

  const attempts = data?.data ?? [];
  if (attempts.length === 0) {
    return (
      <Card padded={false}>
        <div className="px-4 py-6 text-center text-[12.5px] text-ink-muted dark:text-ink-muted-dark">
          No attempts yet. Start a practice to see your history.
        </div>
      </Card>
    );
  }

  return (
    <Card padded={false}>
      <ul className="divide-y divide-line dark:divide-line-dark">
        {attempts.map((a) => {
          const kind = MODE_LABEL[a.mode] ?? a.mode;
          const subjectLabel = sessionSubjectLabel(a);
          const denom = a.questionCount || a.total;
          const acc = a.accuracy ?? 0;
          const finished = !!a.finishedAt;
          return (
            <li key={a.id} className="px-4 py-3 flex items-center gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-[13.5px] font-medium text-ink dark:text-ink-dark">{kind}</span>
                  <span className="text-[12px] text-ink-muted dark:text-ink-muted-dark truncate">· {subjectLabel}</span>
                </div>
                <div className="mt-1 flex items-center gap-3 text-[12px] text-ink-muted dark:text-ink-muted-dark font-mono tab-num">
                  <span>{a.score}/{denom}</span>
                  {finished && (
                    <span className={cn(acc >= 75 ? 'text-good' : acc >= 60 ? 'text-warn' : 'text-bad')}>{Math.round(acc)}%</span>
                  )}
                  <span>{formatDuration(a.timeSpentSec)}</span>
                  <span className="ml-auto font-sans">{formatRelative(a.startedAt)}</span>
                </div>
              </div>
              <button
                onClick={() => navigate(`/practice/sessions/${a.id}?q=1`)}
                className="shrink-0 text-[12.5px] font-medium text-ink dark:text-ink-dark hover:text-accent"
              >
                {finished ? 'Review' : 'Resume'}
              </button>
            </li>
          );
        })}
      </ul>
    </Card>
  );
}
