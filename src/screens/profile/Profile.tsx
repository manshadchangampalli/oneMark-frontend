import { useState, useEffect, type FormEvent } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Moon, LogOut, Sun, Monitor, Check, Pencil } from 'lucide-react';
import { Card, Avatar, Pill } from '@/components/ui';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Modal } from '@/components/ui/Modal';
import { useAppStore } from '@/store';
import { useAuthStore } from '@/store/useAuthStore';
import { useLogout } from '@/screens/auth/hooks/auth.hooks';
import { authApi } from '@/api/auth.api';
import { usersApi, type UpdateMeDto } from '@/api/users.api';
import { examsApi } from '@/api/exams.api';
import { ROUTES } from '@/constants';
import { cn } from '@/utils';
import { toast } from 'react-hot-toast';
import type { User } from '@/types/auth';

export default function Profile() {
  const { isDark, setDark, notificationsEnabled, toggleNotifications } = useAppStore();
  const { user, setUser } = useAuthStore();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const logoutMutation = useLogout();
  const [theme, setTheme] = useState(isDark ? 'dark' : 'light');
  const [editOpen, setEditOpen] = useState(false);
  const [examOpen, setExamOpen] = useState(false);

  const { data: stats } = useQuery({
    queryKey: ['user-stats'],
    queryFn:  usersApi.getStats,
    staleTime: 30 * 1000,
  });

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

  async function refreshUser() {
    const fresh = await authApi.getMe();
    if (fresh) setUser(fresh as User);
    qc.invalidateQueries({ queryKey: ['user-stats'] });
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
                  <div className="flex items-center gap-2">
                    <div className="text-[18px] font-semibold text-ink dark:text-ink-dark tracking-tight truncate">{user?.name ?? '—'}</div>
                    <button
                      onClick={() => setEditOpen(true)}
                      className="shrink-0 p-1 rounded text-ink-muted dark:text-ink-muted-dark hover:text-ink dark:hover:text-ink-dark"
                      aria-label="Edit profile"
                    >
                      <Pencil size={14} />
                    </button>
                  </div>
                  <div className="text-[13px] text-ink-muted dark:text-ink-muted-dark">
                    {[user?.grade, user?.school].filter(Boolean).join(' · ') || 'No school set'}
                  </div>
                  <div className="mt-2 flex items-center gap-2 flex-wrap">
                    <button onClick={() => setExamOpen(true)} className="appearance-none">
                      {user?.targetExam
                        ? <Pill tone="accent">Target: {user.targetExam.toUpperCase()}</Pill>
                        : <Pill tone="neutral">Set target exam</Pill>}
                    </button>
                    <span className="font-mono text-[11px] text-ink-muted dark:text-ink-muted-dark tab-num truncate">{user?.email}</span>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3 mt-5 pt-4 border-t border-line dark:border-line-dark">
                <Stat label="Solved"   value={stats ? stats.solved.toLocaleString() : '—'} />
                <Stat label="Accuracy" value={stats ? `${stats.accuracy}%` : '—'} />
                <Stat label="Streak"   value={stats ? `${stats.streak}` : '—'} />
              </div>
              {stats && stats.longestStreak > 0 && (
                <div className="mt-3 text-[11.5px] text-ink-muted dark:text-ink-muted-dark">
                  Longest streak: <span className="font-mono tab-num text-ink dark:text-ink-dark">{stats.longestStreak}</span> days
                </div>
              )}
            </Card>
          </div>
        </div>

        {/* ── Right column: settings ── */}
        <div className="px-5 lg:px-0 mt-5 lg:mt-0 space-y-4 lg:sticky lg:top-20">

          <Card>
            <div className="text-[11px] uppercase tracking-[0.14em] text-ink-muted dark:text-ink-muted-dark font-mono mb-4">Appearance</div>
            <RadioGroup value={theme} onValueChange={handleThemeChange} className="space-y-2.5">
              {[
                { value: 'light',  label: 'Light',  Icon: Sun,     sub: 'Always light' },
                { value: 'dark',   label: 'Dark',   Icon: Moon,    sub: 'Always dark' },
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
                      <div className="text-[13.5px] font-medium text-ink dark:text-ink-dark">{opt.label}</div>
                      <div className="text-[11.5px] text-ink-muted dark:text-ink-muted-dark">{opt.sub}</div>
                    </div>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-[13.5px] font-medium text-ink dark:text-ink-dark">Notifications</div>
                <div className="text-[11.5px] text-ink-muted dark:text-ink-muted-dark">Reminders for daily practice</div>
              </div>
              <Switch
                checked={notificationsEnabled}
                onCheckedChange={() => toggleNotifications()}
                className="data-[state=checked]:bg-accent"
              />
            </div>
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

      <EditProfileDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        user={user}
        onSaved={() => { setEditOpen(false); refreshUser(); }}
      />
      <ExamSwitcherDialog
        open={examOpen}
        onOpenChange={setExamOpen}
        currentCode={user?.targetExam}
        onSwitched={() => { setExamOpen(false); refreshUser(); }}
      />
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="font-mono text-[18px] tab-num font-semibold text-ink dark:text-ink-dark leading-none">{value}</div>
      <div className="text-[11px] uppercase tracking-[0.12em] text-ink-muted dark:text-ink-muted-dark font-mono mt-1">{label}</div>
    </div>
  );
}

function EditProfileDialog({
  open, onOpenChange, user, onSaved,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  user: User | null;
  onSaved: () => void;
}) {
  const [name, setName]     = useState(user?.name ?? '');
  const [school, setSchool] = useState(user?.school ?? '');
  const [grade, setGrade]   = useState(user?.grade ?? '');

  useEffect(() => {
    if (open) {
      setName(user?.name ?? '');
      setSchool(user?.school ?? '');
      setGrade(user?.grade ?? '');
    }
  }, [open, user]);

  const mutation = useMutation({
    mutationFn: (dto: UpdateMeDto) => usersApi.updateMe(dto),
    onSuccess: () => { toast.success('Profile updated'); onSaved(); },
    onError:   () => { toast.error('Failed to update profile'); },
  });

  function submit(e: FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    mutation.mutate({
      name:   name.trim(),
      school: school.trim() || null,
      grade:  grade.trim() || null,
    });
  }

  return (
    <Modal
      open={open}
      onClose={() => onOpenChange(false)}
      title="Edit profile"
      description="Update your display name, school and grade."
    >
      <form onSubmit={submit} className="space-y-4">
        <div className="space-y-3">
          <FormField label="Name" value={name} onChange={setName} required />
          <FormField label="School" value={school} onChange={setSchool} placeholder="e.g. St. Joseph's HSS" />
          <FormField label="Grade" value={grade} onChange={setGrade} placeholder="e.g. 12 / 1st year" />
        </div>

        <div className="flex items-center justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="h-10 px-4 rounded-lg border border-line dark:border-line-dark text-[13.5px] text-ink dark:text-ink-dark"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={mutation.isPending || !name.trim()}
            className="h-10 px-4 rounded-lg bg-accent text-white text-[13.5px] font-medium disabled:opacity-50"
          >
            {mutation.isPending ? 'Saving…' : 'Save'}
          </button>
        </div>
      </form>
    </Modal>
  );
}

function FormField({
  label, value, onChange, placeholder, required,
}: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string; required?: boolean;
}) {
  return (
    <label className="block space-y-1.5">
      <span className="text-[12px] uppercase tracking-wide text-ink-muted dark:text-ink-muted-dark font-mono">{label}</span>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        className="w-full h-10 px-3 rounded-lg border border-line dark:border-line-dark bg-paper dark:bg-paper-dark text-[14px] text-ink dark:text-ink-dark focus:outline-none focus:border-accent"
      />
    </label>
  );
}

function ExamSwitcherDialog({
  open, onOpenChange, currentCode, onSwitched,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  currentCode?: string;
  onSwitched: () => void;
}) {
  const { data: allExams = [], isLoading: examsLoading } = useQuery({
    queryKey: ['exams'],
    queryFn:  examsApi.list,
    enabled:  open,
    staleTime: 5 * 60 * 1000,
  });
  const { data: myExams = [] } = useQuery({
    queryKey: ['my-exams'],
    queryFn:  examsApi.myExams,
    enabled:  open,
  });

  const enrolledIds = new Set(myExams.map((e) => e.examId));

  const switchMutation = useMutation({
    mutationFn: async (examId: string) => {
      if (!enrolledIds.has(examId)) {
        await examsApi.enrol(examId);
      }
      return examsApi.setPrimary(examId);
    },
    onSuccess: () => { toast.success('Target exam updated'); onSwitched(); },
    onError:   () => { toast.error('Failed to switch exam'); },
  });

  return (
    <Modal
      open={open}
      onClose={() => onOpenChange(false)}
      title="Target exam"
      description="Choose the exam you're preparing for. Practice and progress will reflect this."
    >
      <div className="space-y-2">
          {examsLoading && (
            <div className="text-center py-6 text-[13px] text-ink-muted dark:text-ink-muted-dark">Loading…</div>
          )}
          {!examsLoading && allExams.length === 0 && (
            <div className="text-center py-6 text-[13px] text-ink-muted dark:text-ink-muted-dark">No exams available.</div>
          )}
          {allExams.map((ex) => {
            const isCurrent = ex.code === currentCode;
            const isEnrolled = enrolledIds.has(ex.id);
            return (
              <button
                key={ex.id}
                onClick={() => !isCurrent && switchMutation.mutate(ex.id)}
                disabled={isCurrent || switchMutation.isPending}
                className={cn(
                  'w-full text-left p-3 rounded-lg border transition-colors flex items-center gap-3',
                  isCurrent
                    ? 'border-accent bg-accent-soft/60 dark:bg-[#2A1B14]/60'
                    : 'border-line dark:border-line-dark hover:border-ink/30 dark:hover:border-ink-dark/30',
                )}
              >
                <div className="flex-1 min-w-0">
                  <div className="text-[14px] font-semibold text-ink dark:text-ink-dark">{ex.label}</div>
                  <div className="text-[12px] text-ink-muted dark:text-ink-muted-dark">
                    <span className="font-mono">{ex.code.toUpperCase()}</span>
                    {isEnrolled && !isCurrent && <span> · Enrolled</span>}
                  </div>
                </div>
                {isCurrent && <Check size={18} className="text-accent shrink-0" />}
              </button>
            );
          })}
      </div>
    </Modal>
  );
}
