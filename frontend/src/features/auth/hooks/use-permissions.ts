import { useAuthStore } from '../stores/auth.store';
import {
  Permission,
  hasPermission,
  hasAnyPermission,
  hasAllPermissions,
} from '@/shared/utils/permissions';

export const usePermissions = () => {
  const { user } = useAuthStore();

  return {
    user,
    hasPermission: (permission: Permission) => hasPermission(user, permission),
    hasAnyPermission: (permissions: Permission[]) =>
      hasAnyPermission(user, permissions),
    hasAllPermissions: (permissions: Permission[]) =>
      hasAllPermissions(user, permissions),
  };
};
