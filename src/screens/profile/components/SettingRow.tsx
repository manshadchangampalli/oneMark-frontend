import { ChevronRight } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface SettingRowProps {
  Icon: LucideIcon;
  title: string;
  sub?: string;
  control?: React.ReactNode;
  chevron?: boolean;
}

export function SettingRow({ Icon, title, sub, control, chevron }: SettingRowProps) {
  return (
    <li className="px-4 py-3 flex items-center gap-3">
      <div className="w-9 h-9 rounded-lg bg-paper dark:bg-paper-dark border border-line dark:border-line-dark flex items-center justify-center text-ink dark:text-ink-dark">
        <Icon size={16} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-[13.5px] font-medium text-ink dark:text-ink-dark">{title}</div>
        {sub && <div className="text-[11.5px] text-ink-muted dark:text-ink-muted-dark">{sub}</div>}
      </div>
      {control}
      {chevron && <ChevronRight size={15} className="text-ink-muted dark:text-ink-muted-dark" />}
    </li>
  );
}
