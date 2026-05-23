import { Card } from '@/components/ui/Card';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Avatar } from '@/components/ui/Avatar';
import { cn } from '@/utils/cn';
import { useLeaderboard } from '../hooks/progress.hooks';

export function Leaderboard() {
  const { data, isLoading } = useLeaderboard({ scope: 'exam', limit: 10 });
  const rows = data?.top ?? [];

  return (
    <div>
      <SectionHeader
        eyebrow={data?.scope === 'global' ? 'Global' : 'In your exam'}
        title="Leaderboard"
        action={data && data.total > rows.length ? 'Full list' : undefined}
      />
      <Card padded={false}>
        {isLoading ? (
          <div className="px-4 py-6 text-center text-[12.5px] text-ink-muted dark:text-ink-muted-dark">Loading…</div>
        ) : rows.length === 0 ? (
          <div className="px-4 py-6 text-center text-[12.5px] text-ink-muted dark:text-ink-muted-dark">
            No one on the board yet — be the first.
          </div>
        ) : (
          <ul className="divide-y divide-line dark:divide-line-dark">
            {rows.map((p) => (
              <li
                key={p.userId}
                className={cn(
                  'px-4 py-3 flex items-center gap-3',
                  p.isMe && 'bg-accent-soft/40 dark:bg-[#2A1B14]/40',
                )}
              >
                <span className="font-mono text-[13px] text-ink-muted dark:text-ink-muted-dark tab-num w-5">{p.rank}</span>
                <Avatar
                  initial={p.avatarInitial ?? p.name?.[0] ?? '?'}
                  tone={p.isMe ? 'accent' : 'neutral'}
                  size={32}
                  ring={p.isMe}
                />
                <div className="flex-1 min-w-0">
                  <div className="text-[13.5px] font-medium text-ink dark:text-ink-dark truncate">
                    {p.isMe ? 'You' : p.name}
                  </div>
                  <div className="font-mono text-[11.5px] text-ink-muted dark:text-ink-muted-dark tab-num">
                    {p.xp.toLocaleString()} XP
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
