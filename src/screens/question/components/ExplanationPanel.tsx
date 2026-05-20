import { useState } from 'react';
import { Card } from '@/components/ui';
import { cn } from '@/utils';

type Tab = 'official' | 'community';

interface Props {
  submitted: boolean;
  steps: string[];
}

export function ExplanationPanel({ submitted, steps }: Props) {
  const [tab, setTab] = useState<Tab>('official');

  if (!submitted) {
    return (
      <Card>
        <div className="text-[13px] text-ink-muted dark:text-ink-muted-dark text-center py-6 font-serif italic">
          Submit your answer to see the explanation.
        </div>
      </Card>
    );
  }

  return (
    <div>
      <div className="flex gap-1 border-b border-line dark:border-line-dark mb-4">
        {(['official', 'community'] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={cn(
              'px-3 h-10 text-[13.5px] font-medium relative -mb-px capitalize',
              tab === t
                ? 'text-ink dark:text-ink-dark border-b-2 border-ink dark:border-ink-dark'
                : 'text-ink-muted dark:text-ink-muted-dark hover:text-ink dark:hover:text-ink-dark',
            )}
          >
            {t}
          </button>
        ))}
      </div>
      <div className="space-y-3">
        {tab === 'official' && (
          <Card>
            <div className="text-[11px] uppercase tracking-[0.14em] text-ink-muted dark:text-ink-muted-dark font-mono mb-2">Worked solution</div>
            {steps.length > 0 ? (
              <ol className="space-y-2.5">
                {steps.map((line, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="font-mono text-[12px] text-ink-muted dark:text-ink-muted-dark tab-num shrink-0 mt-0.5">{i + 1}.</span>
                    <span className="font-serif text-[15px] leading-relaxed text-ink dark:text-ink-dark">{line}</span>
                  </li>
                ))}
              </ol>
            ) : (
              <p className="text-[13.5px] text-ink-muted dark:text-ink-muted-dark font-serif italic">
                No official explanation available yet.
              </p>
            )}
          </Card>
        )}
        {tab === 'community' && (
          <div className="text-[13.5px] text-ink-muted dark:text-ink-muted-dark text-center py-8 font-serif italic">
            Community explanations coming soon.
          </div>
        )}
      </div>
    </div>
  );
}
