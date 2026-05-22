import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, SectionHeader, Avatar } from '@/components/ui';
import { MASTERY, ACHIEVEMENTS, LEADERBOARD } from '@/constants';
import { usersApi, type ActivityDay } from '@/api/users.api';

const HEATMAP_WEEKS = 52;

interface HeatmapCell { lvl: number; date: string; count: number }

function gridFromActivity(activity: ActivityDay[], weeks: number): HeatmapCell[][] {
  const byDate = new Map(activity.map(a => [a.date, a]));
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);
  const dow = today.getUTCDay(); // 0=Sun..6=Sat — leftmost cell starts on a Sunday

  const start = new Date(today);
  start.setUTCDate(start.getUTCDate() - ((weeks - 1) * 7 + dow));

  const grid: HeatmapCell[][] = [];
  for (let w = 0; w < weeks; w++) {
    const col: HeatmapCell[] = [];
    for (let d = 0; d < 7; d++) {
      const cell = new Date(start);
      cell.setUTCDate(start.getUTCDate() + w * 7 + d);
      const key = cell.toISOString().slice(0, 10);
      if (cell > today) {
        col.push({ lvl: -1, date: key, count: 0 });
      } else {
        const hit = byDate.get(key);
        col.push({ lvl: hit?.level ?? 0, date: key, count: hit?.count ?? 0 });
      }
    }
    grid.push(col);
  }
  return grid;
}
import { cn } from '@/utils';
import { Lock, ArrowUp, ArrowDown, Minus, Medal, Flame, Trophy, Moon, MessageSquare, BookOpen, Target } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

const ACHIEVEMENT_ICONS: Record<string, LucideIcon> = {
  medal: Medal, flame: Flame, trophy: Trophy, moon: Moon, 'message-square': MessageSquare,
};

const STATS = [
  { label: 'Solved',   value: '1,284', tone: 'ink'    as const, Icon: BookOpen },
  { label: 'Accuracy', value: '76%',   tone: 'good'   as const, Icon: Target   },
  { label: 'Streak',   value: '23',    tone: 'accent' as const, Icon: Flame    },
  { label: 'Rank',     value: '#3',    tone: 'ink'    as const, Icon: Trophy   },
];

function lvlColor(lvl: number, dark: boolean): string {
  if (lvl === -1) return 'transparent';
  if (dark) return ['#221F18','#3A2E1E','#7A3D14','#B7491A','#E8580C'][lvl] ?? 'transparent';
  return ['#F1ECE0','#F5D9C4','#EFAE85','#E07A45','#D4541A'][lvl] ?? 'transparent';
}

