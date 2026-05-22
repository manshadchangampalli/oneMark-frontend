import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { cn } from '@/utils/cn';
import type { RecentSession } from '@/api/practice.api';
import { ROUTES } from '@/constants/routes';
import { useSessionsFirstPage, loadMoreSessions } from './hooks/practice.hooks';

const MODE_LABEL: Record<string, string> = {
  quick: 'Quick Practice',
  drill: 'Topic Drill',
  mock:  'Mock Test',
};

function formatDuration(sec: number): string {
  if (!sec || sec <= 0) return '—';
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = sec % 60;
  const pad = (n: number) => n.toString().padStart(2, '0');
  return h > 0 ? `${pad(h)}:${pad(m)}:${pad(s)}` : `${pad(m)}:${pad(s)}`;
}

function formatRelative(iso: string): string {
  const then = new Date(iso).getTime();
  const diffMs = Date.now() - then;
  const day = 24 * 60 * 60 * 1000;
  if (diffMs < 60 * 1000) return 'Just now';
  if (diffMs < 60 * 60 * 1000) return `${Math.floor(diffMs / 60000)}m ago`;
  if (diffMs < day) return `${Math.floor(diffMs / 3600000)}h ago`;
  if (diffMs < 2 * day) return 'Yesterday';
  if (diffMs < 7 * day) return `${Math.floor(diffMs / day)}d ago`;
  return new Date(iso).toLocaleDateString();
}

function subjectLabel(a: RecentSession): string {
  if (a.topic && a.subject) return `${a.subject.label} · ${a.topic.label}`;
  if (a.subject) return a.subject.label;
  if (a.topic) return a.topic.label;
  return 'Mixed';
}

const PAGE_SIZE = 20;

export default function History() {
  const navigate = useNavigate();
  const [pages, setPages] = useState<RecentSession[][]>([]);
  const [cursor, setCursor] = useState<string | undefined>(undefined);
  const [loadingMore, setLoadingMore] = useState(false);

  const { data: firstPage, isLoading } = useSessionsFirstPage(PAGE_SIZE);

  const allAttempts: RecentSession[] = [
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
      const next = await loadMoreSessions(PAGE_SIZE, c);
      setPages(prev => [...prev, next.data]);
      setCursor(next.nextCursor ?? undefined);
    } finally {
      setLoadingMore(false);
    }
  }

  return (
    <div className="view-in pb-6">
      <div className="px-5 pt-4 pb-3 flex items-center gap-3">
        <button
          onClick={() => navigate(ROUTES.PRACTICE)}
          className="shrink-0 -ml-2 p-2 rounded-lg hover:bg-paper dark:hover:bg-paper-dark text-ink-muted dark:text-ink-muted-dark"
          aria-label="Back"
        >
          <ChevronLeft size={18} />
        </button>
        <div>
          <div className="text-[11px] uppercase tracking-[0.14em] text-ink-muted dark:text-ink-muted-dark font-mono">History</div>
          <h1 className="mt-1 text-[22px] font-semibold tracking-tight text-ink dark:text-ink-dark">
            All attempts
          </h1>
        </div>
      </div>

      <div className="px-5 mt-2">
        {isLoading ? (
          <Card padded={false}>
            <div className="px-4 py-10 text-center text-[13px] text-ink-muted dark:text-ink-muted-dark">Loading…</div>
          </Card>
        ) : allAttempts.length === 0 ? (
          <Card padded={false}>
            <div className="px-4 py-10 text-center text-[13px] text-ink-muted dark:text-ink-muted-dark">
              No attempts yet. Start a practice session to build your history.
            </div>
          </Card>
        ) : (
          <>
            <Card padded={false}>
              <ul className="divide-y divide-line dark:divide-line-dark">
                {allAttempts.map((a) => {
                  const kind = MODE_LABEL[a.mode] ?? a.mode;
                  const denom = a.questionCount || a.total;
                  const acc = a.accuracy ?? 0;
                  const finished = !!a.finishedAt;
                  return (
                    <li key={a.id} className="px-4 py-3 flex items-center gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-[13.5px] font-medium text-ink dark:text-ink-dark">{kind}</span>
                          <span className="text-[12px] text-ink-muted dark:text-ink-muted-dark truncate">· {subjectLabel(a)}</span>
                        </div>
                        <div className="mt-1 flex items-center gap-3 text-[12px] text-ink-muted dark:text-ink-muted-dark font-mono tab-num">
                          <span>{a.score}/{denom}</span>
                          {finished && (
                            <span className={cn(acc >= 75 ? 'text-good' : acc >= 60 ? 'text-warn' : 'text-bad')}>{Math.round(acc)}%</span>
                          )}
                          <span>{formatDuration(a.timeSpentSec)}</span>
                          <span className="ml-auto font-sans">{formatRelative(a.startedAt)}</span>
                        </div>
                      </div>
                      <button
                        onClick={() => navigate(`/practice/sessions/${a.id}?q=1`)}
                        className="shrink-0 text-[12.5px] font-medium text-ink dark:text-ink-dark hover:text-accent"
                      >
                        {finished ? 'Review' : 'Resume'}
                      </button>
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
