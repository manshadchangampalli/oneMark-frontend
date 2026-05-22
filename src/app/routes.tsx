import { createBrowserRouter, Navigate, Outlet, useRouteError } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { AppLayout } from './layouts/AppLayout';
import { ROUTES } from '@/constants/routes';
import { useAuthStore } from '@/store/useAuthStore';

function ProtectedRoute() {
  const isAuthenticated = useAuthStore(s => s.isAuthenticated);
  return isAuthenticated ? <Outlet /> : <Navigate to={ROUTES.AUTH} replace />;
}

function PublicRoute() {
  const isAuthenticated = useAuthStore(s => s.isAuthenticated);
  return isAuthenticated ? <Navigate to={ROUTES.HOME} replace /> : <Outlet />;
}

// Reloads the page when a lazy chunk fails to load (stale deployment).
function lazyWithReload<T extends React.ComponentType<any>>(
  factory: () => Promise<{ default: T }>,
) {
  return lazy(() =>
    factory().catch(() => {
      window.location.reload();
      return new Promise<{ default: T }>(() => {});
    }),
  );
}

const Home            = lazyWithReload(() => import('@/screens/home/Home'));
const Practice        = lazyWithReload(() => import('@/screens/practice/Practice'));
const PracticeSession = lazyWithReload(() => import('@/screens/practice/PracticeSession'));
const PracticeHistory = lazyWithReload(() => import('@/screens/practice/History'));
const Question        = lazyWithReload(() => import('@/screens/question/Question'));
const Progress = lazyWithReload(() => import('@/screens/progress/Progress'));
const Profile  = lazyWithReload(() => import('@/screens/profile/Profile'));
const Auth     = lazyWithReload(() => import('@/screens/auth/AuthScreen'));

function Loading() {
  return <div className="flex-1 flex items-center justify-center h-full" />;
}

function RouteError() {
  const error = useRouteError() as any;
  const isChunkError =
    error?.message?.includes('MIME type') ||
    error?.message?.includes('Failed to fetch') ||
    error?.message?.includes('dynamically imported module');

  if (isChunkError) {
    window.location.reload();
    return null;
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-3 p-6 text-center">
      <p className="text-[15px] font-medium text-ink dark:text-ink-dark">Something went wrong.</p>
      <button
        onClick={() => window.location.replace('/')}
        className="text-[13px] text-ink-muted underline"
      >
        Go home
      </button>
    </div>
  );
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    errorElement: <RouteError />,
    children: [
      { index: true, element: <Navigate to={ROUTES.HOME} replace /> },
      {
        element: <ProtectedRoute />,
        children: [
          { path: 'today',    element: <Suspense fallback={<Loading />}><Home /></Suspense> },
          { path: 'practice', element: <Suspense fallback={<Loading />}><Practice /></Suspense> },
          { path: 'practice/history', element: <Suspense fallback={<Loading />}><PracticeHistory /></Suspense> },
          { path: 'practice/sessions/:sessionId', element: <Suspense fallback={<Loading />}><PracticeSession /></Suspense> },
          { path: 'question/:id', element: <Suspense fallback={<Loading />}><Question /></Suspense> },
          { path: 'progress', element: <Suspense fallback={<Loading />}><Progress /></Suspense> },
          { path: 'profile',  element: <Suspense fallback={<Loading />}><Profile /></Suspense> },
        ],
      },
    ],
  },
  {
    element: <PublicRoute />,
    errorElement: <RouteError />,
    children: [
      { path: 'auth', element: <Suspense fallback={<Loading />}><Auth /></Suspense> },
    ],
  },
]);
