import { cn } from '@/utils';

interface SegmentedOption {
  label: string;
  value: string;
}

interface SegmentedProps {
  options: SegmentedOption[];
  value: string;
  onChange: (value: string) => void;
}

export function Segmented({ options, value, onChange }: SegmentedProps) {
  return (
    <div className="inline-flex p-0.5 bg-paper dark:bg-paper-dark border border-line dark:border-line-dark rounded-lg">
      {options.map((o) => (
        <button
          key={o.value}
          onClick={() => onChange(o.value)}
          className={cn(
            'h-8 px-3 text-[13px] font-medium rounded-md transition-colors',
            value === o.value
              ? 'bg-surface dark:bg-surface-dark text-ink dark:text-ink-dark shadow-[0_1px_0_rgba(0,0,0,0.04)]'
              : 'text-ink-muted dark:text-ink-muted-dark hover:text-ink dark:hover:text-ink-dark'
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
