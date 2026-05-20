import { Moon, Globe, Download, Shield, HelpCircle, LogOut, ChevronRight, Sun, Monitor } from 'lucide-react';
import { Card, SectionHeader, Avatar, Pill } from '@/components/ui';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { STUDY_BUDDIES, ACHIEVEMENTS } from '@/constants';
import { useAppStore } from '@/store';
import { useAuthStore } from '@/store/useAuthStore';
import { useLogout } from '@/screens/auth/hooks/auth.hooks';
import { SettingRow } from './components';
import { cn } from '@/utils';
import { Medal, Flame, Trophy, Moon as MoonIcon, MessageSquare, Lock } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/constants';
import { toast } from 'react-hot-toast';

const ACHIEVEMENT_ICONS: Record<string, LucideIcon> = {
  medal: Medal, flame: Flame, trophy: Trophy, moon: MoonIcon, 'message-square': MessageSquare,
};

export default function Profile() {
  const { isDark, setDark, notificationsEnabled, toggleNotifications } = useAppStore();
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const logoutMutation = useLogout();
  const [notifyFreq, setNotifyFreq] = useState('daily');
  const [theme, setTheme] = useState(isDark ? 'dark' : 'light');

  function handleThemeChange(value: string) {
    setTheme(value);
    setDark(value === 'dark');
  }

  function handleSignOut() {
    logoutMutation.mutate(undefined, {
      onSettled: () => {
        navigate(ROUTES.AUTH, { replace: true });
        toast.success('Signed out');
      },
    });
  }

  return (
    <div className="view-in pb-6 lg:pb-0">
      <div className="px-5 pt-4 lg:px-0 lg:pt-0 lg:mb-6">
        <div className="text-[11px] uppercase tracking-[0.14em] text-ink-muted dark:text-ink-muted-dark font-mono">Profile</div>
        <h1 className="mt-1 text-[22px] lg:text-[26px] font-semibold tracking-tight text-ink dark:text-ink-dark">Account & settings</h1>
      </div>

      <div className="lg:grid lg:grid-cols-[1fr_340px] lg:gap-8 lg:items-start">

        {/* ── Left column ── */}
        <div className="space-y-5">

          {/* Hero card */}
          <div className="px-5 mt-3 lg:px-0 lg:mt-0">
            <Card>
              <div className="flex items-start gap-4">
                <Avatar initial={user?.name?.[0] ?? 'U'} tone="accent" size={64} />
                <div className="flex-1 min-w-0">
                  <div className="text-[18px] font-semibold text-ink dark:text-ink-dark tracking-tight">{user?.name ?? '—'}</div>
                  <div className="text-[13px] text-ink-muted dark:text-ink-muted-dark">{[user?.grade, user?.school].filter(Boolean).join(' · ') || 'No school set'}</div>
                  <div className="mt-2 flex items-center gap-2 flex-wrap">
                    {user?.targetExam && <Pill tone="accent">Target: {user.targetExam.toUpperCase()}</Pill>}
                    <span className="font-mono text-[11px] text-ink-muted dark:text-ink-muted-dark tab-num">{user?.email}</span>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3 mt-5 pt-4 border-t border-line dark:border-line-dark">
                {[
                  { label: 'Solved', value: '1,284' },
                  { label: 'Accuracy', value: '76%' },
                  { label: 'Streak', value: '23' },
                ].map((s) => (
                  <div key={s.label}>
                    <div className="font-mono text-[18px] tab-num font-semibold text-ink dark:text-ink-dark leading-none">{s.value}</div>
                    <div className="text-[11px] uppercase tracking-[0.12em] text-ink-muted dark:text-ink-muted-dark font-mono mt-1">{s.label}</div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Achievements */}
          <div className="hidden lg:block px-5 lg:px-0">
            <SectionHeader eyebrow="Badges" title="Achievements" action="See all" />
            <div className="grid grid-cols-3 gap-2.5">
              {ACHIEVEMENTS.map((a) => {
                const AchIcon = a.unlocked ? (ACHIEVEMENT_ICONS[a.icon] ?? Medal) : Lock;
                return (
                  <Card key={a.id} padded={false} className={cn(!a.unlocked && 'opacity-55')}>
                    <div className="p-3 flex flex-col items-center text-center">
                      <div className={cn('w-10 h-10 rounded-full flex items-center justify-center mb-2', a.unlocked ? 'bg-accent-soft text-accent dark:bg-[#3A2218] dark:text-[#F4B89B]' : 'bg-paper dark:bg-paper-dark text-ink-muted dark:text-ink-muted-dark border border-line dark:border-line-dark border-dashed')}>
                        <AchIcon size={16} />
                      </div>
                      <div className="text-[12px] font-medium text-ink dark:text-ink-dark leading-tight">{a.label}</div>
                      <div className="text-[10.5px] text-ink-muted dark:text-ink-muted-dark mt-0.5 leading-tight">{a.sub}</div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Study buddies */}
          <div className="px-5 lg:px-0">
            <SectionHeader eyebrow="Network" title="Study buddies" action="Add" />
            <Card padded={false}>
              <ul className="divide-y divide-line dark:divide-line-dark">
                {STUDY_BUDDIES.map((b) => (
                  <li key={b.id} className="px-4 py-3 flex items-center gap-3">
                    <Avatar initial={b.avatar} size={36} />
                    <div className="flex-1 min-w-0">
                      <div className="text-[13.5px] font-medium text-ink dark:text-ink-dark">{b.name}</div>
                      <div className="text-[12px] text-ink-muted dark:text-ink-muted-dark">{b.sub}</div>
                    </div>
                    <button className="text-[12.5px] text-ink-muted dark:text-ink-muted-dark hover:text-ink dark:hover:text-ink-dark">Message</button>
                  </li>
                ))}
              </ul>
            </Card>
          </div>
        </div>

        {/* ── Right column: settings ── */}
        <div className="px-5 lg:px-0 mt-5 lg:mt-0 space-y-4 lg:sticky lg:top-20">

          {/* Appearance — radio group */}
          <Card>
            <div className="text-[11px] uppercase tracking-[0.14em] text-ink-muted dark:text-ink-muted-dark font-mono mb-4">Appearance</div>
            <RadioGroup value={theme} onValueChange={handleThemeChange} className="space-y-2.5">
              {[
                { value: 'light', label: 'Light', Icon: Sun, sub: 'Always light' },
                { value: 'dark', label: 'Dark', Icon: Moon, sub: 'Always dark' },
                { value: 'system', label: 'System', Icon: Monitor, sub: 'Follow device setting' },
              ].map((opt) => (
                <div
                  key={opt.value}
                  className={cn(
                    'flex items-center gap-3 p-3 rounded-lg border transition-colors',
                    theme === opt.value
                      ? 'border-accent bg-accent-soft/60 dark:bg-[#2A1B14]/60 dark:border-accent/60'
                      : 'border-line dark:border-line-dark hover:border-ink/20 dark:hover:border-ink-dark/20'
                  )}
                >
                  <RadioGroupItem
                    value={opt.value}
                    id={`theme-${opt.value}`}
                    className="border-ink-muted dark:border-ink-muted-dark data-[state=checked]:border-accent data-[state=checked]:text-accent"
                  />
                  <Label htmlFor={`theme-${opt.value}`} className="flex items-center gap-2.5 flex-1 cursor-pointer">
                    <opt.Icon size={15} className={theme === opt.value ? 'text-accent' : 'text-ink-muted dark:text-ink-muted-dark'} />
                    <div>
                      <div className={cn('text-[13.5px] font-medium', theme === opt.value ? 'text-ink dark:text-ink-dark' : 'text-ink dark:text-ink-dark')}>{opt.label}</div>
                      <div className="text-[11.5px] text-ink-muted dark:text-ink-muted-dark">{opt.sub}</div>
                    </div>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </Card>

          {/* Notifications — radio group */}
          <Card>
            <div className="flex items-center justify-between mb-4">
              <div className="text-[11px] uppercase tracking-[0.14em] text-ink-muted dark:text-ink-muted-dark font-mono">Notifications</div>
              <div className="flex items-center gap-2">
                <Label htmlFor="notif-toggle" className="text-[13px] text-ink-muted dark:text-ink-muted-dark cursor-pointer">
                  {notificationsEnabled ? 'On' : 'Off'}
                </Label>
                <Switch
                  id="notif-toggle"
                  checked={notificationsEnabled}
                  onCheckedChange={() => toggleNotifications()}
                  className="data-[state=checked]:bg-accent"
                />
              </div>
            </div>

            {notificationsEnabled && (
              <RadioGroup value={notifyFreq} onValueChange={setNotifyFreq} className="space-y-2">
                {[
                  { value: 'daily', label: 'Daily reminder', sub: '7:30 PM every day' },
                  { value: 'weekly', label: 'Weekly digest', sub: 'Every Sunday morning' },
                  { value: 'streak', label: 'Streak only', sub: 'Only when streak is at risk' },
                ].map((opt) => (
                  <div key={opt.value} className="flex items-center gap-3">
                    <RadioGroupItem
                      value={opt.value}
                      id={`notif-${opt.value}`}
                      className="border-ink-muted dark:border-ink-muted-dark data-[state=checked]:border-accent data-[state=checked]:text-accent"
                    />
                    <Label htmlFor={`notif-${opt.value}`} className="flex-1 cursor-pointer">
                      <div className="text-[13.5px] font-medium text-ink dark:text-ink-dark">{opt.label}</div>
                      <div className="text-[11.5px] text-ink-muted dark:text-ink-muted-dark">{opt.sub}</div>
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            )}
          </Card>

          {/* Other settings */}
          <Card padded={false}>
            <ul className="divide-y divide-line dark:divide-line-dark">
              <SettingRow Icon={Globe} title="Language" sub="English (India)" chevron />
              <SettingRow Icon={Download} title="Offline mode" sub="2 subjects downloaded" chevron />
              <SettingRow Icon={Shield} title="Privacy" chevron />
              <SettingRow Icon={HelpCircle} title="Help & feedback" chevron />
            </ul>
          </Card>

          {/* Account actions */}
          <Card padded={false}>
            <ul className="divide-y divide-line dark:divide-line-dark">
              {[
                { label: 'Change password', sub: 'Last changed 3 months ago' },
                { label: 'Linked accounts', sub: 'Google · Active' },
                { label: 'Export my data', sub: 'Download all activity' },
              ].map((item) => (
                <li key={item.label} className="px-4 py-3 flex items-center gap-3">
                  <div className="flex-1">
                    <div className="text-[13.5px] font-medium text-ink dark:text-ink-dark">{item.label}</div>
                    <div className="text-[11.5px] text-ink-muted dark:text-ink-muted-dark">{item.sub}</div>
                  </div>
                  <ChevronRight size={15} className="text-ink-muted dark:text-ink-muted-dark" />
                </li>
              ))}
            </ul>
          </Card>

          <button
            onClick={handleSignOut}
            disabled={logoutMutation.isPending}
            className="w-full h-11 rounded-lg border border-line dark:border-line-dark text-[13.5px] font-medium text-bad hover:bg-bad/5 flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
          >
            <LogOut size={15} /> {logoutMutation.isPending ? 'Signing out…' : 'Sign out'}
          </button>

          <div className="text-center text-[11px] text-ink-muted dark:text-ink-muted-dark font-mono pb-2">
            oneMark · v1.0.0
          </div>
        </div>
      </div>
    </div>
  );
}
