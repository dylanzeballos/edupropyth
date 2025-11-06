import { useAuthStore } from '../../auth/stores/auth.store';
import { UserRole } from '@/features/auth/types/user.type';

export const useCoursePermissions = () => {
  const { user } = useAuthStore();

  const isAdmin = user?.role === UserRole.ADMIN;
  const isTeacherEditor = user?.role === UserRole.TEACHER_EDITOR;
  const isTeacherExecutor = user?.role === UserRole.TEACHER_EXECUTOR;
  const isTeacher = isTeacherEditor || isTeacherExecutor;

  // EDITOR can edit course structure
  const canEditCourseStructure = isAdmin || isTeacherEditor;

  // EXECUTOR can add content (resources/activities) but not edit structure
  const canManageContent = isAdmin || isTeacherEditor || isTeacherExecutor;

  return {
    // Permisos de estructura del curso
    canCreateCourse: isAdmin || isTeacherEditor,
    canDeleteCourse: isAdmin,
    canEditCourse: canEditCourseStructure,
    canConfigureTemplate: canEditCourseStructure,

    // Permisos de contenido
    canCreateTopics: canEditCourseStructure,
    canEditTopics: canEditCourseStructure,
    canDeleteTopics: canEditCourseStructure,
    canAddResources: canManageContent, // EXECUTOR can add resources
    canEditResources: canManageContent,
    canDeleteResources: canManageContent,
    canAddActivities: canManageContent, // EXECUTOR can add activities
    canEditActivities: canManageContent,
    canDeleteActivities: canManageContent,

    // Permisos de visualización
    canViewProgress: isAdmin || isTeacher,
    canViewCourseManagement: canManageContent,

    // Estados de usuario
    isAdmin,
    isTeacherEditor,
    isTeacherExecutor,
    isTeacher,
    canEdit: canEditCourseStructure,
  };
};
