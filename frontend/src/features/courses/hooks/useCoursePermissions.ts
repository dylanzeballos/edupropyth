import { useAuthStore } from '../../auth/stores/auth.store';

export const useCoursePermissions = () => {
  const { user } = useAuthStore();

  const isAdmin = user?.role === 'admin';
  const isTeacherEditor = user?.role === 'teacher_editor';
  const canEdit = isAdmin || isTeacherEditor;

  return {
    // Permisos para cursos
    canCreateCourse: isAdmin,
    canDeleteCourse: isAdmin,
    canEditCourse: canEdit,

    // Estados de usuario
    isAdmin,
    isTeacherEditor,
    canEdit,
  };
};
