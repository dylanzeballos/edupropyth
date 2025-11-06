import { Outlet } from 'react-router';
import { Sidebar } from '@/shared/components/navigation/Sidebar';
import { Header } from '@/shared/components/navigation/Header';
import { useLayoutState } from './hooks/useLayoutState';

export const AppLayout = () => {
  const {
    isCollapsed,
    isSidebarOpen,
    isMobile,
    sidebarWidth,
    headerHeight,
    handleToggleSidebar,
    handleCloseSidebar,
    handleToggleCollapse,
  } = useLayoutState();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 dark:from-gray-900 dark:to-blue-900/10 transition-colors duration-300">
      {/* Sidebar */}
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={handleCloseSidebar}
        isCollapsed={isCollapsed}
        onToggleCollapse={handleToggleCollapse}
        isMobile={isMobile}
      />

      {/* Header */}
      <Header
        sidebarWidth={sidebarWidth}
        userName="Python"
        onMenuClick={handleToggleSidebar}
        isMobile={isMobile}
      />

      {/* Main Content */}
      <main
        style={{
          marginLeft: isMobile ? 0 : `${sidebarWidth}px`,
          marginTop: `${headerHeight}px`,
        }}
        className="min-h-[calc(100vh-64px)] p-4 md:p-6 transition-all duration-300"
      >
        <Outlet />
      </main>
    </div>
  );
};

export default AppLayout;
