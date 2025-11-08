import { motion, AnimatePresence } from 'framer-motion';
import { Code2, ChevronLeft, ChevronRight } from 'lucide-react';
import { SidebarLogoProps } from './sidebar.types';

export const SidebarLogo = ({
  isCollapsed,
  isMobile,
  onToggleCollapse,
}: SidebarLogoProps) => {
  return (
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
            <div className="w-10 h-10 bg-gradient-to-br from-blue-400 via-blue-500 to-cyan-600 rounded-xl flex items-center justify-center shadow-lg">
              <Code2 className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-lg font-bold text-gray-900 dark:text-white">
                EduProPyth
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                Plataforma Educativa
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
            <div className="w-10 h-10 bg-gradient-to-br from-blue-400 via-blue-500 to-cyan-600 rounded-xl flex items-center justify-center shadow-lg">
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
  );
};
