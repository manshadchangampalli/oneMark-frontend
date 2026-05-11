import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Bookmark, BookmarkCheck, Check, MessageSquare, ArrowRight, Users } from 'lucide-react';
import { Card, Button, Pill, Avatar } from '@/components/ui';
import { DAILY_Q, ROUTES } from '@/constants';
import { cn } from '@/utils';
import { CommunityCard } from './components';

type Tab = 'official' | 'community' | 'all';

export default function Question() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [tab, setTab] = useState<Tab>('community');
  const [bookmarked, setBookmarked] = useState(false);
  const [seconds, setSeconds] = useState(0);

  const correct = DAILY_Q.correct;

  useEffect(() => {
    if (submitted) return;
    const id = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, [submitted]);

  const mm = String(Math.floor(seconds / 60)).padStart(2, '0');
  const ss = String(seconds % 60).padStart(2, '0');
  const got = submitted && selected === correct;

  return (
    <div className="view-in">
      {/* ── Shared top bar ── */}
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
        {/* Metadata row */}
        <div className="hidden lg:flex items-center gap-3 text-[12px] text-ink-muted dark:text-ink-muted-dark">
          <span className="inline-flex items-center gap-1"><Users size={13} /><span className="font-mono tab-num">2,148</span> solved today</span>
        </div>
        <div className="font-mono text-[14px] tab-num text-ink dark:text-ink-dark px-2 py-1 rounded-md bg-paper dark:bg-paper-dark border border-line dark:border-line-dark">
          {mm}:{ss}
        </div>
        <button
          onClick={() => setBookmarked((b) => !b)}
          className="w-9 h-9 rounded-lg flex items-center justify-center hover:bg-ink/4 dark:hover:bg-ink-dark/5 text-ink dark:text-ink-dark"
        >
          {bookmarked ? <BookmarkCheck size={18} /> : <Bookmark size={18} />}
        </button>
      </div>

      {/* ── Desktop: split pane ── */}
      <div className="lg:grid lg:grid-cols-[1fr_420px] lg:gap-8 lg:items-start">

        {/* ── Left / main: question + options ── */}
        <div>
          {/* Mobile sticky top bar */}
          <div className="lg:hidden px-4 pt-3 pb-3 flex items-center gap-3 border-b border-line dark:border-line-dark sticky top-0 bg-paper/90 dark:bg-paper-dark/90 backdrop-blur-sm z-10">
            <button onClick={() => navigate(ROUTES.HOME)} className="w-9 h-9 -ml-1 rounded-lg flex items-center justify-center hover:bg-ink/4 text-ink dark:text-ink-dark">
              <X size={18} />
            </button>
            <div className="flex-1">
              <div className="text-[11px] uppercase tracking-[0.14em] text-ink-muted dark:text-ink-muted-dark font-mono">Daily challenge</div>
              <div className="text-[13px] font-medium text-ink dark:text-ink-dark">Question <span className="font-mono tab-num">1</span> <span className="text-ink-muted dark:text-ink-muted-dark">/ 1</span></div>
            </div>
            <div className="font-mono text-[14px] tab-num text-ink dark:text-ink-dark px-2 py-1 rounded-md bg-paper dark:bg-paper-dark border border-line dark:border-line-dark">{mm}:{ss}</div>
            <button onClick={() => setBookmarked((b) => !b)} className="w-9 h-9 rounded-lg flex items-center justify-center hover:bg-ink/4 text-ink dark:text-ink-dark">
              {bookmarked ? <BookmarkCheck size={18} /> : <Bookmark size={18} />}
            </button>
          </div>

          <div className="px-5 pt-5 pb-6 lg:px-0 lg:pt-0">
            {/* Tags */}
            <div className="flex items-center gap-2 mb-4">
              <Pill tone="accent">{DAILY_Q.subject}</Pill>
              <Pill tone="neutral">{DAILY_Q.topic}</Pill>
              <Pill tone="warn">{DAILY_Q.difficulty}</Pill>
            </div>

            {/* Question */}
            <p className="font-serif text-[19px] lg:text-[20px] leading-[1.55] text-ink dark:text-ink-dark">
              A projectile is launched from level ground with speed{' '}
              <span className="font-mono text-[16px] px-1.5 py-0.5 bg-paper dark:bg-paper-dark border border-line dark:border-line-dark rounded">20 m/s</span>{' '}
              at{' '}
              <span className="font-mono text-[16px] px-1.5 py-0.5 bg-paper dark:bg-paper-dark border border-line dark:border-line-dark rounded">60°</span>{' '}
              above the horizontal. Taking{' '}
              <span className="font-mono text-[16px] px-1.5 py-0.5 bg-paper dark:bg-paper-dark border border-line dark:border-line-dark rounded">g = 10 m/s²</span>,
              what is its <em>horizontal range</em>?
            </p>

            {/* Options */}
            <div className="mt-6 space-y-3">
              {DAILY_Q.options.map((opt) => {
                const isSel = selected === opt.id;
                const isCorrect = submitted && opt.id === correct;
                const isWrongPicked = submitted && isSel && opt.id !== correct;
                return (
                  <button
                    key={opt.id}
                    onClick={() => !submitted && setSelected(opt.id)}
                    disabled={submitted}
                    className={cn(
                      'w-full text-left rounded-xl2 border bg-surface dark:bg-surface-dark p-4 flex items-center gap-4 transition-all',
                      !submitted && (isSel ? 'border-accent bg-accent-soft/60 dark:bg-[#2A1B14]/70 dark:border-accent' : 'border-line dark:border-line-dark hover:border-ink/25 dark:hover:border-ink-dark/30'),
                      isCorrect && 'border-good border-l-4 dark:bg-[#1A2A1F]',
                      isWrongPicked && 'border-bad border-l-4 dark:bg-[#2A1815]',
                      submitted && !isCorrect && !isWrongPicked && 'border-line dark:border-line-dark opacity-70'
                    )}
                  >
                    <div className={cn('shrink-0 w-9 h-9 rounded-lg border flex items-center justify-center font-mono text-[14px] font-medium', !submitted && (isSel ? 'bg-accent text-white border-accent' : 'bg-paper dark:bg-paper-dark border-line dark:border-line-dark text-ink dark:text-ink-dark'), isCorrect && 'bg-good text-white border-good', isWrongPicked && 'bg-bad text-white border-bad')}>
                      {opt.id}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-serif text-[16px] text-ink dark:text-ink-dark">{opt.text}</div>
                      {opt.sub && <div className="font-mono text-[11.5px] text-ink-muted dark:text-ink-muted-dark mt-0.5 tab-num">{opt.sub}</div>}
                    </div>
                    {isCorrect && <Check size={18} strokeWidth={2.5} className="text-good" />}
                    {isWrongPicked && <X size={18} strokeWidth={2.5} className="text-bad" />}
                  </button>
                );
              })}
            </div>

            {/* Submit — mobile sticky / desktop inline */}
            <div className="mt-5 hidden lg:block">
              {!submitted ? (
                <Button variant="primary" size="lg" className="w-full" disabled={!selected} onClick={() => setSubmitted(true)}>
                  {selected ? `Submit answer ${selected}` : 'Select an option to submit'}
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button variant="secondary" size="lg" className="flex-1" icon={MessageSquare} onClick={() => {}}>Discuss</Button>
                  <Button variant="primary" size="lg" className="flex-[1.4]" iconRight={ArrowRight} onClick={() => navigate(ROUTES.PROGRESS)}>Next question</Button>
                </div>
              )}
            </div>
          </div>

          {/* Mobile submit */}
          <div className="lg:hidden sticky bottom-0 bg-paper/95 dark:bg-paper-dark/95 backdrop-blur-sm border-t border-line dark:border-line-dark px-5 py-3">
            {!submitted ? (
              <Button variant="primary" size="lg" className="w-full" disabled={!selected} onClick={() => setSubmitted(true)}>
                {selected ? `Submit answer ${selected}` : 'Select an option to submit'}
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button variant="secondary" size="lg" className="flex-1" icon={MessageSquare} onClick={() => {}}>Discuss</Button>
                <Button variant="primary" size="lg" className="flex-[1.4]" iconRight={ArrowRight} onClick={() => navigate(ROUTES.PROGRESS)}>Next question</Button>
              </div>
            )}
          </div>
        </div>

        {/* ── Right panel: explanation (desktop always visible, mobile post-submit) ── */}
        <div className="lg:sticky lg:top-20">
          {/* Result banner — shows after submit */}
          {submitted && (
            <div className={cn('flex items-center gap-3 p-4 rounded-xl2 border-l-4 mb-4 reveal-in', got ? 'border-good bg-good-soft/60 dark:bg-[#1A2A1F]' : 'border-bad bg-bad/8 dark:bg-[#2A1815]')}>
              <div className={cn('w-8 h-8 rounded-full flex items-center justify-center shrink-0', got ? 'bg-good text-white' : 'bg-bad text-white')}>
                {got ? <Check size={16} strokeWidth={2.5} /> : <X size={16} strokeWidth={2.5} />}
              </div>
              <div className="flex-1">
                <div className="text-[14px] font-medium text-ink dark:text-ink-dark">{got ? 'Correct.' : 'Not quite.'}</div>
                <div className="text-[12.5px] text-ink-muted dark:text-ink-muted-dark">
                  {got
                    ? <>Solved in <span className="font-mono tab-num">{mm}:{ss}</span> · faster than <span className="font-mono tab-num">68%</span>.</>
                    : <>Answer was <span className="font-mono">A</span>. See explanation below.</>
                  }
                </div>
              </div>
              {got && <span className="font-mono text-[12px] text-good tab-num">+50 XP</span>}
            </div>
          )}

          {/* Desktop: always show explanation panel */}
          <div className="hidden lg:block">
            <ExplanationPanel submitted={submitted} tab={tab} setTab={setTab} />
          </div>

          {/* Mobile: only after submit */}
          {submitted && (
            <div className="lg:hidden px-5 mt-3 pb-32 reveal-in">
              <ExplanationPanel submitted={submitted} tab={tab} setTab={setTab} />
            </div>
          )}

          {/* Desktop: pre-submit — show related info */}
          {!submitted && (
            <div className="hidden lg:flex flex-col gap-4">
              <Card>
                <div className="text-[11px] uppercase tracking-[0.14em] text-ink-muted dark:text-ink-muted-dark font-mono mb-2">About this question</div>
                <div className="space-y-2 text-[13px]">
                  {[
                    { label: 'Topic',       value: 'Projectile motion' },
                    { label: 'Subtopic',    value: 'Range formula' },
                    { label: 'Solved by',   value: '2,148 students today' },
                    { label: 'Avg. time',   value: '2 min 18 sec' },
                    { label: 'Explanations',value: '47 community answers' },
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
                    { name: 'You',         time: '—',    avatar: 'R', you: true },
                  ].map((u) => (
                    <li key={u.name} className="flex items-center gap-2.5">
                      <Avatar initial={u.avatar} size={28} tone={u.you ? 'accent' : 'neutral'} />
                      <span className={cn('text-[13px] flex-1', u.you ? 'font-medium text-ink dark:text-ink-dark' : 'text-ink-muted dark:text-ink-muted-dark')}>{u.name}</span>
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

function ExplanationPanel({ submitted, tab, setTab }: { submitted: boolean; tab: Tab; setTab: (t: Tab) => void }) {
  const tabs: { id: Tab; label: React.ReactNode }[] = [
    { id: 'official',  label: 'Official' },
    { id: 'community', label: 'Top community' },
    { id: 'all',       label: <><span>All </span><span className="font-mono tab-num text-ink-muted dark:text-ink-muted-dark">47</span></> },
  ];

  if (!submitted) {
    return (
      <Card>
        <div className="text-[13px] text-ink-muted dark:text-ink-muted-dark text-center py-6 font-serif italic">
          Submit your answer to see the explanation.
        </div>
      </Card>
    );
  }

  return (
    <div>
      <div className="flex gap-1 border-b border-line dark:border-line-dark mb-4">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={cn('px-3 h-10 text-[13.5px] font-medium relative -mb-px', tab === t.id ? 'text-ink dark:text-ink-dark border-b-2 border-ink dark:border-ink-dark' : 'text-ink-muted dark:text-ink-muted-dark hover:text-ink dark:hover:text-ink-dark')}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div className="space-y-3">
        {tab === 'official' && (
          <Card>
            <div className="text-[11px] uppercase tracking-[0.14em] text-ink-muted dark:text-ink-muted-dark font-mono mb-2">Worked solution</div>
            <ol className="space-y-2.5">
              {DAILY_Q.official.map((line, i) => (
                <li key={i} className="flex gap-3">
                  <span className="font-mono text-[12px] text-ink-muted dark:text-ink-muted-dark tab-num shrink-0 mt-0.5">{i + 1}.</span>
                  <span className="font-serif text-[15px] leading-relaxed text-ink dark:text-ink-dark">{line}</span>
                </li>
              ))}
            </ol>
          </Card>
        )}
        {(tab === 'community' || tab === 'all') && (
          <>
            {DAILY_Q.community.map((c, i) => (
              <CommunityCard key={c.id} c={c} pinned={i === 0 && tab === 'community'} />
            ))}
            {tab === 'all' && (
              <button className="w-full h-11 text-[13.5px] font-medium text-ink-muted dark:text-ink-muted-dark border border-dashed border-line dark:border-line-dark rounded-lg hover:text-ink dark:hover:text-ink-dark">
                Show <span className="font-mono tab-num">44</span> more explanations
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}
