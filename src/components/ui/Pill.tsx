import { cn } from '@/utils/cn';

type PillTone = 'neutral' | 'accent' | 'good' | 'warn' | 'bad';

interface PillProps {
  tone?: PillTone;
  children: React.ReactNode;
  mono?: boolean;
}

const tones: Record<PillTone, string> = {
  neutral: 'bg-paper dark:bg-paper-dark text-ink-muted dark:text-ink-muted-dark border-line dark:border-line-dark',
  accent: 'bg-accent-soft text-accent border-transparent dark:bg-[#3A2218] dark:text-[#F4B89B]',
  good: 'bg-good-soft text-good border-transparent dark:bg-[#1D3526] dark:text-[#9DC9A7]',
  warn: 'bg-warn-soft text-warn border-transparent dark:bg-[#3A2E14] dark:text-[#E5C672]',
  bad: 'bg-bad/10 text-bad border-transparent',
};

export function Pill({ tone = 'neutral', children, mono = false }: PillProps) {
  return (
    <span className={cn('inline-flex items-center gap-1 px-2 h-6 rounded-full text-[11px] font-medium border', mono && 'font-mono tracking-tight', tones[tone])}>
      {children}
    </span>
  );
}
