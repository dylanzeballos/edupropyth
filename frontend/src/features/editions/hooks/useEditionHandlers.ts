import { useMemo } from 'react';
import type { Group } from '@/features/groups/types/group.types';
import type { User } from '@/features/auth/types/user.type';

interface UseEditionHandlersProps {
  user: User | null;
  isHistoric: boolean;
  hasManagePermissions: boolean;
}

export const useEditionHandlers = ({
  user,
  isHistoric,
  hasManagePermissions,
}: UseEditionHandlersProps) => {
  const canUserEditGroup = useMemo(() => {
    return (group: Group): boolean => {
      if (!user || isHistoric) return false;
      if (hasManagePermissions) return true;
      return group.instructorId === user.id;
    };
  }, [user, isHistoric, hasManagePermissions]);

  const canUserDeleteGroup = useMemo(() => {
    return (): boolean => {
      if (isHistoric) return false;
      return hasManagePermissions;
    };
  }, [isHistoric, hasManagePermissions]);

  const hasGroupPermissions = useMemo(() => {
    return (groups?: Group[]): boolean => {
      if (hasManagePermissions) return true;
      if (!groups || groups.length === 0) return false;
      return groups.some(g => canUserEditGroup(g));
    };
  }, [hasManagePermissions, canUserEditGroup]);

  return {
    canUserEditGroup,
    canUserDeleteGroup,
    hasGroupPermissions,
  };
};