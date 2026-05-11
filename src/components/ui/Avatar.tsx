import { cn } from '@/utils';

type AvatarTone = 'neutral' | 'accent' | 'good' | 'warn';

interface AvatarProps {
  initial: string;
  tone?: AvatarTone;
  size?: number;
  ring?: boolean;
}

const tones: Record<AvatarTone, string> = {
  neutral: 'bg-[#EAE5DA] text-ink dark:bg-[#2A2720] dark:text-ink-dark',
  accent: 'bg-accent-soft text-accent dark:bg-[#3A2218] dark:text-[#F4B89B]',
  good: 'bg-good-soft text-good dark:bg-[#1D3526] dark:text-[#9DC9A7]',
  warn: 'bg-warn-soft text-warn dark:bg-[#3A2E14] dark:text-[#E5C672]',
};

export function Avatar({ initial, tone = 'neutral', size = 36, ring = false }: AvatarProps) {
  return (
    <div
      className={cn(
        'inline-flex items-center justify-center rounded-full font-semibold tracking-tight',
        tones[tone],
        ring && 'ring-2 ring-accent ring-offset-2 ring-offset-paper dark:ring-offset-paper-dark'
      )}
      style={{ width: size, height: size, fontSize: Math.round(size * 0.42) }}
    >
      {initial}
    </div>
  );
}
