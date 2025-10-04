import { createBrowserRouter, RouterProvider } from 'react-router';
import MainLayout from '@/layout/MainLayout';
import { SignInPage } from '@/features/auth/pages/SignInPage';
import { SignUpPage } from '@/features/auth/pages/SignUpPage';

const AppRouter = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
  },
  {
    path: 'login',
    element: <SignInPage />,
  },
  {
    path: 'register',
    element: <SignUpPage />
  },
]);

export const AppRouterProvider = () => {
  return <RouterProvider router={AppRouter} />;
};

export default AppRouter;


