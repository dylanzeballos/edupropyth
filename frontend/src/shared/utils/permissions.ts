import { User } from '@/features/auth/types/user.type';

export const canEditCourse = (user: User | null): boolean => {
  if (!user) return false;
  return user.userType === 'Profesor' || user.userType === 'Admin';
};

export const isAdmin = (user: User | null): boolean => {
  if (!user) return false;
  return user.userType === 'Admin';
};

export const isProfesor = (user: User | null): boolean => {
  if (!user) return false;
  return user.userType === 'Profesor';
};

export const isEstudiante = (user: User | null): boolean => {
  if (!user) return false;
  return user.userType === 'Estudiante';
};

export const canViewStudents = (user: User | null): boolean => {
  return canEditCourse(user);
};

export const canCreateContent = (user: User | null): boolean => {
  return canEditCourse(user);
};

export const canDeleteContent = (user: User | null): boolean => {
  return isAdmin(user);
};
