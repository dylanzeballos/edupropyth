import { Navigate, useLocation } from 'react-router';
import { useAuthStore } from '../stores/auth.store';

interface ProtectedRoutesProps {
  children: React.ReactNode;
}

export const ProtectedRoutes = ({ children }: ProtectedRoutesProps) => {
  const { isAuthenticated, isLoading } = useAuthStore();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoutes;
