import { useAuthStore } from '../../auth/stores/auth.store';
import { UserRole } from '@/features/auth/types/user.type';
import type { CourseStatus } from '../types/course.types';

interface UseCoursePermissionsOptions {
  courseStatus?: CourseStatus;
}

export const useCoursePermissions = (
  options?: UseCoursePermissionsOptions,
) => {
  const { user } = useAuthStore();
  const courseStatus = options?.courseStatus;

  const isAdmin = user?.role === UserRole.ADMIN;
  const isTeacherEditor = user?.role === UserRole.TEACHER_EDITOR;
  const isTeacherExecutor = user?.role === UserRole.TEACHER_EXECUTOR;
  const isTeacher = isTeacherEditor || isTeacherExecutor;

  const isHistoric = courseStatus === 'historic';

  const canEditCourseStructure = !isHistoric && (isAdmin || isTeacherEditor);

  const canManageContent =
    !isHistoric && (isAdmin || isTeacherEditor || isTeacherExecutor);

  const canManageGroups = !isHistoric && (isAdmin || isTeacherEditor);

  return {
    canCreateCourse: isAdmin || isTeacherEditor,
    canDeleteCourse: isAdmin,
    canEditCourse: canEditCourseStructure,
    canConfigureTemplate: canEditCourseStructure,
    canCreateTopics: canEditCourseStructure,
    canEditTopics: canEditCourseStructure,
    canDeleteTopics: canEditCourseStructure,
    canAddResources: canManageContent, 
    canEditResources: canManageContent,
    canDeleteResources: canManageContent,
    canAddActivities: canManageContent,
    canEditActivities: canManageContent,
    canDeleteActivities: canManageContent,
    canViewProgress: isAdmin || isTeacher,
    canViewCourseManagement: canManageContent,
    canManageGroups,
    isAdmin,
    isTeacherEditor,
    isTeacherExecutor,
    isTeacher,
    canEdit: canEditCourseStructure,
    isHistoric,
  };
};
