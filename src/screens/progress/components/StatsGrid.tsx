import { BookOpen, Target, Flame, Trophy } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { cn } from '@/utils/cn';
import { useUserProgress } from '../hooks/progress.hooks';

type Tone = 'ink' | 'good' | 'accent';
interface StatTile { label: string; value: string; tone: Tone; Icon: LucideIcon }

export function StatsGrid() {
  const { data: progress, isLoading } = useUserProgress();
  const placeholder = isLoading ? '…' : '—';

  const stats: StatTile[] = [
    { label: 'Solved',   value: progress ? progress.solved.toLocaleString() : placeholder, tone: 'ink',    Icon: BookOpen },
    { label: 'Accuracy', value: progress ? progress.accuracy                : placeholder, tone: 'good',   Icon: Target   },
    { label: 'Streak',   value: progress ? `${progress.streak}`             : placeholder, tone: 'accent', Icon: Flame    },
    { label: 'Rank',     value: progress ? `#${progress.rank}`              : placeholder, tone: 'ink',    Icon: Trophy   },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {stats.map((s) => (
        <Card key={s.label} padded={false}>
          <div className="p-4">
            <div className="flex items-center gap-1.5 mb-1">
              <s.Icon size={13} className="text-ink-muted dark:text-ink-muted-dark" />
              <div className="text-[11px] uppercase tracking-[0.14em] text-ink-muted dark:text-ink-muted-dark font-mono">{s.label}</div>
            </div>
            <div
              className={cn(
                'font-mono text-[24px] font-semibold tab-num leading-none',
                s.tone === 'good'   && 'text-good',
                s.tone === 'accent' && 'text-accent',
                s.tone === 'ink'    && 'text-ink dark:text-ink-dark',
              )}
            >
              {s.value}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
