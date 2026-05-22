import { Card } from '@/components/ui/Card';
import { cn } from '@/utils/cn';

const ROWS = [
  { label: 'Current streak',    value: '23 days',      accent: true  },
  { label: 'Longest streak',    value: '41 days',      accent: false },
  { label: 'Total active days', value: '412 days',     accent: false },
  { label: 'This month',        value: '28 / 30 days', accent: false },
];

export function StreakHistory() {
  return (
    <Card>
      <div className="text-[11px] uppercase tracking-[0.14em] text-ink-muted dark:text-ink-muted-dark font-mono mb-3">Streak history</div>
      <div className="space-y-2">
        {ROWS.map((s) => (
          <div key={s.label} className="flex items-center justify-between">
            <span className="text-[13px] text-ink-muted dark:text-ink-muted-dark">{s.label}</span>
            <span
              className={cn(
                'font-mono text-[13px] font-medium tab-num',
                s.accent ? 'text-accent' : 'text-ink dark:text-ink-dark',
              )}
            >
              {s.value}
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
}