export default function Progress() {
  const { data: activity = [] } = useQuery({
    queryKey: ['user-activity', { days: HEATMAP_WEEKS * 7 }],
    queryFn:  () => usersApi.getActivity(HEATMAP_WEEKS * 7),
    staleTime: 5 * 60 * 1000,
  });
  const heatmap     = useMemo(() => gridFromActivity(activity, HEATMAP_WEEKS), [activity]);
  const totalActive = useMemo(() => activity.filter(a => a.count > 0).length, [activity]);

  return (
    <div className="view-in pb-6 lg:pb-0">
      <div className="lg:grid lg:grid-cols-[1fr_320px] lg:gap-8 lg:items-start">

        {/* ── Left column ── */}
        <div>
          <div className="px-5 pt-4 pb-2 lg:px-0 lg:pt-0">
            <div className="text-[11px] uppercase tracking-[0.14em] text-ink-muted dark:text-ink-muted-dark font-mono">Progress</div>
            <h1 className="mt-1 text-[22px] lg:text-[26px] font-semibold tracking-tight text-ink dark:text-ink-dark">
              Your study, at a glance.
            </h1>
          </div>

          <div className="px-5 lg:px-0 mt-3 space-y-5">
            {/* Stats grid */}
            <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
              {STATS.map((s) => (
                <Card key={s.label} padded={false}>
                  <div className="p-4">
                    <div className="flex items-center gap-1.5 mb-1">
                      <s.Icon size={13} className="text-ink-muted dark:text-ink-muted-dark" />
                      <div className="text-[11px] uppercase tracking-[0.14em] text-ink-muted dark:text-ink-muted-dark font-mono">{s.label}</div>
                    </div>
                    <div className={cn('font-mono text-[24px] font-semibold tab-num leading-none', s.tone === 'good' && 'text-good', s.tone === 'accent' && 'text-accent', s.tone === 'ink' && 'text-ink dark:text-ink-dark')}>
                      {s.value}
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Mastery */}
            <div>
              <SectionHeader eyebrow="Mastery" title="By subject" />
              <Card>
                <ul className="space-y-3.5">
                  {MASTERY.map((m) => (
                    <li key={m.id}>
                      <div className="flex items-baseline justify-between mb-1.5">
                        <span className="text-[13.5px] text-ink dark:text-ink-dark">{m.label}</span>
                        <span className="font-mono text-[12.5px] text-ink dark:text-ink-dark tab-num">{m.pct}%</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-paper dark:bg-paper-dark overflow-hidden border border-line dark:border-line-dark">
                        <div className="h-full rounded-full transition-all" style={{ width: `${m.pct}%`, background: m.pct >= 75 ? '#3D7A4E' : m.pct >= 55 ? '#D4541A' : '#C8941E' }} />
                      </div>
                    </li>
                  ))}
                </ul>
              </Card>
            </div>

            {/* Achievements */}
            <div>
              <SectionHeader eyebrow="Badges" title="Achievements" action="See all" />
              <div className="grid grid-cols-3 gap-2.5">
                {ACHIEVEMENTS.map((a) => {
                  const AchIcon = a.unlocked ? (ACHIEVEMENT_ICONS[a.icon] ?? Medal) : Lock;
                  return (
                    <Card key={a.id} padded={false} className={cn(!a.unlocked && 'opacity-55')}>
                      <div className="p-3 flex flex-col items-center text-center">
                        <div className={cn('w-10 h-10 rounded-full flex items-center justify-center mb-2', a.unlocked ? 'bg-accent-soft text-accent dark:bg-[#3A2218] dark:text-[#F4B89B]' : 'bg-paper dark:bg-paper-dark text-ink-muted dark:text-ink-muted-dark border border-line dark:border-line-dark border-dashed')}>
                          <AchIcon size={16} />
                        </div>
                        <div className="text-[12px] font-medium text-ink dark:text-ink-dark leading-tight">{a.label}</div>
                        <div className="text-[10.5px] text-ink-muted dark:text-ink-muted-dark mt-0.5 leading-tight">{a.sub}</div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* ── Right column ── */}
        <div className="px-5 lg:px-0 mt-5 lg:mt-0 space-y-4 lg:sticky lg:top-20">

          {/* Activity heatmap */}
          <Card>
            <div className="flex items-center justify-between mb-3">
              <div>
                <div className="text-[11px] uppercase tracking-[0.14em] text-ink-muted dark:text-ink-muted-dark font-mono">Activity</div>
                <div className="text-[14px] font-medium text-ink dark:text-ink-dark mt-0.5">Last 52 weeks</div>
              </div>
              <div className="text-[11.5px] font-mono text-ink-muted dark:text-ink-muted-dark tab-num">
                <span className="text-ink dark:text-ink-dark">{totalActive}</span> active days
              </div>
            </div>
            <div className="overflow-x-auto no-scrollbar">
              <div className="flex gap-[3px]">
                {heatmap.map((col, w) => (
                  <div key={w} className="flex flex-col gap-[3px]">
                    {col.map((cell, d) => (
                      <HeatCell
                        key={d}
                        lvl={cell.lvl}
                        title={cell.lvl === -1 ? undefined : `${cell.date} · ${cell.count} ${cell.count === 1 ? 'attempt' : 'attempts'}`}
                      />
                    ))}
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-3 flex items-center justify-end gap-2 text-[11px] text-ink-muted dark:text-ink-muted-dark font-mono">
              <span>less</span>
              {[0,1,2,3,4].map((l) => <HeatLegend key={l} lvl={l} />)}
              <span>more</span>
            </div>
          </Card>

          {/* Leaderboard */}
          <div>
            <SectionHeader eyebrow="This week" title="Leaderboard" action="Full list" />
            <Card padded={false}>
              <ul className="divide-y divide-line dark:divide-line-dark">
                {LEADERBOARD.map((p) => (
                  <li key={p.id} className={cn('px-4 py-3 flex items-center gap-3', p.you && 'bg-accent-soft/40 dark:bg-[#2A1B14]/40')}>
                    <span className="font-mono text-[13px] text-ink-muted dark:text-ink-muted-dark tab-num w-5">{p.rank}</span>
                    <Avatar initial={p.avatar} tone={p.you ? 'accent' : 'neutral'} size={32} ring={p.you} />
                    <div className="flex-1 min-w-0">
                      <div className="text-[13.5px] font-medium text-ink dark:text-ink-dark">{p.name}</div>
                      <div className="font-mono text-[11.5px] text-ink-muted dark:text-ink-muted-dark tab-num">{p.pts.toLocaleString()} pts</div>
                    </div>
                    <div className={cn('inline-flex items-center gap-0.5 font-mono text-[11.5px] tab-num', p.change > 0 ? 'text-good' : p.change < 0 ? 'text-bad' : 'text-ink-muted dark:text-ink-muted-dark')}>
                      {p.change > 0 ? <ArrowUp size={12} /> : p.change < 0 ? <ArrowDown size={12} /> : <Minus size={12} />}
                      {p.change !== 0 && Math.abs(p.change)}
                    </div>
                  </li>
                ))}
              </ul>
            </Card>
          </div>

          {/* Study streak summary */}
          <Card>
            <div className="text-[11px] uppercase tracking-[0.14em] text-ink-muted dark:text-ink-muted-dark font-mono mb-3">Streak history</div>
            <div className="space-y-2">
              {[
                { label: 'Current streak', value: '23 days', accent: true },
                { label: 'Longest streak', value: '41 days', accent: false },
                { label: 'Total active days', value: '412 days', accent: false },
                { label: 'This month', value: '28 / 30 days', accent: false },
              ].map((s) => (
                <div key={s.label} className="flex items-center justify-between">
                  <span className="text-[13px] text-ink-muted dark:text-ink-muted-dark">{s.label}</span>
                  <span className={cn('font-mono text-[13px] font-medium tab-num', s.accent ? 'text-accent' : 'text-ink dark:text-ink-dark')}>{s.value}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

function HeatCell({ lvl, title }: { lvl: number; title?: string }) {
  return (
    <div
      title={title}
      className="w-[14px] h-[14px] rounded-[3px] border border-black/4 dark:border-white/4 relative overflow-hidden"
    >
      <div className="absolute inset-0 block dark:hidden" style={{ background: lvlColor(lvl, false) }} />
      <div className="absolute inset-0 hidden dark:block" style={{ background: lvlColor(lvl, true) }} />
    </div>
  );
}

function HeatLegend({ lvl }: { lvl: number }) {
  return (
    <span className="relative inline-block w-[10px] h-[10px] rounded-sm overflow-hidden">
      <span className="absolute inset-0 block dark:hidden" style={{ background: lvlColor(lvl, false) }} />
      <span className="absolute inset-0 hidden dark:block" style={{ background: lvlColor(lvl, true) }} />
    </span>
  );
}
