import { useState } from 'react';
import { ChevronDown, ChevronUp, Check } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Flame } from '@/components/ui/Flame';
import { cn } from '@/utils/cn';

interface StreakCardProps {
  days: number;
  longestStreak: number;
  /** Sun..Sat order for "this week" (today is the last entry) */
  weekActive: boolean[];
}

const WEEK_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export function StreakCard({ days, longestStreak, weekActive }: StreakCardProps) {
  const [expanded, setExpanded] = useState(false);

  // weekActive is in chronological order ending today; build day-of-week labels accordingly
  const today = new Date();
  const todayDow = today.getDay(); // 0=Sun..6=Sat
  const labels = weekActive.map((_, i) => {
    const offsetFromToday = weekActive.length - 1 - i; // last entry = 0 (today)
    const dow = (todayDow - offsetFromToday + 7) % 7;
    return WEEK_LABELS[dow];
  });

  return (
    <Card padded={false} className="overflow-hidden">
      <button
        onClick={() => setExpanded((e) => !e)}
        className="w-full text-left p-4 flex items-start gap-4"
      >
        <div className="shrink-0 mt-0.5">
          <Flame size={28} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-2">
            <span className="font-mono text-[28px] leading-none font-semibold text-ink dark:text-ink-dark tab-num">
              {days}
            </span>
            <span className="text-[13px] text-ink-muted dark:text-ink-muted-dark">day streak</span>
          </div>
          <div className="text-[12px] text-ink-muted dark:text-ink-muted-dark mt-1">
            {longestStreak > 0
              ? <>longest <span className="font-mono tab-num">{longestStreak}</span></>
              : <>Keep going to set your first streak.</>}
          </div>
        </div>
        {expanded ? <ChevronUp size={16} className="text-ink-muted dark:text-ink-muted-dark mt-1" /> : <ChevronDown size={16} className="text-ink-muted dark:text-ink-muted-dark mt-1" />}
      </button>

      <div className={cn('grid transition-all duration-300 ease-out', expanded ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0')}>
        <div className="overflow-hidden">
          <div className="px-4 pb-4 pt-1 border-t border-line dark:border-line-dark">
            <div className="text-[11px] uppercase tracking-[0.14em] text-ink-muted dark:text-ink-muted-dark font-mono mb-2.5">
              This week
            </div>
            <div className="flex items-center justify-between">
              {weekActive.map((active, i) => {
                const isToday = i === weekActive.length - 1;
                return (
                  <div key={i} className="flex flex-col items-center gap-1.5">
                    <div className={cn(
                      'w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-mono',
                      active
                        ? 'bg-accent text-white'
                        : 'bg-paper dark:bg-paper-dark text-ink-muted dark:text-ink-muted-dark border border-line dark:border-line-dark',
                      isToday && 'ring-2 ring-accent/30 ring-offset-2 ring-offset-surface dark:ring-offset-surface-dark'
                    )}>
                      {active ? <Check size={12} strokeWidth={2.5} /> : ''}
                    </div>
                    <div className="text-[10px] text-ink-muted dark:text-ink-muted-dark font-mono">{labels[i]}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
