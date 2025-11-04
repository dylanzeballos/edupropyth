import type { User } from '@/features/auth/types/user.type'
import { UserRole } from '@/features/auth/types/user.type'

/** Valores de permisos (valor en runtime) */
export const PERMISSION = {
  // Course permissions
  VIEW_COURSES: 'view_courses',
  CREATE_COURSE: 'create_course',
  EDIT_COURSE: 'edit_course',
  DELETE_COURSE: 'delete_course',
  EXECUTE_COURSE: 'execute_course',

  // User management
  VIEW_USERS: 'view_users',
  MANAGE_USERS: 'manage_users',

  // Content permissions
  VIEW_TOPICS: 'view_topics',
  EDIT_TOPICS: 'edit_topics',

  // Progress and stats
  VIEW_OWN_PROGRESS: 'view_own_progress',
  VIEW_ALL_PROGRESS: 'view_all_progress',

  // Settings
  VIEW_SETTINGS: 'view_settings',
  EDIT_SYSTEM_SETTINGS: 'edit_system_settings',
} as const

/** Tipo unión de los valores anteriores (tipo en compile-time) */
export type Permission = typeof PERMISSION[keyof typeof PERMISSION]

/** Mapa de permisos por rol */
const rolePermissions: Record<UserRole, Permission[]> = {
  [UserRole.ADMIN]: [
    PERMISSION.VIEW_COURSES,
    PERMISSION.CREATE_COURSE,
    PERMISSION.EDIT_COURSE,
    PERMISSION.DELETE_COURSE,
    PERMISSION.EXECUTE_COURSE,
    PERMISSION.VIEW_USERS,
    PERMISSION.MANAGE_USERS,
    PERMISSION.VIEW_TOPICS,
    PERMISSION.EDIT_TOPICS,
    PERMISSION.VIEW_OWN_PROGRESS,
    PERMISSION.VIEW_ALL_PROGRESS,
    PERMISSION.VIEW_SETTINGS,
    PERMISSION.EDIT_SYSTEM_SETTINGS,
  ],
  [UserRole.TEACHER_EDITOR]: [
    PERMISSION.VIEW_COURSES,
    PERMISSION.CREATE_COURSE,
    PERMISSION.EDIT_COURSE,
    PERMISSION.DELETE_COURSE,
    PERMISSION.EXECUTE_COURSE,
    PERMISSION.VIEW_TOPICS,
    PERMISSION.EDIT_TOPICS,
    PERMISSION.VIEW_OWN_PROGRESS,
    PERMISSION.VIEW_ALL_PROGRESS,
    PERMISSION.VIEW_SETTINGS,
  ],
  [UserRole.TEACHER_EXECUTOR]: [
    PERMISSION.VIEW_COURSES,
    PERMISSION.EXECUTE_COURSE,
    PERMISSION.VIEW_TOPICS,
    PERMISSION.VIEW_OWN_PROGRESS,
    PERMISSION.VIEW_SETTINGS,
  ],
  [UserRole.STUDENT]: [
    PERMISSION.VIEW_COURSES,
    PERMISSION.VIEW_TOPICS,
    PERMISSION.VIEW_OWN_PROGRESS,
    PERMISSION.VIEW_SETTINGS,
  ],
}

/** Permisos efectivos del usuario (seguro) */
export function getUserPermissions(user: User | null | undefined): Permission[] {
  if (!user || !user.role) return []
  return rolePermissions[user.role] ?? []
}

/** ¿Tiene permiso? (permiso opcional = no se requiere) */
export function hasPermission(
  user: User | null | undefined,
  permission?: Permission,
): boolean {
  if (!permission) return true
  return getUserPermissions(user).includes(permission)
}

/** ¿Tiene todos los permisos? */
export function hasAllPermissions(
  user: User | null | undefined,
  permissions?: Permission[],
): boolean {
  const list = Array.isArray(permissions) ? permissions : []
  if (list.length === 0) return true
  return list.every((p) => hasPermission(user, p))
}

/** ¿Tiene al menos uno de los permisos? */
export function hasAnyPermission(
  user: User | null | undefined,
  permissions?: Permission[],
): boolean {
  const list = Array.isArray(permissions) ? permissions : []
  if (list.length === 0) return true
  return list.some((p) => hasPermission(user, p))
}

/** Roles */
export function hasRole(user: User | null | undefined, role: UserRole): boolean {
  return !!user && user.role === role
}

export function hasAnyRole(
  user: User | null | undefined,
  roles?: UserRole[],
): boolean {
  const list = Array.isArray(roles) ? roles : []
  if (!user) return false
  return list.includes(user.role)
}

/** Helpers derivados */
export const canEditCourse = (user: User | null | undefined) =>
  hasPermission(user, PERMISSION.EDIT_COURSE)

export const canCreateCourse = (user: User | null | undefined) =>
  hasPermission(user, PERMISSION.CREATE_COURSE)

export const canDeleteCourse = (user: User | null | undefined) =>
  hasPermission(user, PERMISSION.DELETE_COURSE)

export const canExecuteCourse = (user: User | null | undefined) =>
  hasPermission(user, PERMISSION.EXECUTE_COURSE)

export const canViewAllProgress = (user: User | null | undefined) =>
  hasPermission(user, PERMISSION.VIEW_ALL_PROGRESS)

export const canManageUsers = (user: User | null | undefined) =>
  hasPermission(user, PERMISSION.MANAGE_USERS)

export const isAdmin = (user: User | null | undefined) =>
  hasRole(user, UserRole.ADMIN)

export const isTeacher = (user: User | null | undefined) =>
  hasAnyRole(user, [UserRole.TEACHER_EDITOR, UserRole.TEACHER_EXECUTOR])

export const isStudent = (user: User | null | undefined) =>
  hasRole(user, UserRole.STUDENT)
