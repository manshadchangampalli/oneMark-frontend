import { Card } from '@/components/ui/Card';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { useUserMastery } from '../hooks/progress.hooks';

export function MasterySection() {
  const { data: mastery = [], isLoading } = useUserMastery();

  return (
    <div>
      <SectionHeader eyebrow="Mastery" title="By subject" />
      <Card>
        {isLoading ? (
          <div className="py-4 text-center text-[12.5px] text-ink-muted dark:text-ink-muted-dark">Loading…</div>
        ) : mastery.length === 0 ? (
          <div className="py-4 text-center text-[12.5px] text-ink-muted dark:text-ink-muted-dark">
            Attempt some questions to build your mastery.
          </div>
        ) : (
          <ul className="space-y-3.5">
            {mastery.map((m) => (
              <li key={m.subjectId}>
                <div className="flex items-baseline justify-between mb-1.5">
                  <span className="flex items-center gap-2 text-[13.5px] text-ink dark:text-ink-dark">
                    <span
                      className="h-2.5 w-2.5 rounded-full shrink-0"
                      style={{ background: m.colorHex }}
                    />
                    {m.label}
                  </span>
                  <span className="font-mono text-[12.5px] text-ink dark:text-ink-dark tab-num">
                    {m.pct}%
                    <span className="text-ink-muted dark:text-ink-muted-dark ml-1.5 text-[11.5px]">
                      {m.correct}/{m.attempted}
                    </span>
                  </span>
                </div>
                <div className="h-1.5 rounded-full bg-paper dark:bg-paper-dark overflow-hidden border border-line dark:border-line-dark">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{ width: `${m.pct}%`, background: m.colorHex }}
                  />
                </div>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
