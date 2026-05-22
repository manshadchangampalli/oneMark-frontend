import { useEffect, useMemo, useRef } from 'react';
import { Card } from '@/components/ui/Card';
import type { ActivityDay } from '@/api/users.api';

const HEATMAP_WEEKS = 52;

interface Cell { lvl: number; date: string; count: number }

function gridFromActivity(activity: ActivityDay[], weeks: number): Cell[][] {
  const byDate = new Map(activity.map(a => [a.date, a]));
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);
  const dow = today.getUTCDay(); // 0=Sun..6=Sat — leftmost cell is a Sunday

  const start = new Date(today);
  start.setUTCDate(start.getUTCDate() - ((weeks - 1) * 7 + dow));

  const grid: Cell[][] = [];
  for (let w = 0; w < weeks; w++) {
    const col: Cell[] = [];
    for (let d = 0; d < 7; d++) {
      const cell = new Date(start);
      cell.setUTCDate(start.getUTCDate() + w * 7 + d);
      const key = cell.toISOString().slice(0, 10);
      if (cell > today) {
        col.push({ lvl: -1, date: key, count: 0 });
      } else {
        const hit = byDate.get(key);
        col.push({ lvl: hit?.level ?? 0, date: key, count: hit?.count ?? 0 });
      }
    }
    grid.push(col);
  }
  return grid;
}

function lvlColor(lvl: number, dark: boolean): string {
  if (lvl === -1) return 'transparent';
  if (dark) return ['#221F18','#3A2E1E','#7A3D14','#B7491A','#E8580C'][lvl] ?? 'transparent';
  return ['#F1ECE0','#F5D9C4','#EFAE85','#E07A45','#D4541A'][lvl] ?? 'transparent';
}

function HeatCell({ lvl, title }: { lvl: number; title?: string }) {
  return (
    <div
      title={title}
      className="w-[14px] h-[14px] rounded-[3px] border border-black/4 dark:border-white/4 relative overflow-hidden"
    >
      <div className="absolute inset-0 block dark:hidden" style={{ background: lvlColor(lvl, false) }} />
      <div className="absolute inset-0 hidden dark:block" style={{ background: lvlColor(lvl, true) }} />
    </div>
  );
}

function HeatLegend({ lvl }: { lvl: number }) {
  return (
    <span className="relative inline-block w-[10px] h-[10px] rounded-sm overflow-hidden">
      <span className="absolute inset-0 block dark:hidden" style={{ background: lvlColor(lvl, false) }} />
      <span className="absolute inset-0 hidden dark:block" style={{ background: lvlColor(lvl, true) }} />
    </span>
  );
}

interface ActivityHeatmapProps {
  activity: ActivityDay[];
}

export function ActivityHeatmap({ activity }: ActivityHeatmapProps) {
  const heatmap     = useMemo(() => gridFromActivity(activity, HEATMAP_WEEKS), [activity]);
  const totalActive = useMemo(() => activity.filter(a => a.count > 0).length, [activity]);

  const scrollRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollLeft = scrollRef.current.scrollWidth;
  }, [heatmap]);

  return (
    <Card>
      <div className="flex items-center justify-between mb-3">
        <div>
          <div className="text-[11px] uppercase tracking-[0.14em] text-ink-muted dark:text-ink-muted-dark font-mono">Activity</div>
          <div className="text-[14px] font-medium text-ink dark:text-ink-dark mt-0.5">Last 52 weeks</div>
        </div>
        <div className="text-[11.5px] font-mono text-ink-muted dark:text-ink-muted-dark tab-num">
          <span className="text-ink dark:text-ink-dark">{totalActive}</span> active days
        </div>
      </div>

      <div ref={scrollRef} className="overflow-x-auto no-scrollbar">
        <div className="flex gap-[3px]">
          {heatmap.map((col, w) => (
            <div key={w} className="flex flex-col gap-[3px]">
              {col.map((cell, d) => (
                <HeatCell
                  key={d}
                  lvl={cell.lvl}
                  title={cell.lvl === -1 ? undefined : `${cell.date} · ${cell.count} ${cell.count === 1 ? 'attempt' : 'attempts'}`}
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-3 flex items-center justify-end gap-2 text-[11px] text-ink-muted dark:text-ink-muted-dark font-mono">
        <span>less</span>
        {[0,1,2,3,4].map((l) => <HeatLegend key={l} lvl={l} />)}
        <span>more</span>
      </div>
    </Card>
  );
}
