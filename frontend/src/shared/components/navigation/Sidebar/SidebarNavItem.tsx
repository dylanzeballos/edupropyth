import { motion } from 'framer-motion';
import { Link } from 'react-router';
import { SidebarNavItemProps } from './sidebar.types';

export const SidebarNavItem = ({
  item,
  isActive,
  isCollapsed,
  onClose,
  isMobile,
}: SidebarNavItemProps) => {
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
          isActive
            ? 'bg-gradient-to-r from-blue-500 to-cyan-600 text-white shadow-lg shadow-blue-500/25'
            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100/50 dark:hover:bg-gray-800/50'
        }`}
        title={isCollapsed ? item.label : undefined}
      >
        <item.icon
          className={`flex-shrink-0 ${isCollapsed ? 'w-6 h-6' : 'w-5 h-5'} ${
            isActive ? 'text-white' : 'text-gray-500 dark:text-gray-400'
          }`}
        />
        {!isCollapsed && (
          <>
            <span className="font-medium text-sm flex-1 truncate">
              {item.label}
            </span>
            {item.badge && (
              <span
                className={`px-2 py-1 text-xs font-medium rounded-full ${
                  isActive
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
};
