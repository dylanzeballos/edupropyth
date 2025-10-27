import { useState } from 'react';
import { motion } from 'framer-motion';
import { Bell, Menu } from 'lucide-react';
import SearchBar from './Search';
import { useAuthStore } from '@/features/auth';

interface HeaderProps {
  sidebarWidth: number;
  userName?: string;
  onMenuClick: () => void;
  isMobile: boolean;
}

export const Header = ({
  sidebarWidth,
  userName,
  onMenuClick,
  isMobile,
}: HeaderProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [hasNotifications] = useState(false);
  const { user } = useAuthStore();

  const handleSearch = () => {
    setSearchQuery('');
  };

  return (
    <motion.header
      initial={false}
      animate={{ paddingLeft: isMobile ? 0 : sidebarWidth }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="fixed top-0 right-0 left-0 h-16 bg-white/50 dark:bg-gray-900/50 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-700/30 z-40"
    >
      <div className="h-full px-4 md:px-6 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          {isMobile && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onMenuClick}
              className="p-2 rounded-lg bg-gray-100/50 dark:bg-gray-800/50 border border-gray-200/50 dark:border-gray-700/50 backdrop-blur-sm hover:bg-gray-200/50 dark:hover:bg-gray-700/50 transition-colors lg:hidden"
            >
              <Menu className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </motion.button>
          )}

          {isMobile && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-green-400 via-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
                <span className="text-white text-sm font-bold">PL</span>
              </div>
              <span className="text-sm font-bold text-gray-900 dark:text-white">
                Python Lab
              </span>
            </div>
          )}
        </div>

        <div className="flex-1 max-w-2xl hidden md:block">
          <SearchBar
            query={searchQuery}
            onQueryChange={handleSearch}
            placeholder="Buscar ejercicios, tópicos..."
          />
        </div>

        <div className="flex items-center gap-3 md:gap-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative p-2 rounded-lg bg-gray-100/50 dark:bg-gray-800/50 border border-gray-200/50 dark:border-gray-700/50 backdrop-blur-sm hover:bg-gray-200/50 dark:hover:bg-gray-700/50 transition-colors"
          >
            <Bell className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            {hasNotifications && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white dark:ring-gray-900"></span>
            )}
          </motion.button>

          <div className="hidden lg:block text-right">
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              Bienvenido de vuelta,{' '}
              <span className="text-blue-600 dark:text-blue-400">
                {user?.firstName || user?.email || 'Usuario'}!
              </span>
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              ¿Listo para seguir aprendiendo?
            </p>
          </div>
        </div>
      </div>
    </motion.header>
  );
};
