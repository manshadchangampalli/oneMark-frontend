import { ArrowRight } from 'lucide-react';

interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  action?: string;
  onAction?: () => void;
}

export function SectionHeader({ eyebrow, title, action, onAction }: SectionHeaderProps) {
  return (
    <div className="flex items-end justify-between mb-3">
      <div>
        {eyebrow && (
          <div className="text-[11px] uppercase tracking-[0.14em] text-ink-muted dark:text-ink-muted-dark font-mono">
            {eyebrow}
          </div>
        )}
        <h2 className="text-[17px] font-semibold tracking-tight text-ink dark:text-ink-dark mt-0.5">
          {title}
        </h2>
      </div>
      {action && (
        <button
          onClick={onAction}
          className="text-[13px] text-ink-muted hover:text-ink dark:text-ink-muted-dark dark:hover:text-ink-dark inline-flex items-center gap-1"
        >
          {action} <ArrowRight size={14} />
        </button>
      )}
    </div>
  );
}
