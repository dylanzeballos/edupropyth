export const UserRole = {
  ADMIN: 'admin',
  TEACHER_EXECUTOR: 'teacher_executor',
  TEACHER_EDITOR: 'teacher_editor',
  STUDENT: 'student',
} as const;

export type UserRole = (typeof UserRole)[keyof typeof UserRole];

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export const getRoleDisplayName = (role: UserRole): string => {
  const roleNames: Record<UserRole, string> = {
    [UserRole.ADMIN]: 'Administrador',
    [UserRole.TEACHER_EDITOR]: 'Profesor Editor',
    [UserRole.TEACHER_EXECUTOR]: 'Profesor Ejecutor',
    [UserRole.STUDENT]: 'Estudiante',
  };
  return roleNames[role];
};

export const getUserFullName = (user: User): string => {
  return `${user.firstName} ${user.lastName}`.trim();
};

export const getUserInitials = (user: User): string => {
  const firstInitial = user.firstName?.charAt(0)?.toUpperCase() || '';
  const lastInitial = user.lastName?.charAt(0)?.toUpperCase() || '';
  return (
    `${firstInitial}${lastInitial}` || user.email.slice(0, 2).toUpperCase()
  );
};
