import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Bookmark, BookmarkCheck, Check, MessageSquare, ArrowRight, Users } from 'lucide-react';
import { Card, Button, Pill, Avatar } from '@/components/ui';
import { ROUTES } from '@/constants';
import { cn } from '@/utils';
import { useDailyChallenge, useSubmitDailyChallenge } from '@/screens/home/hooks/home.hooks';
import { dailyChallengeApi } from '@/api/daily-challenge.api';
import type { SubmitAttemptResult } from '@/api/daily-challenge.api';
import { authApi } from '@/api/auth.api';
import { useAuthStore } from '@/store/useAuthStore';
import { ExplanationPanel } from './components';

export default function Question() {
  const navigate = useNavigate();
  const { data: dc, isLoading } = useDailyChallenge();
  const submitMutation = useSubmitDailyChallenge();
  const setAuth = useAuthStore(s => s.setAuth);
  const accessToken = useAuthStore(s => s.accessToken);
  const [selected, setSelected] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [submitResult, setSubmitResult] = useState<SubmitAttemptResult | null>(null);
  const [bookmarked, setBookmarked] = useState(false);
  const [seconds, setSeconds] = useState(0);

  // Record start time in DB (idempotent — won't overwrite original startedAt)
  // and seed the timer from the persisted startedAt so it survives refreshes
  useEffect(() => {
    if (!dc || dc.myAttempt) return; // don't record start if already attempted
    dailyChallengeApi.recordStart().then(({ startedAt }) => {
      const elapsed = Math.floor((Date.now() - new Date(startedAt).getTime()) / 1000);
      setSeconds(Math.max(0, elapsed));
    });
  }, [dc?.id]);

  // Seed timer from startedAt returned on initial GET (covers page refresh)
  useEffect(() => {
    if (!dc?.startedAt || dc.myAttempt) return;
    const elapsed = Math.floor((Date.now() - new Date(dc.startedAt).getTime()) / 1000);
    setSeconds(Math.max(0, elapsed));
  }, [dc?.startedAt]);

  // If the user already attempted today, pre-populate state from the API
  useEffect(() => {
    if (!dc?.myAttempt) return;
    const prevOption = dc.question.options.find(
      (o) => o.id === dc.myAttempt!.selectedOptionId,
    );
    if (prevOption) setSelected(prevOption.label);
    setSubmitted(true);
  }, [dc]);

  useEffect(() => {
    if (submitted) return;
    const id = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, [submitted]);

  const mm = String(Math.floor(seconds / 60)).padStart(2, '0');
  const ss = String(seconds % 60).padStart(2, '0');

  // correctLabel comes from the submit response (fresh attempt) or the refetched dc (already attempted)
  const correctLabel = submitResult?.correctOptionLabel ?? dc?.question.revision.correctOptionLabel;
  const got = submitted && !!correctLabel && selected === correctLabel;
  const explanationSteps = (
    submitResult?.officialExplanation?.steps ??
    dc?.question.revision.officialExplanation?.steps ??
    []
  ) as string[];

  function handleSubmit() {
    if (!selected || !dc) return;
    const optionId = dc.question.options.find((o) => o.label === selected)?.id;
    if (!optionId) return;
    submitMutation.mutate(
      { selectedOptionId: optionId, timeSeconds: seconds },
      {
        onSuccess: (result) => {
          setSubmitResult(result);
          setSubmitted(true);
          // Refresh user counters (totalAttempts, totalCorrect, totalXp) in the store
          authApi.getMe(accessToken ?? undefined).then((freshUser) => {
            setAuth(freshUser, accessToken!);
          }).catch(() => {/* non-critical */});
        },
      },
    );
  }

  if (isLoading || !dc) {
    return (
      <div className="view-in px-5 pt-10 space-y-4 animate-pulse">
        <div className="h-4 w-32 rounded bg-line dark:bg-line-dark" />
        <div className="space-y-2">
          <div className="h-5 w-full rounded bg-line dark:bg-line-dark" />
          <div className="h-5 w-4/5 rounded bg-line dark:bg-line-dark" />
        </div>
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-16 rounded-xl2 bg-line dark:bg-line-dark" />
        ))}
      </div>
    );
  }

  const q = dc.question;
  const options = q.options;
  const alreadyAttempted = !!dc.myAttempt;

  return (
    <div className="view-in">
      {/* ── Desktop top bar ── */}
      <div className="hidden lg:flex px-4 pt-3 pb-3 lg:px-0 lg:pt-0 lg:pb-4 items-center gap-3 lg:border-b lg:border-line lg:dark:border-line-dark lg:mb-0">
        <button
          onClick={() => navigate(ROUTES.HOME)}
          className="w-9 h-9 -ml-1 rounded-lg flex items-center justify-center hover:bg-ink/4 dark:hover:bg-ink-dark/5 text-ink dark:text-ink-dark"
        >
          <X size={18} />
        </button>
        <div className="flex-1">
          <div className="text-[11px] uppercase tracking-[0.14em] text-ink-muted dark:text-ink-muted-dark font-mono">Daily challenge</div>
          <div className="text-[13px] font-medium text-ink dark:text-ink-dark">
            Question <span className="font-mono tab-num">1</span>{' '}
            <span className="text-ink-muted dark:text-ink-muted-dark">/ 1</span>
          </div>
        </div>
        <div className="hidden lg:flex items-center gap-3 text-[12px] text-ink-muted dark:text-ink-muted-dark">
          <span className="inline-flex items-center gap-1">
            <Users size={13} />
            <span className="font-mono tab-num">{dc.totalSolvers.toLocaleString()}</span> solved today
          </span>
        </div>
        {!alreadyAttempted && (
          <div className="font-mono text-[14px] tab-num text-ink dark:text-ink-dark px-2 py-1 rounded-md bg-paper dark:bg-paper-dark border border-line dark:border-line-dark">
            {mm}:{ss}
          </div>
        )}
        <button
          onClick={() => setBookmarked((b) => !b)}
          className="w-9 h-9 rounded-lg flex items-center justify-center hover:bg-ink/4 dark:hover:bg-ink-dark/5 text-ink dark:text-ink-dark"
        >
          {bookmarked ? <BookmarkCheck size={18} /> : <Bookmark size={18} />}
        </button>
      </div>

      <div className="lg:grid lg:grid-cols-[1fr_420px] lg:gap-8 lg:items-start lg:mt-6">

        {/* ── Left: question + options ── */}
        <div>
          {/* Mobile sticky top bar */}
          <div className="lg:hidden px-4 pt-3 pb-3 flex items-center gap-3 border-b border-line dark:border-line-dark sticky top-0 bg-paper/90 dark:bg-paper-dark/90 backdrop-blur-sm z-10">
            <button
              onClick={() => navigate(ROUTES.HOME)}
              className="w-9 h-9 -ml-1 rounded-lg flex items-center justify-center hover:bg-ink/4 text-ink dark:text-ink-dark"
            >
              <X size={18} />
            </button>
            <div className="flex-1">
              <div className="text-[11px] uppercase tracking-[0.14em] text-ink-muted dark:text-ink-muted-dark font-mono">Daily challenge</div>
              <div className="text-[13px] font-medium text-ink dark:text-ink-dark">
                Question <span className="font-mono tab-num">1</span>{' '}
                <span className="text-ink-muted dark:text-ink-muted-dark">/ 1</span>
              </div>
            </div>
            <div className="font-mono text-[14px] tab-num text-ink dark:text-ink-dark px-2 py-1 rounded-md bg-paper dark:bg-paper-dark border border-line dark:border-line-dark">
              {mm}:{ss}
            </div>
            <button
              onClick={() => setBookmarked((b) => !b)}
              className="w-9 h-9 rounded-lg flex items-center justify-center hover:bg-ink/4 text-ink dark:text-ink-dark"
            >
              {bookmarked ? <BookmarkCheck size={18} /> : <Bookmark size={18} />}
            </button>
          </div>

          <div className="px-5 pt-5 pb-6 lg:px-0 lg:pt-0">
            {/* Tags */}
            <div className="flex items-center gap-2 mb-4 flex-wrap">
              {q.subject && <Pill tone="accent">{q.subject}</Pill>}
              {q.topic && <Pill tone="neutral">{q.topic}</Pill>}
              <Pill tone="warn">{q.difficulty}</Pill>
            </div>

            {/* Prompt */}
            <p className="font-serif text-[19px] lg:text-[20px] leading-[1.55] text-ink dark:text-ink-dark">
              {q.revision.prompt}
            </p>

            {/* Options */}
            <div className="mt-6 space-y-3">
              {options.map((opt) => {
                const isSel = selected === opt.label;
                const isCorrect = submitted && opt.label === correctLabel;
                const isWrongPicked = submitted && isSel && opt.label !== correctLabel;
                return (
                  <button
                    key={opt.id}
                    onClick={() => !submitted && setSelected(opt.label)}
                    disabled={submitted}
                    className={cn(
                      'w-full text-left rounded-xl2 border bg-surface dark:bg-surface-dark p-4 flex items-center gap-4 transition-all',
                      !submitted && (isSel
                        ? 'border-accent bg-accent-soft/60 dark:bg-[#2A1B14]/70 dark:border-accent'
                        : 'border-line dark:border-line-dark hover:border-ink/25 dark:hover:border-ink-dark/30'),
                      isCorrect && 'border-good border-l-4 dark:bg-[#1A2A1F]',
                      isWrongPicked && 'border-bad border-l-4 dark:bg-[#2A1815]',
                      submitted && !isCorrect && !isWrongPicked && 'border-line dark:border-line-dark opacity-70',
                    )}
                  >
                    <div className={cn(
                      'shrink-0 w-9 h-9 rounded-lg border flex items-center justify-center font-mono text-[14px] font-medium',
                      !submitted && (isSel
                        ? 'bg-accent text-white border-accent'
                        : 'bg-paper dark:bg-paper-dark border-line dark:border-line-dark text-ink dark:text-ink-dark'),
                      isCorrect && 'bg-good text-white border-good',
                      isWrongPicked && 'bg-bad text-white border-bad',
                      submitted && !isCorrect && !isWrongPicked && 'bg-paper dark:bg-paper-dark border-line dark:border-line-dark text-ink dark:text-ink-dark',
                    )}>
                      {opt.label}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-serif text-[16px] text-ink dark:text-ink-dark">{opt.text}</div>
                      {opt.sub && (
                        <div className="font-mono text-[11.5px] text-ink-muted dark:text-ink-muted-dark mt-0.5 tab-num">{opt.sub}</div>
                      )}
                    </div>
                    {isCorrect && <Check size={18} strokeWidth={2.5} className="text-good" />}
                    {isWrongPicked && <X size={18} strokeWidth={2.5} className="text-bad" />}
                  </button>
                );
              })}
            </div>

            {/* Submit — desktop */}
            <div className="mt-5 hidden lg:block">
              {!submitted ? (
                <>
                  <Button variant="primary" size="lg" className="w-full" onClick={handleSubmit}
                    disabled={!selected || submitMutation.isPending}>
                    {submitMutation.isPending ? 'Submitting…' : selected ? `Submit answer ${selected}` : 'Select an option to submit'}
                  </Button>
                  {submitMutation.isError && (
                    <p className="mt-2 text-[12.5px] text-bad text-center">
                      Failed to submit. Check your connection and try again.
                    </p>
                  )}
                </>
              ) : (
                <div className="flex gap-2">
                  <Button variant="secondary" size="lg" className="flex-1" icon={MessageSquare} onClick={() => {}}>
                    Discuss
                  </Button>
                  <Button variant="primary" size="lg" className="flex-[1.4]" iconRight={ArrowRight} onClick={() => navigate(ROUTES.HOME)}>
                    Done
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Submit — mobile sticky */}
          <div className="lg:hidden sticky bottom-0 bg-paper/95 dark:bg-paper-dark/95 backdrop-blur-sm border-t border-line dark:border-line-dark px-5 py-3">
            {!submitted ? (
              <>
                <Button variant="primary" size="lg" className="w-full" onClick={handleSubmit}
                  disabled={!selected || submitMutation.isPending}>
                  {submitMutation.isPending ? 'Submitting…' : selected ? `Submit answer ${selected}` : 'Select an option to submit'}
                </Button>
                {submitMutation.isError && (
                  <p className="mt-2 text-[12.5px] text-bad text-center">
                    Failed to submit. Check your connection and try again.
                  </p>
                )}
              </>
            ) : (
              <div className="flex gap-2">
                <Button variant="secondary" size="lg" className="flex-1" icon={MessageSquare} onClick={() => {}}>
                  Discuss
                </Button>
                <Button variant="primary" size="lg" className="flex-[1.4]" iconRight={ArrowRight} onClick={() => navigate(ROUTES.HOME)}>
                  Done
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* ── Right panel ── */}
        <div className="lg:sticky lg:top-20">
          {/* Result banner */}
          {submitted && (
            <div className={cn(
              'flex items-center gap-3 p-4 rounded-xl2 border-l-4 mb-4 reveal-in',
              got ? 'border-good bg-good-soft/60 dark:bg-[#1A2A1F]' : 'border-bad bg-bad/8 dark:bg-[#2A1815]',
            )}>
              <div className={cn('w-8 h-8 rounded-full flex items-center justify-center shrink-0', got ? 'bg-good text-white' : 'bg-bad text-white')}>
                {got ? <Check size={16} strokeWidth={2.5} /> : <X size={16} strokeWidth={2.5} />}
              </div>
              <div className="flex-1">
                <div className="text-[14px] font-medium text-ink dark:text-ink-dark">{got ? 'Correct.' : 'Not quite.'}</div>
                <div className="text-[12.5px] text-ink-muted dark:text-ink-muted-dark">
                  {got
                    ? <>Solved in <span className="font-mono tab-num">{mm}:{ss}</span>.</>
                    : <>Answer was <span className="font-mono">{correctLabel}</span>. See explanation below.</>}
                </div>
              </div>
              {got && (
                <span className="font-mono text-[12px] text-good tab-num">
                  +{submitResult?.attempt.xpAwarded ?? dc.myAttempt?.xpAwarded ?? q.xpReward} XP
                </span>
              )}
            </div>
          )}

          <div className="hidden lg:block">
            <ExplanationPanel submitted={submitted} steps={explanationSteps} />
          </div>

          {submitted && (
            <div className="lg:hidden px-5 mt-3 pb-32 reveal-in">
              <ExplanationPanel submitted={submitted} steps={explanationSteps} />
            </div>
          )}

          {/* Pre-submit info — desktop only */}
          {!submitted && (
            <div className="hidden lg:flex flex-col gap-4">
              <Card>
                <div className="text-[11px] uppercase tracking-[0.14em] text-ink-muted dark:text-ink-muted-dark font-mono mb-2">About this question</div>
                <div className="space-y-2 text-[13px]">
                  {[
                    { label: 'Subject',   value: q.subject ?? '—' },
                    { label: 'Topic',     value: q.topic ?? '—' },
                    { label: 'Solved by', value: `${dc.totalSolvers.toLocaleString()} today` },
                    { label: 'XP reward', value: `+${q.xpReward + dc.dailyBonus} XP` },
                  ].map((r) => (
                    <div key={r.label} className="flex items-center justify-between">
                      <span className="text-ink-muted dark:text-ink-muted-dark">{r.label}</span>
                      <span className="font-medium text-ink dark:text-ink-dark">{r.value}</span>
                    </div>
                  ))}
                </div>
              </Card>
              <Card>
                <div className="text-[11px] uppercase tracking-[0.14em] text-ink-muted dark:text-ink-muted-dark font-mono mb-2">Top solvers today</div>
                <ul className="space-y-2.5">
                  {[
                    { name: 'Aarav Mehta', time: '0:48', avatar: 'A' },
                    { name: 'Mei Tanaka',  time: '1:02', avatar: 'M' },
                    { name: 'You',         time: '—',    avatar: 'Y', you: true },
                  ].map((u) => (
                    <li key={u.name} className="flex items-center gap-2.5">
                      <Avatar initial={u.avatar} size={28} tone={u.you ? 'accent' : 'neutral'} />
                      <span className={cn('text-[13px] flex-1', u.you ? 'font-medium text-ink dark:text-ink-dark' : 'text-ink-muted dark:text-ink-muted-dark')}>
                        {u.name}
                      </span>
                      <span className="font-mono text-[12px] text-ink-muted dark:text-ink-muted-dark tab-num">{u.time}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

