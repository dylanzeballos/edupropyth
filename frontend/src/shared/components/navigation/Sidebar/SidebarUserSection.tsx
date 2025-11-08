import { motion } from 'framer-motion';
import { LogOut } from 'lucide-react';
import { ThemeToggle } from '../../ui/ThemeToggle';
import { SidebarUserSectionProps } from './sidebar.types';

export const SidebarUserSection = ({
  isCollapsed,
  onLogout,
  userInitials,
  userDisplayName,
  userRole,
}: SidebarUserSectionProps) => {
  return (
    <div className="p-4 border-t border-gray-200/50 dark:border-gray-700/30 space-y-3">
      {!isCollapsed ? (
        <>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-sm font-bold text-white">
                {userInitials}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                {userDisplayName}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                {userRole}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex-1 p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 transition-colors flex items-center justify-center gap-2"
              title="Cerrar Sesión"
              onClick={onLogout}
            >
              <LogOut className="w-4 h-4" />
              <span className="text-sm font-medium">Cerrar Sesión</span>
            </motion.button>

            <ThemeToggle />
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full flex items-center justify-center">
            <span className="text-sm font-bold text-white">
              {userInitials}
            </span>
          </div>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 transition-colors"
            title="Cerrar Sesión"
            onClick={onLogout}
          >
            <LogOut className="w-4 h-4" />
          </motion.button>
          <ThemeToggle />
        </div>
      )}
    </div>
  );
};
