import { cn } from '@/utils';

interface ToggleProps {
  on: boolean;
  onChange: (value: boolean) => void;
}

export function Toggle({ on, onChange }: ToggleProps) {
  return (
    <button
      onClick={() => onChange(!on)}
      className={cn('w-10 h-6 rounded-full transition-colors relative', on ? 'bg-accent' : 'bg-line dark:bg-line-dark')}
    >
      <span
        className={cn(
          'absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform',
          on ? 'translate-x-[18px]' : 'translate-x-0.5'
        )}
      />
    </button>
  );
}
