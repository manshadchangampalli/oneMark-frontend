import { cn } from '@/utils';

interface ChipProps {
  active?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
}

export function Chip({ active, onClick, children }: ChipProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'shrink-0 h-8 px-3 rounded-full text-[13px] font-medium transition-colors border',
        active
          ? 'bg-ink text-paper border-ink dark:bg-ink-dark dark:text-paper-dark dark:border-ink-dark'
          : 'bg-transparent text-ink-muted border-line hover:text-ink dark:text-ink-muted-dark dark:border-line-dark dark:hover:text-ink-dark'
      )}
    >
      {children}
    </button>
  );
}
