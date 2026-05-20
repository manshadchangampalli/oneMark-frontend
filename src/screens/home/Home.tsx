import { useNavigate } from 'react-router-dom';
import { Users, CalendarClock, ChevronRight, ArrowRight, BookOpen, Trophy, Flame, CheckCircle2 } from 'lucide-react';
import { Card, Button, SectionHeader, Pill, ProgressRing, Mascot } from '@/components/ui';
import { TOPICS, RECOMMENDED, SUBJECTS } from '@/constants';
import { useAuthStore } from '@/store/useAuthStore';
import { useDailyChallenge } from './hooks/home.hooks';
import { StreakCard } from './components';

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

function todayLabel() {
  return new Date().toLocaleDateString('en-IN', { weekday: 'long', month: 'long', day: 'numeric' });
}

export default function Home() {
  const navigate = useNavigate();
  const user = useAuthStore(s => s.user);
  const firstName = user?.name?.split(' ')[0] ?? 'there';
  const { data: dailyChallenge, isLoading: dcLoading } = useDailyChallenge();

  const totalAttempts = user?.totalAttempts ?? 0;
  const totalCorrect  = user?.totalCorrect ?? 0;
  const accuracy = totalAttempts > 0 ? Math.round((totalCorrect / totalAttempts) * 100) : 0;

  return (
    <div className="view-in pb-6 lg:pb-0">
      {/* Mobile pull indicator */}
      <div className="flex justify-center -mt-2 mb-1 lg:hidden">
        <div className="h-1 w-10 rounded-full bg-line dark:bg-line-dark" />
      </div>

      <div className="lg:grid lg:grid-cols-[1fr_300px] lg:gap-8 lg:items-start">

        {/* ── Left column ── */}
        <div>
          {/* Greeting */}
          <div className="px-5 pt-3 pb-5 lg:px-0 lg:pt-0 lg:pb-6 flex items-start justify-between gap-3">
            <div>
              <div className="text-[11px] uppercase tracking-[0.14em] text-ink-muted dark:text-ink-muted-dark font-mono">
                {todayLabel()}
              </div>
              <h1 className="mt-1 text-[24px] lg:text-[28px] leading-tight font-semibold text-ink dark:text-ink-dark tracking-tight">
                {greeting()},<br />
                <span className="font-serif italic font-normal">{firstName}.</span>
              </h1>
              <p className="hidden lg:block mt-2 text-[14px] text-ink-muted dark:text-ink-muted-dark">
                You've solved <span className="font-mono font-medium text-ink dark:text-ink-dark">{totalAttempts.toLocaleString()}</span> questions
                {accuracy > 0 && <> · <span className="font-mono font-medium text-ink dark:text-ink-dark">{accuracy}%</span> accuracy</>}
                {totalAttempts > 0 && <> · <span className="text-good font-medium">keep going!</span></>}
              </p>
            </div>
            <Mascot />
          </div>

          {/* Streak — mobile only (desktop: right panel) */}
          <div className="px-5 lg:hidden mb-5">
            <StreakCard days={23} freezes={2} />
          </div>

          {/* Daily challenge */}
          <div className="px-5 lg:px-0 mb-5">
            <SectionHeader eyebrow="Daily challenge" title="One question, every day" />
            <Card padded={false} className="overflow-hidden">
              {dcLoading ? (
                <div className="p-5 space-y-3 animate-pulse">
                  <div className="flex gap-2">
                    <div className="h-5 w-20 rounded-full bg-line dark:bg-line-dark" />
                    <div className="h-5 w-16 rounded-full bg-line dark:bg-line-dark" />
                  </div>
                  <div className="space-y-2">
                    <div className="h-4 w-full rounded bg-line dark:bg-line-dark" />
                    <div className="h-4 w-4/5 rounded bg-line dark:bg-line-dark" />
                    <div className="h-4 w-3/5 rounded bg-line dark:bg-line-dark" />
                  </div>
                </div>
              ) : dailyChallenge ? (
                <>
                  <div className="p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <Pill tone="accent">{dailyChallenge.question.difficulty}</Pill>
                      {dailyChallenge.myAttempt && (
                        <Pill tone="good">Solved</Pill>
                      )}
                      <span className="ml-auto font-mono text-[11px] text-ink-muted dark:text-ink-muted-dark tab-num">
                        +{dailyChallenge.question.xpReward + dailyChallenge.dailyBonus} XP
                      </span>
                    </div>
                    <p className="font-serif text-[16.5px] leading-snug text-ink dark:text-ink-dark">
                      {dailyChallenge.question.revision.prompt}
                    </p>
                  </div>
                  <div className="flex items-center justify-between border-t border-line dark:border-line-dark px-5 py-3">
                    <div className="text-[12px] text-ink-muted dark:text-ink-muted-dark inline-flex items-center gap-1.5">
                      <Users size={13} />
                      <span>
                        <span className="font-mono tab-num">{dailyChallenge.totalSolvers.toLocaleString()}</span> solved today
                      </span>
                    </div>
                    {dailyChallenge.myAttempt ? (
                      <div className="inline-flex items-center gap-1.5 text-[13px] text-good font-medium">
                        <CheckCircle2 size={15} />
                        Done
                      </div>
                    ) : (
                      <Button iconRight={ArrowRight} onClick={() => navigate(`/question/${dailyChallenge.id}`)}>
                        Solve now
                      </Button>
                    )}
                  </div>
                </>
              ) : (
                <div className="p-5 text-[14px] text-ink-muted dark:text-ink-muted-dark">
                  No challenge available today.
                </div>
              )}
            </Card>
          </div>

          {/* Continue learning */}
          <div className="px-5 lg:px-0 mb-5">
            <SectionHeader eyebrow="In progress" title="Continue learning" action="See all" />
            <div className="flex gap-3 overflow-x-auto no-scrollbar -mx-5 px-5 lg:mx-0 lg:px-0 pb-1 lg:grid lg:grid-cols-2">
              {TOPICS.map((t) => {
                const pct = Math.round((t.done / t.total) * 100);
                return (
                  <Card key={t.id} className="shrink-0 w-[220px] lg:w-auto" padded={false}>
                    <div className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="text-[10.5px] uppercase tracking-[0.12em] text-ink-muted dark:text-ink-muted-dark font-mono">
                          {t.subject}
                        </div>
                        <ProgressRing value={pct} size={36} stroke={3} color={t.color} />
                      </div>
                      <div className="mt-2 text-[15px] font-medium text-ink dark:text-ink-dark leading-tight">{t.title}</div>
                      <div className="mt-3 flex items-baseline gap-1.5">
                        <span className="font-mono text-[13px] text-ink dark:text-ink-dark tab-num">{t.done}</span>
                        <span className="font-mono text-[12px] text-ink-muted dark:text-ink-muted-dark tab-num">/ {t.total}</span>
                        <span className="ml-auto font-mono text-[11px] text-ink-muted dark:text-ink-muted-dark tab-num">{pct}%</span>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Recommended */}
          <div className="px-5 lg:px-0">
            <SectionHeader eyebrow="From your weak areas" title="Recommended" />
            <div className="space-y-2.5">
              {RECOMMENDED.map((r) => (
                <Card key={r.id} padded={false} onClick={() => {}}>
                  <div className="p-4 flex items-center gap-3">
                    <div className="shrink-0 w-10 h-10 rounded-lg bg-paper dark:bg-paper-dark border border-line dark:border-line-dark flex items-center justify-center">
                      <span className="font-mono text-[11px] text-ink-muted dark:text-ink-muted-dark">
                        {SUBJECTS.find((s) => s.label === r.subject)?.short ?? '—'}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[14.5px] font-medium text-ink dark:text-ink-dark truncate">{r.title}</div>
                      <div className="text-[12px] text-ink-muted dark:text-ink-muted-dark truncate">{r.reason}</div>
                    </div>
                    <ChevronRight size={16} className="text-ink-muted dark:text-ink-muted-dark" />
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* ── Right column (desktop only) ── */}
        <div className="hidden lg:flex flex-col gap-4 lg:sticky lg:top-20">

          {/* Streak */}
          <StreakCard days={23} freezes={2} />

          {/* Quick stats */}
          <Card padded={false}>
            <div className="p-4 border-b border-line dark:border-line-dark">
              <div className="text-[11px] uppercase tracking-[0.14em] text-ink-muted dark:text-ink-muted-dark font-mono">Your stats</div>
            </div>
            <div className="grid grid-cols-2 divide-x divide-y divide-line dark:divide-line-dark">
              {[
                { label: 'Solved',   value: totalAttempts.toLocaleString(),          icon: BookOpen, color: 'text-ink dark:text-ink-dark' },
                { label: 'Accuracy', value: totalAttempts > 0 ? `${accuracy}%` : '—', icon: Trophy,   color: 'text-good' },
                { label: 'Streak',   value: '23d',                                    icon: Flame,    color: 'text-accent' },
                { label: 'XP',       value: (user?.totalXp ?? 0).toLocaleString(),    icon: Trophy,   color: 'text-warn' },
              ].map((s) => (
                <div key={s.label} className="p-3">
                  <div className="text-[10px] uppercase tracking-[0.12em] text-ink-muted dark:text-ink-muted-dark font-mono">{s.label}</div>
                  <div className={`mt-0.5 font-mono text-[20px] font-semibold tab-num leading-none ${s.color}`}>{s.value}</div>
                </div>
              ))}
            </div>
          </Card>

          {/* Mock test reminder */}
          <Card padded={false}>
            <div className="p-4 flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-warn-soft text-warn dark:bg-[#3A2E14] dark:text-[#E5C672] flex items-center justify-center shrink-0">
                <CalendarClock size={17} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[13.5px] font-medium text-ink dark:text-ink-dark">
                  Full mock in <span className="font-mono tab-num">3</span> days
                </div>
                <div className="text-[12px] text-ink-muted dark:text-ink-muted-dark">JEE-style · 90 questions · 3 hours</div>
              </div>
            </div>
            <div className="border-t border-line dark:border-line-dark px-4 py-2.5">
              <Button variant="secondary" size="sm" className="w-full">Set reminder</Button>
            </div>
          </Card>

          {/* Study tip */}
          <Card>
            <div className="text-[11px] uppercase tracking-[0.14em] text-ink-muted dark:text-ink-muted-dark font-mono mb-2">Tip of the day</div>
            <p className="text-[13.5px] text-ink dark:text-ink-dark leading-relaxed font-serif">
              For range formula problems, always check if launch and landing are at the same height before using <span className="font-mono text-[12px]">R = v²sin(2θ)/g</span>.
            </p>
          </Card>
        </div>
      </div>

      {/* Mobile-only: mock test reminder */}
      <div className="px-5 mt-5 lg:hidden">
        <Card padded={false} className="border-dashed">
          <div className="p-4 flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-warn-soft text-warn dark:bg-[#3A2E14] dark:text-[#E5C672] flex items-center justify-center">
              <CalendarClock size={17} />
            </div>
            <div className="flex-1">
              <div className="text-[13.5px] font-medium text-ink dark:text-ink-dark">Full mock in <span className="font-mono tab-num">3</span> days</div>
              <div className="text-[12px] text-ink-muted dark:text-ink-muted-dark">JEE-style · 90 questions · 3 hours</div>
            </div>
            <button className="text-[12.5px] text-ink-muted dark:text-ink-muted-dark hover:text-ink dark:hover:text-ink-dark">Remind me</button>
          </div>
        </Card>
      </div>
    </div>
  );
}
