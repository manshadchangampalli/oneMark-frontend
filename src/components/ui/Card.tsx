import { cn } from '@/utils';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  padded?: boolean;
  onClick?: () => void;
}

export function Card({ children, className, padded = true, onClick }: CardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        'bg-surface dark:bg-surface-dark border border-line dark:border-line-dark rounded-xl2',
        padded && 'p-4',
        onClick && 'cursor-pointer transition-colors hover:border-ink/20 dark:hover:border-ink-dark/30',
        className
      )}
    >
      {children}
    </div>
  );
}
