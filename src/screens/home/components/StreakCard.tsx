import { useState } from 'react';
import { ChevronDown, ChevronUp, Check } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Flame } from '@/components/ui/Flame';
import { cn } from '@/utils/cn';
import { WEEK, WEEK_ACTIVE } from '@/constants/data';

interface StreakCardProps {
  days: number;
  freezes: number;
}

export function StreakCard({ days, freezes }: StreakCardProps) {
  const [expanded, setExpanded] = useState(false);
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
            <span className="font-mono tab-num">{freezes}</span> freezes available · longest <span className="font-mono tab-num">41</span>
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
              {WEEK.map((d, i) => {
                const active = WEEK_ACTIVE[i];
                const today = i === 5;
                return (
                  <div key={i} className="flex flex-col items-center gap-1.5">
                    <div className={cn(
                      'w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-mono',
                      active
                        ? 'bg-accent text-white'
                        : 'bg-paper dark:bg-paper-dark text-ink-muted dark:text-ink-muted-dark border border-line dark:border-line-dark',
                      today && 'ring-2 ring-accent/30 ring-offset-2 ring-offset-surface dark:ring-offset-surface-dark'
                    )}>
                      {active ? <Check size={12} strokeWidth={2.5} /> : ''}
                    </div>
                    <div className="text-[10px] text-ink-muted dark:text-ink-muted-dark font-mono">{d}</div>
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
