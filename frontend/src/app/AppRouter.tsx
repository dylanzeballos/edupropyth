import { createBrowserRouter, RouterProvider, Navigate } from 'react-router';
import AppLayout from '@/layout/AppLayout';
import { SignInPage } from '@/features/auth/pages/SignInPage';
import { SignUpPage } from '@/features/auth/pages/SignUpPage';
import { GoogleCallbackPage } from '@/features/auth/pages/GoogleCallbackPage';
import { ProtectedRoutes } from '@/features/auth/components/ProtectedRoutes';
import { PublicOnlyRoutes } from '@/features/auth/components/PublicOnlyRoutes';
import { RoleGuard } from '@/features/auth';
import MicrosoftCallbackPage from '@/features/auth/pages/MicrosoftCallbackPage';
import { NotFoundPage } from '@/shared/pages/NotFoundPage';
import { UsersManagementPage } from '@/features/users';
import { CoursePage } from '@/features/courses';
import { UserRole } from '@/features/auth/types/user.type';

const AppRouter = createBrowserRouter([
  {
    path: '/',
    element: (
      <ProtectedRoutes>
        <AppLayout />
      </ProtectedRoutes>
    ),
    children: [
      {
        index: true,
        element: <Navigate to="/dashboard" replace />,
      },
      {
        path: 'dashboard',
        element: <div>Dashboard (Por implementar)</div>,
      },
      {
        path: 'users',
        element: (
          <RoleGuard role={UserRole.ADMIN}>
            <UsersManagementPage />
          </RoleGuard>
        ),
      },
      {
        path: 'topics',
        element: <div>Topics (Por implementar)</div>,
      },
      {
        path: 'courses',
        element: <div>Courses (Por implementar)</div>,
      },
      {
        path: 'editor',
        element: <div>Editor (Por implementar)</div>,
      },
      {
        path: 'progress',
        element: <div>Progress (Por implementar)</div>,
      },
      {
        path: 'course-management',
        element: <CoursePage />,
      },
      {
        path: 'all-progress',
        element: (
          <RoleGuard roles={[UserRole.ADMIN, UserRole.TEACHER_EDITOR]}>
            <div>All Progress (Por implementar)</div>
          </RoleGuard>
        ),
      },
      {
        path: 'leaderboard',
        element: <div>Leaderboard (Por implementar)</div>,
      },
      {
        path: 'documentation',
        element: <div>Documentation (Por implementar)</div>,
      },
      {
        path: 'settings',
        element: <div>Settings (Por implementar)</div>,
      },
    ],
  },
  {
    path: '/login',
    element: (
      <PublicOnlyRoutes>
        <SignInPage />
      </PublicOnlyRoutes>
    ),
  },
  {
    path: '/register',
    element: (
      <PublicOnlyRoutes>
        <SignUpPage />
      </PublicOnlyRoutes>
    ),
  },
  {
    path: '/auth/google/callback',
    element: <GoogleCallbackPage />,
  },
  {
    path: '/auth/microsoft/callback',
    element: <MicrosoftCallbackPage />,
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
]);

export const AppRouterProvider = () => {
  return <RouterProvider router={AppRouter} />;
};

export default AppRouter;
