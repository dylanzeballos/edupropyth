import { useLocation, useNavigate } from 'react-router';
import { useAuthStore } from '@/features/auth';
import { usePermissions } from '@/features/auth';
import { getRoleDisplayName } from '@/features/auth/types/user.type';
import { SidebarItem } from './sidebar.types';
import { allMainItems, allToolItems } from './sidebarItems';

export const useSidebarLogic = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, clearAuth } = useAuthStore();
  const { hasPermission } = usePermissions();

  // Filter items based on permissions
  const mainItems = allMainItems.filter((item) => {
    if (item.permissions) {
      return item.permissions.some((p) => hasPermission(p));
    }
    return !item.permission || hasPermission(item.permission);
  });

  const toolItems = allToolItems.filter((item) => {
    if (item.permissions) {
      return item.permissions.some((p) => hasPermission(p));
    }
    return !item.permission || hasPermission(item.permission);
  });

  // Check if a sidebar item is active
  const isActive = (item: SidebarItem) => {
    const currentPath = location.pathname;

    if (currentPath === item.path) {
      return true;
    }

    if (item.matchPaths) {
      return item.matchPaths.some((pattern) => {
        if (pattern === '/courses/') {
          return (
            currentPath.includes('/courses/') &&
            currentPath.includes('/topics') &&
            !currentPath.includes('/template')
          );
        }

        if (pattern === '/topics') {
          return currentPath.includes('/topics');
        }

        if (pattern === '/template') {
          return currentPath.includes('/template');
        }

        if (pattern === '/courses/[^/]+$') {
          return (
            currentPath.match(/^\/courses\/[^/]+$/) !== null &&
            !currentPath.includes('/topics') &&
            !currentPath.includes('/template')
          );
        }

        if (pattern.endsWith('/')) {
          return currentPath.startsWith(pattern);
        }

        return currentPath.includes(pattern);
      });
    }

    return false;
  };

  // Handle logout
  const handleLogout = () => {
    clearAuth();
    navigate('/login');
  };

  // Get user initials
  const getUserInitials = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`;
    }
    if (user?.email) {
      return user.email.slice(0, 2).toUpperCase();
    }
    return 'U';
  };

  // Get user display name
  const getUserDisplayName = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    if (user?.email) {
      return user.email;
    }
    return 'Usuario';
  };

  // Get user role
  const getUserRole = () => {
    if (user?.role) {
      return getRoleDisplayName(user.role);
    }
    return 'Usuario';
  };

  return {
    mainItems,
    toolItems,
    isActive,
    handleLogout,
    getUserInitials,
    getUserDisplayName,
    getUserRole,
  };
};
