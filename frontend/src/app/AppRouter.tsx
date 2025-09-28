import { createBrowserRouter } from 'react-router';
import MainLayout from '@/layout/MainLayout';

const AppRouter = createBrowserRouter([
  {
    path: '/',
    Component: MainLayout,
    /* children: [
      {
        index: true,
        lazy: () =>
          import('../features/landing/presentation/pages/LandingPage'),
      },
      {
        path: 'dashboard',
        lazy: () => import('../features/dashboard/presentation/pages/HomePage'),
      },
      {
        path: 'auth',
        children: [
          {
            path: 'login',
            lazy: () => import('../features/auth/presentation/pages/LoginPage'),
          },
          {
            path: 'register',
            lazy: () =>
              import('../features/auth/presentation/pages/RegisterPage'),
          },
        ],
      },
      {
        path: 'courses',
        children: [
          {
            index: true,
            lazy: () =>
              import('../features/courses/presentation/pages/CoursesPage'),
          },
          {
            path: ':id',
            lazy: () =>
              import('../features/courses/presentation/pages/CourseDetailPage'),
          },
        ],
      },
      {
        path: 'profile',
        children: [
          {
            index: true,
            lazy: () =>
              import('../features/users/presentation/pages/ProfilePage'),
          },
          {
            path: 'edit',
            lazy: () =>
              import('../features/users/presentation/pages/EditProfilePage'),
          },
        ],
      },
    ], */
  },
]);

export default AppRouter;
