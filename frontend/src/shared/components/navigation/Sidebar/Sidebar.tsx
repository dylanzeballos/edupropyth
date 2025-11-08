import { motion, AnimatePresence } from 'framer-motion';
import { SidebarProps } from './sidebar.types';
import { useSidebarLogic } from './useSidebarLogic';
import { SidebarLogo } from './SidebarLogo';
import { SidebarNavItem } from './SidebarNavItem';
import { SidebarUserSection } from './SidebarUserSection';
import { getSidebarWidth } from '@/shared/constants/layout.constants';

export const Sidebar = ({
  isOpen,
  onClose,
  isCollapsed,
  onToggleCollapse,
  isMobile,
}: SidebarProps) => {
  const {
    mainItems,
    toolItems,
    isActive,
    handleLogout,
    getUserInitials,
    getUserDisplayName,
    getUserRole,
  } = useSidebarLogic();

  const sidebarWidth = getSidebarWidth(isCollapsed);

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
        className="fixed left-0 top-0 h-screen bg-white/50 dark:bg-gray-900/50 backdrop-blur-xl border-r border-gray-200/50 dark:border-gray-700/30 flex flex-col z-50"
      >
        <SidebarLogo
          isCollapsed={isCollapsed}
          isMobile={isMobile}
          onToggleCollapse={onToggleCollapse}
        />

        <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 space-y-8 scrollbar-none">
          <div>
            {!isCollapsed && (
              <h2 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3 px-2">
                Principal
              </h2>
            )}
            <nav className="space-y-1">
              {mainItems.map((item) => (
                <SidebarNavItem
                  key={item.id}
                  item={item}
                  isActive={isActive(item)}
                  isCollapsed={isCollapsed}
                  onClose={onClose}
                  isMobile={isMobile}
                />
              ))}
            </nav>
          </div>

          {toolItems.length > 0 && (
            <div>
              {!isCollapsed && (
                <h2 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3 px-2">
                  Herramientas
                </h2>
              )}
              <nav className="space-y-1">
                {toolItems.map((item) => (
                  <SidebarNavItem
                    key={item.id}
                    item={item}
                    isActive={isActive(item)}
                    isCollapsed={isCollapsed}
                    onClose={onClose}
                    isMobile={isMobile}
                  />
                ))}
              </nav>
            </div>
          )}
        </div>

        <SidebarUserSection
          isCollapsed={isCollapsed}
          onLogout={handleLogout}
          userInitials={getUserInitials()}
          userDisplayName={getUserDisplayName()}
          userRole={getUserRole()}
        />
      </motion.aside>
    </>
  );
};
