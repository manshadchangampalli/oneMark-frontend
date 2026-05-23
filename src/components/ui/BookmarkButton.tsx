import { useState } from 'react';
import { Bookmark, BookmarkCheck } from 'lucide-react';
import { useBookmarkStore } from '@/store/useBookmarkStore';
import { cn } from '@/utils/cn';

interface BookmarkButtonProps {
  questionId: string;
  size?: number;
  className?: string;
}

export function BookmarkButton({ questionId, size = 18, className }: BookmarkButtonProps) {
  const isBookmarked = useBookmarkStore((s) => s.ids.has(questionId));
  const toggle = useBookmarkStore((s) => s.toggle);
  const [pending, setPending] = useState(false);

  async function onClick(e: React.MouseEvent) {
    e.stopPropagation();
    if (pending) return;
    setPending(true);
    try {
      await toggle(questionId);
    } finally {
      setPending(false);
    }
  }

  const Icon = isBookmarked ? BookmarkCheck : Bookmark;

  return (
    <button
      onClick={onClick}
      disabled={pending}
      aria-label={isBookmarked ? 'Remove bookmark' : 'Bookmark this question'}
      title={isBookmarked ? 'Remove bookmark' : 'Bookmark this question'}
      className={cn(
        'shrink-0 inline-flex items-center justify-center w-9 h-9 rounded-lg border transition-colors',
        isBookmarked
          ? 'border-accent text-accent bg-accent-soft/40 dark:bg-[#2A1B14]/40'
          : 'border-line dark:border-line-dark text-ink-muted dark:text-ink-muted-dark hover:text-ink dark:hover:text-ink-dark hover:border-ink/30 dark:hover:border-ink-dark/30',
        pending && 'opacity-50',
        className,
      )}
    >
      <Icon size={size} strokeWidth={isBookmarked ? 2 : 1.75} />
    </button>
  );
}
