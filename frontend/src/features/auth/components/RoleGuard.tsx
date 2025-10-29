import { ReactNode } from 'react';
import { Navigate } from 'react-router';
import { useAuthStore } from '../stores/auth.store';
import { UserRole } from '../types/user.type';
import { hasRole, hasAnyRole } from '@/shared/utils/permissions';

interface RoleGuardProps {
  children: ReactNode;
  role?: UserRole;
  roles?: UserRole[];
  fallback?: ReactNode;
  redirectTo?: string;
}

export const RoleGuard = ({
  children,
  role,
  roles,
  fallback,
  redirectTo = '/dashboard',
}: RoleGuardProps) => {
  const { user, isAuthenticated } = useAuthStore();

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  let hasAccess = false;

  if (role) {
    hasAccess = hasRole(user, role);
  } else if (roles) {
    hasAccess = hasAnyRole(user, roles);
  }

  if (!hasAccess) {
    if (fallback) {
      return <>{fallback}</>;
    }
    return <Navigate to={redirectTo} replace />;
  }

  return <>{children}</>;
};
