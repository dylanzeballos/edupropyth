import { motion } from 'framer-motion';
import { Users as UsersIcon, RefreshCw } from 'lucide-react';
import { useUsers } from '../hooks/useUsers';
import { useUserStats } from '../hooks/useUserStats';
import { UserTable } from '../components/UserTable';
import { UserStatsCards } from '../components/UserStatsCards';
import { useAuthStore } from '@/features/auth';
import { Button } from '@/shared/components/ui/Button';
import { UserRole } from '@/features/auth/types/user.type';

export const UsersManagementPage = () => {
  const { user: currentUser } = useAuthStore();
  const {
    users,
    isLoading: isLoadingUsers,
    refetch,
    updateRole,
    updateStatus,
  } = useUsers();
  const { stats, isLoading: isLoadingStats } = useUserStats();

  const handleUpdateRole = (userId: string, role: UserRole) => {
    updateRole({ userId, role });
  };

  const handleToggleStatus = (userId: string, isActive: boolean) => {
    updateStatus({ userId, isActive });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            <UsersIcon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Gestión de Usuarios
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Administra roles y permisos de usuarios
            </p>
          </div>
        </div>
        <Button
          onClick={() => refetch()}
          variant="outline"
          disabled={isLoadingUsers}
          className="flex items-center gap-2"
        >
          <RefreshCw
            className={`w-4 h-4 ${isLoadingUsers ? 'animate-spin' : ''}`}
          />
          Actualizar
        </Button>
      </div>

      {/* Stats Cards */}
      <UserStatsCards stats={stats} isLoading={isLoadingStats} />

      {/* Users Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
      >
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            Lista de Usuarios
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            {users?.length || 0} usuarios registrados
          </p>
        </div>

        {isLoadingUsers ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
          </div>
        ) : users && users.length > 0 ? (
          <UserTable
            users={users}
            onUpdateRole={handleUpdateRole}
            onToggleStatus={handleToggleStatus}
            currentUserId={currentUser?.id || ''}
          />
        ) : (
          <div className="text-center py-12">
            <UsersIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400">
              No hay usuarios registrados
            </p>
          </div>
        )}
      </motion.div>
    </div>
  );
};
