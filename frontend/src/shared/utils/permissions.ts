import { UserRole, User } from '@/features/auth/types/user.type';

export enum Permission {
  // Course permissions
  VIEW_COURSES = 'view_courses',
  CREATE_COURSE = 'create_course',
  EDIT_COURSE = 'edit_course',
  DELETE_COURSE = 'delete_course',
  EXECUTE_COURSE = 'execute_course',

  // User management
  VIEW_USERS = 'view_users',
  MANAGE_USERS = 'manage_users',

  // Content permissions
  VIEW_TOPICS = 'view_topics',
  EDIT_TOPICS = 'edit_topics',

  // Progress and stats
  VIEW_OWN_PROGRESS = 'view_own_progress',
  VIEW_ALL_PROGRESS = 'view_all_progress',

  // Settings
  VIEW_SETTINGS = 'view_settings',
  EDIT_SYSTEM_SETTINGS = 'edit_system_settings',
}

// Mapa de permisos por rol
const rolePermissions: Record<UserRole, Permission[]> = {
  [UserRole.ADMIN]: [
    Permission.VIEW_COURSES,
    Permission.CREATE_COURSE,
    Permission.EDIT_COURSE,
    Permission.DELETE_COURSE,
    Permission.EXECUTE_COURSE,
    Permission.VIEW_USERS,
    Permission.MANAGE_USERS,
    Permission.VIEW_TOPICS,
    Permission.EDIT_TOPICS,
    Permission.VIEW_OWN_PROGRESS,
    Permission.VIEW_ALL_PROGRESS,
    Permission.VIEW_SETTINGS,
    Permission.EDIT_SYSTEM_SETTINGS,
  ],
  [UserRole.TEACHER_EDITOR]: [
    Permission.VIEW_COURSES,
    Permission.CREATE_COURSE,
    Permission.EDIT_COURSE,
    Permission.DELETE_COURSE,
    Permission.EXECUTE_COURSE,
    Permission.VIEW_TOPICS,
    Permission.EDIT_TOPICS,
    Permission.VIEW_OWN_PROGRESS,
    Permission.VIEW_ALL_PROGRESS,
    Permission.VIEW_SETTINGS,
  ],
  [UserRole.TEACHER_EXECUTOR]: [
    Permission.VIEW_COURSES,
    Permission.EXECUTE_COURSE,
    Permission.VIEW_TOPICS,
    Permission.VIEW_OWN_PROGRESS,
    Permission.VIEW_SETTINGS,
  ],
  [UserRole.STUDENT]: [
    Permission.VIEW_COURSES,
    Permission.VIEW_TOPICS,
    Permission.VIEW_OWN_PROGRESS,
    Permission.VIEW_SETTINGS,
  ],
};

/**
 * Verifica si un usuario tiene un permiso específico
 */
export const hasPermission = (
  user: User | null,
  permission: Permission,
): boolean => {
  if (!user) return false;
  const permissions = rolePermissions[user.role];
  return permissions.includes(permission);
};

/**
 * Verifica si un usuario tiene todos los permisos especificados
 */
export const hasAllPermissions = (
  user: User | null,
  permissions: Permission[],
): boolean => {
  if (!user) return false;
  return permissions.every((permission) => hasPermission(user, permission));
};

/**
 * Verifica si un usuario tiene al menos uno de los permisos especificados
 */
export const hasAnyPermission = (
  user: User | null,
  permissions: Permission[],
): boolean => {
  if (!user) return false;
  return permissions.some((permission) => hasPermission(user, permission));
};

/**
 * Verifica si un usuario tiene un rol específico
 */
export const hasRole = (user: User | null, role: UserRole): boolean => {
  if (!user) return false;
  return user.role === role;
};

/**
 * Verifica si un usuario tiene alguno de los roles especificados
 */
export const hasAnyRole = (user: User | null, roles: UserRole[]): boolean => {
  if (!user) return false;
  return roles.includes(user.role);
};

/**
 * Verifica si un usuario puede editar cursos
 */
export const canEditCourse = (user: User | null): boolean => {
  return hasPermission(user, Permission.EDIT_COURSE);
};

/**
 * Verifica si un usuario puede crear cursos
 */
export const canCreateCourse = (user: User | null): boolean => {
  return hasPermission(user, Permission.CREATE_COURSE);
};

/**
 * Verifica si un usuario puede eliminar cursos
 */
export const canDeleteCourse = (user: User | null): boolean => {
  return hasPermission(user, Permission.DELETE_COURSE);
};

/**
 * Verifica si un usuario puede ejecutar código en cursos
 */
export const canExecuteCourse = (user: User | null): boolean => {
  return hasPermission(user, Permission.EXECUTE_COURSE);
};

/**
 * Verifica si un usuario puede ver todos los progresos
 */
export const canViewAllProgress = (user: User | null): boolean => {
  return hasPermission(user, Permission.VIEW_ALL_PROGRESS);
};

/**
 * Verifica si un usuario puede gestionar otros usuarios
 */
export const canManageUsers = (user: User | null): boolean => {
  return hasPermission(user, Permission.MANAGE_USERS);
};

/**
 * Verifica si un usuario es administrador
 */
export const isAdmin = (user: User | null): boolean => {
  return hasRole(user, UserRole.ADMIN);
};

/**
 * Verifica si un usuario es profesor (cualquier tipo)
 */
export const isTeacher = (user: User | null): boolean => {
  return hasAnyRole(user, [UserRole.TEACHER_EDITOR, UserRole.TEACHER_EXECUTOR]);
};

/**
 * Verifica si un usuario es estudiante
 */
export const isStudent = (user: User | null): boolean => {
  return hasRole(user, UserRole.STUDENT);
};
