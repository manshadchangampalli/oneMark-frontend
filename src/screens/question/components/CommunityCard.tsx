import { useState } from 'react';
import { ChevronUp, ThumbsUp } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Avatar } from '@/components/ui/Avatar';
import { Pill } from '@/components/ui/Pill';
import { cn } from '@/utils/cn';

interface CommunityEntry {
  id: string;
  author: string;
  grade: string;
  avatar: string;
  tone: 'steps' | 'analogy' | 'short';
  upvotes: number;
  helpful: number;
  text: string;
}

interface CommunityCardProps {
  c: CommunityEntry;
  pinned?: boolean;
}

export function CommunityCard({ c, pinned }: CommunityCardProps) {
  const [helpful, setHelpful] = useState<'y' | 'n' | null>(null);
  const avatarTone = c.tone === 'steps' ? 'accent' : c.tone === 'analogy' ? 'good' : 'neutral';

  return (
    <Card padded={false}>
      <div className="p-4">
        <div className="flex items-start gap-3">
          <Avatar initial={c.avatar} tone={avatarTone} size={36} />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[14px] font-medium text-ink dark:text-ink-dark">{c.author}</span>
              {pinned && <Pill tone="accent">Top voted</Pill>}
            </div>
            <div className="text-[12px] text-ink-muted dark:text-ink-muted-dark">{c.grade}</div>
          </div>
          <div className="flex flex-col items-center text-ink-muted dark:text-ink-muted-dark">
            <button className="hover:text-ink dark:hover:text-ink-dark">
              <ChevronUp size={16} strokeWidth={2.25} />
            </button>
            <span className="font-mono text-[12px] text-ink dark:text-ink-dark tab-num">{c.upvotes}</span>
          </div>
        </div>

        <div className="mt-3 font-serif text-[15px] leading-[1.55] text-ink dark:text-ink-dark whitespace-pre-line">
          {c.text}
        </div>

        <div className="mt-4 pt-3 border-t border-line dark:border-line-dark flex items-center gap-3">
          <span className="text-[12px] text-ink-muted dark:text-ink-muted-dark">Was this helpful?</span>
          <button
            onClick={() => setHelpful('y')}
            className={cn(
              'inline-flex items-center gap-1 h-7 px-2.5 rounded-md text-[12px] border',
              helpful === 'y'
                ? 'bg-good-soft text-good border-good/30'
                : 'border-line dark:border-line-dark text-ink-muted dark:text-ink-muted-dark hover:text-ink dark:hover:text-ink-dark'
            )}
          >
            <ThumbsUp size={12} /> Yes
          </button>
          <button
            onClick={() => setHelpful('n')}
            className={cn(
              'inline-flex items-center gap-1 h-7 px-2.5 rounded-md text-[12px] border',
              helpful === 'n'
                ? 'bg-bad/10 text-bad border-bad/30'
                : 'border-line dark:border-line-dark text-ink-muted dark:text-ink-muted-dark hover:text-ink dark:hover:text-ink-dark'
            )}
          >
            No
          </button>
          <span className="ml-auto font-mono text-[11px] text-ink-muted dark:text-ink-muted-dark tab-num">
            {c.helpful} helpful
          </span>
        </div>
      </div>
    </Card>
  );
}
