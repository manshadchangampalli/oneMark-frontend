import { Lock, Medal, Flame, Trophy, Moon, MessageSquare } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { ACHIEVEMENTS } from '@/constants/data';
import { cn } from '@/utils/cn';

const ICONS: Record<string, LucideIcon> = {
  medal:            Medal,
  flame:            Flame,
  trophy:           Trophy,
  moon:             Moon,
  'message-square': MessageSquare,
};

export function AchievementsGrid() {
  return (
    <div>
      <SectionHeader eyebrow="Badges" title="Achievements" action="See all" />
      <div className="grid grid-cols-3 gap-2.5">
        {ACHIEVEMENTS.map((a) => {
          const Icon = a.unlocked ? (ICONS[a.icon] ?? Medal) : Lock;
          return (
            <Card key={a.id} padded={false} className={cn(!a.unlocked && 'opacity-55')}>
              <div className="p-3 flex flex-col items-center text-center">
                <div
                  className={cn(
                    'w-10 h-10 rounded-full flex items-center justify-center mb-2',
                    a.unlocked
                      ? 'bg-accent-soft text-accent dark:bg-[#3A2218] dark:text-[#F4B89B]'
                      : 'bg-paper dark:bg-paper-dark text-ink-muted dark:text-ink-muted-dark border border-line dark:border-line-dark border-dashed',
                  )}
                >
                  <Icon size={16} />
                </div>
                <div className="text-[12px] font-medium text-ink dark:text-ink-dark leading-tight">{a.label}</div>
                <div className="text-[10.5px] text-ink-muted dark:text-ink-muted-dark mt-0.5 leading-tight">{a.sub}</div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
