import { createBrowserRouter, RouterProvider } from 'react-router';
import AppLayout from '@/layout/AppLayout';
import { SignInPage } from '@/features/auth/pages/SignInPage';
import { SignUpPage } from '@/features/auth/pages/SignUpPage';
import { GoogleCallbackPage } from '@/features/auth/pages/GoogleCallbackPage';
import { ProtectedRoutes } from '@/features/auth/components/ProtectedRoutes';
import { PublicOnlyRoutes } from '@/features/auth/components/PublicOnlyRoutes';
import GitHubCallbackPage from '@/features/auth/pages/GitHubCallbackPage';
import MicrosoftCallbackPage from '@/features/auth/pages/MicrosoftCallbackPage';
import { NotFoundPage } from '@/shared/pages/NotFoundPage';

const AppRouter = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      {
        index: true,
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
    path: '/auth/github/callback',
    element: <GitHubCallbackPage />,
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
