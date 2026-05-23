import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Trash2 } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Pill } from '@/components/ui/Pill';
import { cn } from '@/utils/cn';
import type { BookmarkRow } from '@/api/bookmarks.api';
import { useBookmarkStore } from '@/store/useBookmarkStore';
import { useBookmarksFirstPage, loadMoreBookmarks } from './hooks/bookmarks.hooks';

const PAGE_SIZE = 20;

const DIFFICULTY_TONE = {
  easy:   'good',
  medium: 'warn',
  hard:   'bad',
} as const;

function formatRelative(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const day = 24 * 60 * 60 * 1000;
  if (diffMs < 60 * 60 * 1000) return `${Math.floor(diffMs / 60000)}m ago`;
  if (diffMs < day)            return `${Math.floor(diffMs / 3600000)}h ago`;
  if (diffMs < 2 * day)        return 'Yesterday';
  if (diffMs < 7 * day)        return `${Math.floor(diffMs / day)}d ago`;
  return new Date(iso).toLocaleDateString();
}

export default function Bookmarks() {
  const navigate = useNavigate();
  const toggle = useBookmarkStore((s) => s.toggle);
  const [pages, setPages]           = useState<BookmarkRow[][]>([]);
  const [cursor, setCursor]         = useState<string | undefined>(undefined);
  const [loadingMore, setLoadingMore] = useState(false);
  const [removingId, setRemovingId] = useState<string | null>(null);

  const { data: firstPage, isLoading, refetch } = useBookmarksFirstPage(PAGE_SIZE);

  const allRows: BookmarkRow[] = [
    ...(firstPage?.data ?? []),
    ...pages.flat(),
  ];

  const nextCursor = pages.length > 0
    ? (pages[pages.length - 1].length === PAGE_SIZE ? cursor : null)
    : firstPage?.nextCursor ?? null;

  async function loadMore() {
    const c = pages.length === 0 ? firstPage?.nextCursor : cursor;
    if (!c) return;
    setLoadingMore(true);
    try {
      const next = await loadMoreBookmarks(PAGE_SIZE, c);
      setPages(prev => [...prev, next.data]);
      setCursor(next.nextCursor ?? undefined);
    } finally {
      setLoadingMore(false);
    }
  }

  async function handleRemove(questionId: string) {
    setRemovingId(questionId);
    try {
      await toggle(questionId);
      // The list comes from server pagination so we refetch to drop the row cleanly
      await refetch();
      setPages([]); // reset extra pages — refetched first page covers it
      setCursor(undefined);
    } finally {
      setRemovingId(null);
    }
  }

  return (
    <div className="view-in pb-6">
      <div className="px-5 pt-4 pb-3 flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="shrink-0 -ml-2 p-2 rounded-lg hover:bg-paper dark:hover:bg-paper-dark text-ink-muted dark:text-ink-muted-dark"
          aria-label="Back"
        >
          <ChevronLeft size={18} />
        </button>
        <div>
          <div className="text-[11px] uppercase tracking-[0.14em] text-ink-muted dark:text-ink-muted-dark font-mono">Saved</div>
          <h1 className="mt-1 text-[22px] font-semibold tracking-tight text-ink dark:text-ink-dark">
            Bookmarks
          </h1>
        </div>
      </div>

      <div className="px-5 mt-2">
        {isLoading ? (
          <Card padded={false}>
            <div className="px-4 py-10 text-center text-[13px] text-ink-muted dark:text-ink-muted-dark">Loading…</div>
          </Card>
        ) : allRows.length === 0 ? (
          <Card padded={false}>
            <div className="px-4 py-10 text-center text-[13px] text-ink-muted dark:text-ink-muted-dark">
              No bookmarks yet. Tap the bookmark icon on any question to save it for later.
            </div>
          </Card>
        ) : (
          <>
            <Card padded={false}>
              <ul className="divide-y divide-line dark:divide-line-dark">
                {allRows.map((b) => {
                  const tone = DIFFICULTY_TONE[b.difficulty] ?? 'neutral';
                  return (
                    <li key={b.questionId} className={cn('px-4 py-3.5', removingId === b.questionId && 'opacity-50')}>
                      <div className="flex items-start gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap mb-1.5">
                            <span className="flex items-center gap-1.5 text-[11.5px] text-ink-muted dark:text-ink-muted-dark">
                              <span className="h-2 w-2 rounded-full" style={{ background: b.subject.colorHex }} />
                              {b.subject.label}
                            </span>
                            <span className="text-[11.5px] text-ink-muted dark:text-ink-muted-dark">·</span>
                            <span className="text-[11.5px] text-ink-muted dark:text-ink-muted-dark">{b.topic.label}</span>
                            <Pill tone={tone}>{b.difficulty}</Pill>
                            <span className="ml-auto font-mono text-[11px] text-ink-muted dark:text-ink-muted-dark tab-num">
                              {formatRelative(b.createdAt)}
                            </span>
                          </div>
                          <p className="text-[14px] text-ink dark:text-ink-dark line-clamp-3">
                            {b.prompt}
                          </p>
                        </div>
                        <button
                          onClick={() => handleRemove(b.questionId)}
                          disabled={removingId === b.questionId}
                          className="shrink-0 p-2 rounded-md text-ink-muted dark:text-ink-muted-dark hover:text-bad hover:bg-bad/5"
                          aria-label="Remove bookmark"
                          title="Remove bookmark"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </Card>

            {nextCursor && (
              <div className="mt-4 flex justify-center">
                <button
                  onClick={loadMore}
                  disabled={loadingMore}
                  className="px-4 py-2 rounded-lg border border-line dark:border-line-dark text-[13px] font-medium text-ink dark:text-ink-dark hover:bg-paper dark:hover:bg-paper-dark disabled:opacity-50"
                >
                  {loadingMore ? 'Loading…' : 'Load more'}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
