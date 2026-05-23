import { BookOpen, Target, Flame, Trophy } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { cn } from '@/utils/cn';
import { useUserProgress } from '../hooks/progress.hooks';

type Tone = 'ink' | 'good' | 'accent';
interface Stat { label: string; value: string; tone: Tone; Icon: LucideIcon }

const STATS: Stat[] = [
  { label: 'Solved', value: 'solved', tone: 'ink', Icon: BookOpen },
  { label: 'Accuracy', value: 'accuracy', tone: 'good', Icon: Target },
  { label: 'Streak', value: 'streak', tone: 'accent', Icon: Flame },
  { label: 'Rank', value: '#3', tone: 'ink', Icon: Trophy },
];

export function StatsGrid() {
  const { data: progress } = useUserProgress();
  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {STATS.map((s) => (
        <Card key={s.label} padded={false}>
          <div className="p-4">
            <div className="flex items-center gap-1.5 mb-1">
              <s.Icon size={13} className="text-ink-muted dark:text-ink-muted-dark" />
              <div className="text-[11px] uppercase tracking-[0.14em] text-ink-muted dark:text-ink-muted-dark font-mono">{s.label}</div>
            </div>
            <div
              className={cn(
                'font-mono text-[24px] font-semibold tab-num leading-none',
                s.tone === 'good' && 'text-good',
                s.tone === 'accent' && 'text-accent',
                s.tone === 'ink' && 'text-ink dark:text-ink-dark',
              )}
            >
              {progress?.[s?.value]}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
