import { createBrowserRouter, RouterProvider } from 'react-router';
import MainLayout from '@/layout/MainLayout';
import { SignInPage } from '@/features/auth/pages/SignInPage';
import { SignUpPage } from '@/features/auth/pages/SignUpPage';
import { DashboardPage } from '@/features/auth/pages/DashboardPage';
import { GoogleCallbackPage } from '@/features/auth/pages/GoogleCallbackPage';
import { ProtectedRoutes } from '@/features/auth/components/ProtectedRoutes';
import { PublicOnlyRoutes } from '@/features/auth/components/PublicOnlyRoutes';
import GitHubCallbackPage from '@/features/auth/pages/GitHubCallbackPage';
import MicrosoftCallbackPage from '@/features/auth/pages/MicrosoftCallbackPage';

const AppRouter = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
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
    path: '/dashboard',
    element: (
      <ProtectedRoutes>
        <DashboardPage />
      </ProtectedRoutes>
    ),
  },
  {
    path: '/auth/google/callback',
    element: <GoogleCallbackPage />,
  },
  {
    path: '/auth/github/callback',
    element: <GitHubCallbackPage />,
  },
  {
    path: '/auth/microsoft/callback',
    element: <MicrosoftCallbackPage />,
  },
  // Aquí puedes agregar más rutas protegidas
  // {
  //   path: '/courses',
  //   element: (
  //     <ProtectedRoutes>
  //       <CoursesPage />
  //     </ProtectedRoutes>
  //   ),
  // },
]);

export const AppRouterProvider = () => {
  return <RouterProvider router={AppRouter} />;
};

export default AppRouter;
