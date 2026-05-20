import { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { X, Check, ArrowRight, Trophy } from 'lucide-react';
import { Card, Button, Pill } from '@/components/ui';
import { ROUTES } from '@/constants';
import { cn } from '@/utils';
import { practiceApi } from '@/api/practice.api';
import type { PracticeQuestion, SubmitAttemptResult, FinishResult, SessionState } from '@/api/practice.api';
import { ExplanationPanel } from '@/screens/question/components';
import { authApi } from '@/api/auth.api';
import { useAuthStore } from '@/store/useAuthStore';

export default function PracticeSession() {
  const navigate = useNavigate();
  const { sessionId } = useParams<{ sessionId: string }>();
  const location = useLocation();
  const setAuth = useAuthStore(s => s.setAuth);
  const accessToken = useAuthStore(s => s.accessToken);

  // Questions come from router state (passed on navigate from Practice screen)
  const locationState = location.state as SessionState | null;
  const [questions, setQuestions] = useState<PracticeQuestion[]>(locationState?.questions ?? []);
  const [loading, setLoading] = useState(questions.length === 0);

  // Per-question state (reset on advance)
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [submitResult, setSubmitResult] = useState<SubmitAttemptResult | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(false);

  // Timer (per question)
  const [seconds, setSeconds] = useState(0);
  useEffect(() => {
    if (submitted) return;
    const id = setInterval(() => setSeconds(s => s + 1), 1000);
    return () => clearInterval(id);
  }, [submitted, index]);

  // Finish state
  const [finishing, setFinishing] = useState(false);
  const [finishResult, setFinishResult] = useState<FinishResult | null>(null);

  // Fallback: fetch session if navigated to directly (no router state)
  useEffect(() => {
    if (questions.length > 0 || !sessionId) return;
    practiceApi.getSession(sessionId).then(data => {
      setQuestions(data.questions);
      setLoading(false);
    }).catch(() => {
      navigate(ROUTES.PRACTICE);
    });
  }, [sessionId]);

  if (loading) {
    return (
      <div className="view-in px-5 pt-10 space-y-4 animate-pulse">
        <div className="h-4 w-32 rounded bg-line dark:bg-line-dark" />
        <div className="space-y-2">
          <div className="h-5 w-full rounded bg-line dark:bg-line-dark" />
          <div className="h-5 w-4/5 rounded bg-line dark:bg-line-dark" />
        </div>
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="h-16 rounded-xl2 bg-line dark:bg-line-dark" />
        ))}
      </div>
    );
  }

  // ── Results screen ──
  if (finishResult) {
    const mm = String(Math.floor(finishResult.timeSpentSec / 60)).padStart(2, '0');
    const ss = String(finishResult.timeSpentSec % 60).padStart(2, '0');
    return (
      <div className="view-in px-5 pt-6 pb-10 max-w-lg mx-auto">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-full bg-accent-soft text-accent dark:bg-[#3A2218] dark:text-[#F4B89B] flex items-center justify-center mx-auto mb-4">
            <Trophy size={28} />
          </div>
          <h1 className="text-[24px] font-semibold text-ink dark:text-ink-dark tracking-tight">Session complete</h1>
          <p className="mt-1 text-[14px] text-ink-muted dark:text-ink-muted-dark">
            {finishResult.score} of {finishResult.total} correct
          </p>
        </div>

        <Card padded={false} className="mb-4">
          <div className="grid grid-cols-3 divide-x divide-line dark:divide-line-dark">
            {[
              { label: 'Score',    value: `${finishResult.score}/${finishResult.total}` },
              { label: 'Accuracy', value: `${finishResult.accuracy}%` },
              { label: 'Time',     value: `${mm}:${ss}` },
            ].map(s => (
              <div key={s.label} className="p-4 text-center">
                <div className="font-mono text-[20px] font-semibold text-ink dark:text-ink-dark tab-num">{s.value}</div>
                <div className="text-[11px] uppercase tracking-[0.12em] text-ink-muted dark:text-ink-muted-dark font-mono mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>
        </Card>

        {finishResult.xpAwarded > 0 && (
          <div className="flex items-center justify-center gap-2 mb-6 py-3 rounded-xl2 bg-good-soft dark:bg-[#1D3526] text-good font-mono text-[15px] font-semibold">
            +{finishResult.xpAwarded} XP earned
          </div>
        )}

        <div className="flex gap-3">
          <Button variant="secondary" size="lg" className="flex-1" onClick={() => navigate(ROUTES.PRACTICE)}>
            Practice again
          </Button>
          <Button variant="primary" size="lg" className="flex-1" iconRight={ArrowRight} onClick={() => navigate(ROUTES.HOME)}>
            Done
          </Button>
        </div>
      </div>
    );
  }

  const q = questions[index];
  if (!q) return null;

  const total = questions.length;
  const correctLabel = submitResult?.correctOptionLabel ?? null;
  const got = submitted && !!correctLabel && selected === correctLabel;
  const mm = String(Math.floor(seconds / 60)).padStart(2, '0');
  const ss = String(seconds % 60).padStart(2, '0');
  const isLast = index === total - 1;
  const explanationSteps = (submitResult?.officialExplanation?.steps ?? []) as string[];

  async function handleSubmit() {
    if (!selected || !sessionId || submitting) return;
    const optionId = q.options.find(o => o.label === selected)?.id;
    if (!optionId) return;
    setSubmitting(true);
    setSubmitError(false);
    try {
      const result = await practiceApi.submitAttempt(sessionId, {
        questionId: q.id,
        selectedOptionId: optionId,
        timeSeconds: seconds,
      });
      setSubmitResult(result);
      setSubmitted(true);
      authApi.getMe(accessToken ?? undefined).then(u => setAuth(u, accessToken!)).catch(() => {});
    } catch {
      setSubmitError(true);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleNext() {
    if (isLast) {
      setFinishing(true);
      try {
        const result = await practiceApi.finishSession(sessionId!);
        setFinishResult(result);
      } catch {
        setFinishing(false);
      }
      return;
    }
    setIndex(i => i + 1);
    setSelected(null);
    setSubmitted(false);
    setSubmitResult(null);
    setSubmitError(false);
    setSeconds(0);
  }

  return (
    <div className="view-in">
      {/* Desktop top bar */}
      <div className="hidden lg:flex px-4 pt-3 pb-3 lg:px-0 lg:pt-0 lg:pb-4 items-center gap-3 lg:border-b lg:border-line lg:dark:border-line-dark lg:mb-0">
        <button
          onClick={() => navigate(ROUTES.PRACTICE)}
          className="w-9 h-9 -ml-1 rounded-lg flex items-center justify-center hover:bg-ink/4 dark:hover:bg-ink-dark/5 text-ink dark:text-ink-dark"
        >
          <X size={18} />
        </button>
        <div className="flex-1">
          <div className="text-[11px] uppercase tracking-[0.14em] text-ink-muted dark:text-ink-muted-dark font-mono">Practice</div>
          <div className="text-[13px] font-medium text-ink dark:text-ink-dark">
            Question <span className="font-mono tab-num">{index + 1}</span>{' '}
            <span className="text-ink-muted dark:text-ink-muted-dark">/ {total}</span>
          </div>
        </div>
        {!submitted && (
          <div className="font-mono text-[14px] tab-num text-ink dark:text-ink-dark px-2 py-1 rounded-md bg-paper dark:bg-paper-dark border border-line dark:border-line-dark">
            {mm}:{ss}
          </div>
        )}
      </div>

      <div className="lg:grid lg:grid-cols-[1fr_420px] lg:gap-8 lg:items-start lg:mt-6">

        {/* Left: question + options */}
        <div>
          {/* Mobile top bar */}
          <div className="lg:hidden px-4 pt-3 pb-3 flex items-center gap-3 border-b border-line dark:border-line-dark sticky top-0 bg-paper/90 dark:bg-paper-dark/90 backdrop-blur-sm z-10">
            <button
              onClick={() => navigate(ROUTES.PRACTICE)}
              className="w-9 h-9 -ml-1 rounded-lg flex items-center justify-center hover:bg-ink/4 text-ink dark:text-ink-dark"
            >
              <X size={18} />
            </button>
            <div className="flex-1">
              <div className="text-[11px] uppercase tracking-[0.14em] text-ink-muted dark:text-ink-muted-dark font-mono">Practice</div>
              <div className="text-[13px] font-medium text-ink dark:text-ink-dark">
                Question <span className="font-mono tab-num">{index + 1}</span>{' '}
                <span className="text-ink-muted dark:text-ink-muted-dark">/ {total}</span>
              </div>
            </div>
            <div className="font-mono text-[14px] tab-num text-ink dark:text-ink-dark px-2 py-1 rounded-md bg-paper dark:bg-paper-dark border border-line dark:border-line-dark">
              {mm}:{ss}
            </div>
          </div>

          <div className="px-5 pt-5 pb-6 lg:px-0 lg:pt-0">
            {/* Tags */}
            <div className="flex items-center gap-2 mb-4 flex-wrap">
              <Pill tone="warn">{q.difficulty}</Pill>
              <span className="ml-auto font-mono text-[11px] text-ink-muted dark:text-ink-muted-dark tab-num">+{q.xpReward} XP</span>
            </div>

            {/* Prompt */}
            <p className="font-serif text-[19px] lg:text-[20px] leading-[1.55] text-ink dark:text-ink-dark">
              {q.revision?.prompt}
            </p>

            {/* Options */}
            <div className="mt-6 space-y-3">
              {q.options.map(opt => {
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

            {/* Submit / Next — desktop */}
            <div className="mt-5 hidden lg:block">
              {!submitted ? (
                <>
                  <Button variant="primary" size="lg" className="w-full" onClick={handleSubmit}
                    disabled={!selected || submitting}>
                    {submitting ? 'Submitting…' : selected ? `Submit answer ${selected}` : 'Select an option to submit'}
                  </Button>
                  {submitError && (
                    <p className="mt-2 text-[12.5px] text-bad text-center">Failed to submit. Try again.</p>
                  )}
                </>
              ) : (
                <Button variant="primary" size="lg" className="w-full" iconRight={ArrowRight}
                  onClick={handleNext} disabled={finishing}>
                  {finishing ? 'Finishing…' : isLast ? 'Finish session' : 'Next question'}
                </Button>
              )}
            </div>
          </div>

          {/* Submit / Next — mobile sticky */}
          <div className="lg:hidden sticky bottom-0 bg-paper/95 dark:bg-paper-dark/95 backdrop-blur-sm border-t border-line dark:border-line-dark px-5 py-3">
            {!submitted ? (
              <>
                <Button variant="primary" size="lg" className="w-full" onClick={handleSubmit}
                  disabled={!selected || submitting}>
                  {submitting ? 'Submitting…' : selected ? `Submit answer ${selected}` : 'Select an option to submit'}
                </Button>
                {submitError && (
                  <p className="mt-2 text-[12.5px] text-bad text-center">Failed to submit. Try again.</p>
                )}
              </>
            ) : (
              <Button variant="primary" size="lg" className="w-full" iconRight={ArrowRight}
                onClick={handleNext} disabled={finishing}>
                {finishing ? 'Finishing…' : isLast ? 'Finish session' : 'Next question'}
              </Button>
            )}
          </div>
        </div>

        {/* Right panel */}
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
                    : <>Answer was <span className="font-mono">{correctLabel}</span>.</>}
                </div>
              </div>
              {got && submitResult && (
                <span className="font-mono text-[12px] text-good tab-num">+{submitResult.attempt.xpAwarded} XP</span>
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

          {/* Pre-submit info — desktop */}
          {!submitted && (
            <div className="hidden lg:flex flex-col gap-4">
              <Card>
                <div className="text-[11px] uppercase tracking-[0.14em] text-ink-muted dark:text-ink-muted-dark font-mono mb-2">Session progress</div>
                <div className="space-y-2 text-[13px]">
                  {[
                    { label: 'Question',   value: `${index + 1} of ${total}` },
                    { label: 'Difficulty', value: q.difficulty },
                    { label: 'XP reward',  value: `+${q.xpReward} XP` },
                  ].map(r => (
                    <div key={r.label} className="flex items-center justify-between">
                      <span className="text-ink-muted dark:text-ink-muted-dark">{r.label}</span>
                      <span className="font-medium text-ink dark:text-ink-dark capitalize">{r.value}</span>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
