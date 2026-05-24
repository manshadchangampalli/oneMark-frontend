import { StatsGrid } from './components/StatsGrid';
import { MasterySection } from './components/MasterySection';
import { ActivityHeatmap } from './components/ActivityHeatmap';
import { Leaderboard } from './components/Leaderboard';
import { StreakHistory } from './components/StreakHistory';
import { useUserActivity } from './hooks/progress.hooks';

const HEATMAP_DAYS = 52 * 7;

export default function Progress() {
  const { data: activity = [] } = useUserActivity(HEATMAP_DAYS);
  return (
    <div className="view-in pb-6 lg:pb-0">
      <div className="lg:grid lg:grid-cols-[1fr_320px] lg:gap-8 lg:items-start">

        {/* ── Left column ── */}
        <div>
          <div className="px-5 pt-4 pb-2 lg:px-0 lg:pt-0">
            <div className="text-[11px] uppercase tracking-[0.14em] text-ink-muted dark:text-ink-muted-dark font-mono">Progress</div>
            <h1 className="mt-1 text-[22px] lg:text-[26px] font-semibold tracking-tight text-ink dark:text-ink-dark">
              Your study, at a glance.
            </h1>
          </div>

          <div className="px-5 lg:px-0 mt-3 space-y-5">
            <StatsGrid />
            <MasterySection />
          </div>
        </div>

        {/* ── Right column ── */}
        <div className="px-5 lg:px-0 mt-5 lg:mt-0 space-y-4 lg:sticky lg:top-20">
          <ActivityHeatmap activity={activity} />
          <Leaderboard />
          <StreakHistory />
        </div>
      </div>
    </div>
  );
}
