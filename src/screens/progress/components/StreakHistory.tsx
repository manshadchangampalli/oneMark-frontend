import { Card } from '@/components/ui/Card';
import { cn } from '@/utils/cn';
import { useUserStats } from '@/screens/profile/hooks/profile.hooks';
import { useUserActivity } from '../hooks/progress.hooks';

function daysInCurrentMonth(): number {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
}

function activeDaysThisMonth(activity: { date: string; count: number }[]): number {
  const now = new Date();
  const yyyymm = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  return activity.filter(d => d.count > 0 && d.date.startsWith(yyyymm)).length;
}

interface Row { label: string; value: string; accent: boolean }

export function StreakHistory() {
  const { data: stats }         = useUserStats();
  const { data: activity365 = [] } = useUserActivity(365);
  const { data: activity31  = [] } = useUserActivity(31);

  const totalActive = activity365.filter(d => d.count > 0).length;
  const thisMonth   = activeDaysThisMonth(activity31);
  const monthDays   = daysInCurrentMonth();

  const placeholder = '—';
  const rows: Row[] = [
    { label: 'Current streak',    value: stats        ? `${stats.streak} days`        : placeholder, accent: true  },
    { label: 'Longest streak',    value: stats        ? `${stats.longestStreak} days` : placeholder, accent: false },
    { label: 'Total active days', value: `${totalActive} days`,                                      accent: false },
    { label: 'This month',        value: `${thisMonth} / ${monthDays} days`,                        accent: false },
  ];

  return (
    <Card>
      <div className="text-[11px] uppercase tracking-[0.14em] text-ink-muted dark:text-ink-muted-dark font-mono mb-3">Streak history</div>
      <div className="space-y-2">
        {rows.map((s) => (
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
