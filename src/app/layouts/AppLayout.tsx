import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Sun, LayoutGrid, TrendingUp, User, Play, Zap, Moon, SunIcon } from 'lucide-react';
import { cn } from '@/utils';
import { ROUTES } from '@/constants';
import { Avatar } from '@/components/ui';
import { useAppStore } from '@/store';
import { useAuthStore } from '@/store/useAuthStore';

interface Tab {
  id: string;
  route: string;
  label: string;
  Icon: React.ElementType;
  primary?: boolean;
}

const NAV_TABS: Tab[] = [
  { id: 'today', route: ROUTES.HOME, label: 'Today', Icon: Sun },
  { id: 'practice', route: ROUTES.PRACTICE, label: 'Practice', Icon: LayoutGrid },
  { id: 'progress', route: ROUTES.PROGRESS, label: 'Progress', Icon: TrendingUp },
  { id: 'profile', route: ROUTES.PROFILE, label: 'Profile', Icon: User },
];

const BOTTOM_TABS: Tab[] = [
  { id: 'today', route: ROUTES.HOME, label: 'Today', Icon: Sun },
  { id: 'practice', route: ROUTES.PRACTICE, label: 'Practice', Icon: LayoutGrid },
  { id: 'solve', route: ROUTES.QUESTION, label: 'Solve', Icon: Zap, primary: true },
  { id: 'progress', route: ROUTES.PROGRESS, label: 'Progress', Icon: TrendingUp },
  { id: 'profile', route: ROUTES.PROFILE, label: 'Profile', Icon: User },
];

export function AppLayout() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { isDark, toggleDark } = useAppStore();
  const { user } = useAuthStore();

  // useEffect(() => {
  //   if (!isAuthenticated) {
  //     navigate(ROUTES.AUTH, { replace: true });
  //   }
  // }, [isAuthenticated, navigate]);

  // if (!isAuthenticated) return null;

  const isQuestion = pathname === ROUTES.QUESTION;
  const initial = user?.name?.[0] || 'U';

  return (
    <div className="min-h-screen bg-paper dark:bg-paper-dark text-ink dark:text-ink-dark">

      {/* ── Desktop top navbar ── */}
      <header className="hidden lg:flex sticky top-0 z-20 h-14 items-center border-b border-line dark:border-line-dark bg-paper/95 dark:bg-paper-dark/95 backdrop-blur-sm px-6 gap-6">

        {/* Logo */}
        <button onClick={() => navigate(ROUTES.HOME)} className="shrink-0 flex items-center">
          <img src="/logo.png" alt="oneMark" className="h-7 w-auto object-contain" />
        </button>

        {/* Divider */}
        <div className="h-5 w-px bg-line dark:bg-line-dark" />

        {/* Nav links */}
        <nav className="flex items-center gap-1">
          {NAV_TABS.map((t) => {
            const active = pathname === t.route;
            return (
              <button
                key={t.id}
                onClick={() => navigate(t.route)}
                className={cn(
                  'relative h-14 px-4 text-[13.5px] font-medium transition-colors',
                  active
                    ? 'text-ink dark:text-ink-dark'
                    : 'text-ink-muted dark:text-ink-muted-dark hover:text-ink dark:hover:text-ink-dark'
                )}
              >
                {t.label}
                {/* Active underline */}
                {active && (
                  <span className="absolute bottom-0 left-3 right-3 h-0.5 rounded-full bg-accent" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Right side */}
        <div className="ml-auto flex items-center gap-3">
          {/* Dark mode toggle */}
          <button
            onClick={toggleDark}
            className="w-8 h-8 flex items-center justify-center rounded-md text-ink-muted dark:text-ink-muted-dark hover:text-ink dark:hover:text-ink-dark hover:bg-ink/4 dark:hover:bg-ink-dark/5 transition-colors"
          >
            {isDark ? <SunIcon size={16} /> : <Moon size={16} />}
          </button>

          {/* Daily challenge CTA */}
          <button
            onClick={() => navigate(ROUTES.QUESTION)}
            className="flex items-center gap-1.5 h-8 px-3.5 rounded-lg bg-accent text-white text-[13px] font-medium hover:bg-[#BF4715] transition-colors shadow-[0_2px_10px_rgba(212,84,26,0.25)]"
          >
            <Play size={13} strokeWidth={2.5} />
            Daily challenge
          </button>

          {/* User avatar */}
          <button onClick={() => navigate(ROUTES.PROFILE)}>
            <Avatar initial={initial} tone="accent" size={32} />
          </button>
        </div>
      </header>

      {/* ── Page content ── */}
      <main key={pathname} className="lg:max-w-[1280px] lg:mx-auto lg:px-10 lg:pt-8 pb-24">
        <Outlet />
      </main>

      {/* ── Mobile bottom tab bar ── */}
      {!isQuestion && (
        <nav className="lg:hidden fixed w-full  bottom-0 border-t border-line dark:border-line-dark bg-paper/95 dark:bg-paper-dark/95 backdrop-blur-sm">
          <div className="flex items-stretch px-2 pt-1.5 pb-3">
            {BOTTOM_TABS.map((t) => {
              const active = pathname === t.route;
              if (t.primary) {
                return (
                  <button
                    key={t.id}
                    onClick={() => navigate(t.route)}
                    className="flex-1 flex flex-col items-center justify-center pb-2"
                  >
                    <div className="w-12 h-12 -mt-3 rounded-full bg-accent text-white shadow-[0_6px_18px_rgba(212,84,26,0.35)] flex items-center justify-center">
                      <Play size={18} strokeWidth={2.25} />
                    </div>
                    <span className="text-[10px] mt-0.5 text-ink-muted dark:text-ink-muted-dark font-medium">
                      {t.label}
                    </span>
                  </button>
                );
              }
              return (
                <button
                  key={t.id}
                  onClick={() => navigate(t.route)}
                  className="flex-1 flex flex-col items-center gap-1 py-2 group"
                >
                  <div className={cn('h-6 flex items-center justify-center transition-colors', active ? 'text-accent' : 'text-ink-muted dark:text-ink-muted-dark group-hover:text-ink dark:group-hover:text-ink-dark')}>
                    <t.Icon size={20} strokeWidth={active ? 2.25 : 1.75} />
                  </div>
                  <span className={cn('text-[10.5px] font-medium', active ? 'text-accent' : 'text-ink-muted dark:text-ink-muted-dark')}>
                    {t.label}
                  </span>
                  <div className={cn('w-1 h-1 rounded-full -mt-0.5', active ? 'bg-accent' : 'bg-transparent')} />
                </button>
              );
            })}
          </div>
        </nav>
      )}
    </div>
  );
}
