import { useAuthStore } from '../stores/auth.store'

// Importa el tipo como type-only (para evitar el error TS2749)
import type { Permission } from '@/shared/utils/permissions'

// Importa los helpers reales
import {
  hasPermission as hasPermissionUtil,
  hasAnyPermission as hasAnyPermissionUtil,
  hasAllPermissions as hasAllPermissionsUtil,
  getUserPermissions,
} from '@/shared/utils/permissions'

export const usePermissions = () => {
  const { user } = useAuthStore()

  return {
    user,
    permissions: getUserPermissions(user),

    // 👇 CAMBIO CLAVE: parámetro opcional (Permission | undefined)
    hasPermission: (permission?: Permission) =>
      hasPermissionUtil(user, permission),

    hasAnyPermission: (permissions?: Permission[]) =>
      hasAnyPermissionUtil(user, permissions),

    hasAllPermissions: (permissions?: Permission[]) =>
      hasAllPermissionsUtil(user, permissions),
  }
}

