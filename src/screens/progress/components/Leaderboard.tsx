import { ArrowUp, ArrowDown, Minus } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Avatar } from '@/components/ui/Avatar';
import { LEADERBOARD } from '@/constants/data';
import { cn } from '@/utils/cn';

export function Leaderboard() {
  return (
    <div>
      <SectionHeader eyebrow="This week" title="Leaderboard" action="Full list" />
      <Card padded={false}>
        <ul className="divide-y divide-line dark:divide-line-dark">
          {LEADERBOARD.map((p) => (
            <li
              key={p.id}
              className={cn(
                'px-4 py-3 flex items-center gap-3',
                p.you && 'bg-accent-soft/40 dark:bg-[#2A1B14]/40',
              )}
            >
              <span className="font-mono text-[13px] text-ink-muted dark:text-ink-muted-dark tab-num w-5">{p.rank}</span>
              <Avatar initial={p.avatar} tone={p.you ? 'accent' : 'neutral'} size={32} ring={p.you} />
              <div className="flex-1 min-w-0">
                <div className="text-[13.5px] font-medium text-ink dark:text-ink-dark">{p.name}</div>
                <div className="font-mono text-[11.5px] text-ink-muted dark:text-ink-muted-dark tab-num">{p.pts.toLocaleString()} pts</div>
              </div>
              <div
                className={cn(
                  'inline-flex items-center gap-0.5 font-mono text-[11.5px] tab-num',
                  p.change > 0 ? 'text-good' : p.change < 0 ? 'text-bad' : 'text-ink-muted dark:text-ink-muted-dark',
                )}
              >
                {p.change > 0 ? <ArrowUp size={12} /> : p.change < 0 ? <ArrowDown size={12} /> : <Minus size={12} />}
                {p.change !== 0 && Math.abs(p.change)}
              </div>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
