import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { AppLayout } from './layouts/AppLayout';
import { ROUTES } from '@/constants';
import { useAuthStore } from '@/store/useAuthStore';

function ProtectedRoute() {
  const isAuthenticated = useAuthStore(s => s.isAuthenticated);
  return isAuthenticated ? <Outlet /> : <Navigate to={ROUTES.AUTH} replace />;
}

function PublicRoute() {
  const isAuthenticated = useAuthStore(s => s.isAuthenticated);
  return isAuthenticated ? <Navigate to={ROUTES.HOME} replace /> : <Outlet />;
}

const Home = lazy(() => import('@/screens/home/Home'));
const Practice = lazy(() => import('@/screens/practice/Practice'));
const Question = lazy(() => import('@/screens/question/Question'));
const Progress = lazy(() => import('@/screens/progress/Progress'));
const Profile = lazy(() => import('@/screens/profile/Profile'));
const Auth = lazy(() => import('@/screens/auth/AuthScreen'));

function Loading() {
  return <div className="flex-1 flex items-center justify-center h-full" />;
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true, element: <Navigate to={ROUTES.HOME} replace /> },
      {
        element: <ProtectedRoute />,
        children: [
          {
            path: 'today',
            element: <Suspense fallback={<Loading />}><Home /></Suspense>,
          },
          {
            path: 'practice',
            element: <Suspense fallback={<Loading />}><Practice /></Suspense>,
          },
          {
            path: 'question',
            element: <Suspense fallback={<Loading />}><Question /></Suspense>,
          },
          {
            path: 'progress',
            element: <Suspense fallback={<Loading />}><Progress /></Suspense>,
          },
          {
            path: 'profile',
            element: <Suspense fallback={<Loading />}><Profile /></Suspense>,
          },
        ],
      },
    ],
  },
  {
    element: <PublicRoute />,
    children: [
      {
        path: 'auth',
        element: <Suspense fallback={<Loading />}><Auth /></Suspense>,
      },
    ],
  },
]);
