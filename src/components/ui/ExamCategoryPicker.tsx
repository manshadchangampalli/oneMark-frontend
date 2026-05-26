import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { examsApi } from '@/api/exams.api';
import type { ExamCategoryWithTiers } from '@/api/exams.api';
import { cn } from '@/utils/cn';

interface ExamCategoryPickerProps {
  /** Currently selected exam code (e.g. "psc-ldc"); jumps straight to its category */
  value?: string;
  onChange: (examCode: string, exam: { id: string; code: string; label: string }) => void;
  /** "primary" CTA color for selected state — uses the project's accent by default */
  className?: string;
}

export function ExamCategoryPicker({ value, onChange, className }: ExamCategoryPickerProps) {
  const { data: categories = [], isLoading } = useQuery({
    queryKey: ['exam-categories'],
    queryFn:  examsApi.listCategories,
    staleTime: 5 * 60 * 1000,
  });

  // If a value is provided, pre-select its category
  const initialCategory =
    value && categories.length
      ? categories.find((c) => c.tiers.some((t) => t.exams.some((e) => e.code === value))) ?? null
      : null;

  const [pickedCategory, setPickedCategory] = useState<ExamCategoryWithTiers | null>(initialCategory);

  if (isLoading) {
    return (
      <div className={cn('py-10 text-center text-[13px] text-ink-muted dark:text-ink-muted-dark', className)}>
        Loading exams…
      </div>
    );
  }

  if (categories.length === 0) {
    return (
      <div className={cn('py-10 text-center text-[13px] text-ink-muted dark:text-ink-muted-dark', className)}>
        No exams available.
      </div>
    );
  }

  // ── Step 2: Post picker within a category ──
  if (pickedCategory) {
    return (
      <div className={cn('space-y-4', className)}>
        <button
          type="button"
          onClick={() => setPickedCategory(null)}
          className="inline-flex items-center gap-1 text-[13px] text-ink-muted dark:text-ink-muted-dark hover:text-ink dark:hover:text-ink-dark"
        >
          <ChevronLeft size={14} /> All categories
        </button>

        <div className="flex items-center gap-2.5">
          {pickedCategory.colorHex && (
            <span className="h-5 w-5 rounded" style={{ background: pickedCategory.colorHex }} />
          )}
          <div>
            <div className="text-[15px] font-semibold text-ink dark:text-ink-dark">{pickedCategory.label}</div>
            {pickedCategory.description && (
              <div className="text-[12px] text-ink-muted dark:text-ink-muted-dark">{pickedCategory.description}</div>
            )}
          </div>
        </div>

        <div className="space-y-4">
          {pickedCategory.tiers.length === 0 && (
            <div className="py-6 text-center text-[13px] text-ink-muted dark:text-ink-muted-dark">
              No posts available yet.
            </div>
          )}
          {pickedCategory.tiers.map((group) => (
            <div key={group.tier ?? 'untiered'}>
              {group.tier && (
                <div className="text-[11px] uppercase tracking-[0.14em] text-ink-muted dark:text-ink-muted-dark font-mono mb-2">
                  {group.tier}
                </div>
              )}
              <div className="space-y-1.5">
                {group.exams.map((exam) => {
                  const selected = value === exam.code;
                  return (
                    <button
                      key={exam.id}
                      type="button"
                      onClick={() => onChange(exam.code, exam)}
                      className={cn(
                        'w-full text-left px-3.5 py-3 rounded-lg border transition-colors flex items-start gap-3',
                        selected
                          ? 'border-accent bg-accent-soft/40 dark:bg-[#2A1B14]/40'
                          : 'border-line dark:border-line-dark hover:border-ink/30 dark:hover:border-ink-dark/30',
                      )}
                    >
                      <div className="flex-1 min-w-0">
                        <div className="text-[13.5px] font-medium text-ink dark:text-ink-dark">{exam.label}</div>
                        {exam.description && (
                          <div className="text-[12px] text-ink-muted dark:text-ink-muted-dark line-clamp-1">
                            {exam.description}
                          </div>
                        )}
                      </div>
                      {selected && <Check size={16} className="text-accent shrink-0 mt-0.5" />}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ── Step 1: Category picker ──
  return (
    <div className={cn('space-y-2', className)}>
      {categories.map((c) => {
        const isPicked = c.tiers.some((t) => t.exams.some((e) => e.code === value));
        return (
          <button
            key={c.id}
            type="button"
            disabled={!c.isActive}
            onClick={() => setPickedCategory(c)}
            className={cn(
              'w-full text-left px-3.5 py-3 rounded-lg border transition-colors flex items-center gap-3',
              !c.isActive && 'opacity-50 cursor-not-allowed',
              isPicked
                ? 'border-accent bg-accent-soft/40 dark:bg-[#2A1B14]/40'
                : 'border-line dark:border-line-dark hover:border-ink/30 dark:hover:border-ink-dark/30',
            )}
          >
            {c.colorHex ? (
              <span className="h-9 w-9 rounded shrink-0" style={{ background: c.colorHex }} />
            ) : (
              <span className="h-9 w-9 rounded shrink-0 bg-paper dark:bg-paper-dark border border-line dark:border-line-dark" />
            )}
            <div className="flex-1 min-w-0">
              <div className="text-[14px] font-semibold text-ink dark:text-ink-dark">
                {c.label}
                {!c.isActive && <span className="ml-2 text-[11px] font-normal text-ink-muted dark:text-ink-muted-dark">Coming soon</span>}
              </div>
              {c.description && (
                <div className="text-[12px] text-ink-muted dark:text-ink-muted-dark line-clamp-1">{c.description}</div>
              )}
            </div>
            <ChevronRight size={16} className="text-ink-muted dark:text-ink-muted-dark shrink-0" />
          </button>
        );
      })}
    </div>
  );
}
