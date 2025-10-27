import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen,
  Trophy,
  BarChart3,
  Settings,
  User,
  LogOut,
  Home,
  FileText,
  Code2,
  ChevronLeft,
  ChevronRight,
  Flame,
  Users,
} from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router';
import { ThemeToggle } from '../ui/ThemeToggle';
import { useAuthStore } from '@/features/auth';
import { canEditCourse } from '@/shared/utils/permissions';

interface SidebarItem {
  id: string;
  label: string;
  icon: any;
  badge?: number;
  path: string;
  requiresPermission?: boolean;
}

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

const mainItems: SidebarItem[] = [
  { id: 'dashboard', label: 'Tablero', icon: Home, path: '/dashboard' },
  {
    id: 'topics',
    label: 'Topicos',
    icon: BookOpen,
    badge: 25,
    path: '/topics',
  },
  { id: 'editor', label: 'Editor de Código', icon: Code2, path: '/editor' },
  { id: 'progress', label: 'Progreso', icon: BarChart3, path: '/progress' },
];

const toolItems: SidebarItem[] = [
  {
    id: 'leaderboard',
    label: 'Clasificación',
    icon: Trophy,
    path: '/leaderboard',
  },
  {
    id: 'documentation',
    label: 'Documentación',
    icon: FileText,
    path: '/documentation',
  },
  { id: 'settings', label: 'Configuración', icon: Settings, path: '/settings' },
];

export const Sidebar = ({
  isOpen,
  onClose,
  isCollapsed,
  onToggleCollapse,
}: SidebarProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(false);
  const { user, clearAuth } = useAuthStore();

  const hasEditPermissions = canEditCourse(user);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const isActive = (path: string) => location.pathname === path;

  const sidebarWidth = isCollapsed ? 80 : 256;

  const handleLogout = () => {
    clearAuth();
    navigate('/login');
    if (isMobile) onClose();
  };

  const filteredToolItems = toolItems.filter((item) => {
    if (item.requiresPermission) {
      return hasEditPermissions;
    }
    return true;
  });

  const getUserInitials = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`;
    }
    if (user?.email) {
      return user.email.slice(0, 2).toUpperCase();
    }
    return 'U';
  };

  const getUserDisplayName = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    if (user?.email) {
      return user.email;
    }
    return 'User';
  };

  return (
    <>
      <AnimatePresence>
        {isMobile && isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      <motion.aside
        initial={false}
        animate={{
          x: isMobile && !isOpen ? -sidebarWidth : 0,
          width: sidebarWidth,
        }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className={`fixed left-0 top-0 h-screen bg-white/50 dark:bg-gray-900/50 backdrop-blur-xl border-r border-gray-200/50 dark:border-gray-700/30 flex flex-col z-50`}
      >
        <div className="relative p-6 border-b border-gray-200/50 dark:border-gray-700/30">
          <AnimatePresence mode="wait">
            {!isCollapsed ? (
              <motion.div
                key="expanded"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="flex items-center gap-3"
              >
                <div className="w-10 h-10 bg-gradient-to-br from-green-400 via-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Code2 className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h1 className="text-lg font-bold text-gray-900 dark:text-white">
                    Python Lab
                  </h1>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    Código • Aprende • Crece
                  </p>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="collapsed"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="flex justify-center"
              >
                <div className="w-10 h-10 bg-gradient-to-br from-green-400 via-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Code2 className="w-6 h-6 text-white" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {!isMobile && (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onToggleCollapse}
              className="absolute -right-3 top-8 w-6 h-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full flex items-center justify-center shadow-md hover:shadow-lg transition-shadow"
            >
              {isCollapsed ? (
                <ChevronRight className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              ) : (
                <ChevronLeft className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              )}
            </motion.button>
          )}
        </div>

        <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 space-y-8 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700 scrollbar-track-transparent">
          <div>
            {!isCollapsed && (
              <h2 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3 px-2">
                Principal
              </h2>
            )}
            <nav className="space-y-1">
              {mainItems.map((item) => {
                const isItemActive = isActive(item.path);
                return (
                  <Link
                    key={item.id}
                    to={item.path}
                    onClick={() => isMobile && onClose()}
                  >
                    <motion.div
                      whileHover={{ x: isCollapsed ? 0 : 4, scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 cursor-pointer ${
                        isItemActive
                          ? 'bg-gradient-to-r from-blue-500 to-cyan-600 text-white shadow-lg shadow-blue-500/25'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100/50 dark:hover:bg-gray-800/50'
                      }`}
                      title={isCollapsed ? item.label : undefined}
                    >
                      <item.icon
                        className={`flex-shrink-0 ${isCollapsed ? 'w-6 h-6' : 'w-5 h-5'} ${isItemActive ? 'text-white' : 'text-gray-500 dark:text-gray-400'}`}
                      />
                      {!isCollapsed && (
                        <>
                          <span className="font-medium text-sm flex-1 truncate">
                            {item.label}
                          </span>
                          {item.badge && (
                            <span
                              className={`px-2 py-1 text-xs font-medium rounded-full ${
                                isItemActive
                                  ? 'bg-white/20 text-white'
                                  : 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                              }`}
                            >
                              {item.badge}
                            </span>
                          )}
                        </>
                      )}
                    </motion.div>
                  </Link>
                );
              })}
            </nav>
          </div>

          <div>
            {!isCollapsed && (
              <h2 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3 px-2">
                Herramientas
              </h2>
            )}
            <nav className="space-y-1">
              {toolItems.map((item) => {
                const isItemActive = isActive(item.path);
                return (
                  <Link
                    key={item.id}
                    to={item.path}
                    onClick={() => isMobile && onClose()}
                  >
                    <motion.div
                      whileHover={{ x: isCollapsed ? 0 : 4, scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 cursor-pointer ${
                        isItemActive
                          ? 'bg-gradient-to-r from-blue-500 to-cyan-600 text-white shadow-lg shadow-blue-500/25'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100/50 dark:hover:bg-gray-800/50'
                      }`}
                      title={isCollapsed ? item.label : undefined}
                    >
                      <item.icon
                        className={`flex-shrink-0 ${isCollapsed ? 'w-6 h-6' : 'w-5 h-5'} ${isItemActive ? 'text-white' : 'text-gray-500 dark:text-gray-400'}`}
                      />
                      {!isCollapsed && (
                        <span className="font-medium text-sm truncate">
                          {item.label}
                        </span>
                      )}
                    </motion.div>
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>

        <div className="p-4 border-t border-gray-200/50 dark:border-gray-700/30 space-y-3">
          {!isCollapsed ? (
            <>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center flex-shrink-0">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {getUserInitials()}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                    340 pts
                    <span className="flex items-center gap-1 ml-1">
                      <Flame className="w-3 h-3 text-orange-500" />3
                    </span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex-1 p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 transition-colors flex items-center justify-center gap-2"
                  title="Cerrar Sesión"
                  onClick={handleLogout}
                >
                  <LogOut className="w-4 h-4" />
                  <span className="text-sm font-medium">Cerrar Sesión</span>
                </motion.button>

                <ThemeToggle />
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                title="Cerrar Sesión"
                onClick={handleLogout}
              >
                <LogOut className="w-4 h-4" />
              </motion.button>
              <ThemeToggle />
            </div>
          )}
        </div>
      </motion.aside>
    </>
  );
};
