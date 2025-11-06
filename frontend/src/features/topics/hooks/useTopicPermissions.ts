import { useMemo } from 'react';
import { useAuthStore } from '@/features/auth/stores/auth.store';
import { UserRole } from '@/features/auth/types/user.type';
import type { Course } from '@/features/courses/types/course.types';

interface UseTopicPermissionsProps {
  course?: Course;
}

interface UseTopicPermissionsReturn {
  canEditTemplate: boolean;
  canManageTopics: boolean;
  canViewTopics: boolean;
}

export const useTopicPermissions = ({
  course,
}: UseTopicPermissionsProps): UseTopicPermissionsReturn => {
  const { user } = useAuthStore();

  const permissions = useMemo(() => {
    if (!user || !course) {
      return {
        canEditTemplate: false,
        canManageTopics: false,
        canViewTopics: true,
      };
    }

    const isAdmin = user.role === UserRole.ADMIN;
    const isInstructor = course.instructorId === user.id;

    return {
      canEditTemplate: isAdmin || isInstructor,
      canManageTopics: isAdmin || isInstructor,
      canViewTopics: true,
    };
  }, [user, course]);

  return permissions;
};
