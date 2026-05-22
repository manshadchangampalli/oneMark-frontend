import { Card } from '@/components/ui/Card';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { MASTERY } from '@/constants/data';

export function MasterySection() {
  return (
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
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${m.pct}%`,
                    background: m.pct >= 75 ? '#3D7A4E' : m.pct >= 55 ? '#D4541A' : '#C8941E',
                  }}
                />
              </div>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
