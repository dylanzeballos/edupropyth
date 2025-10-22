import { useState, useEffect } from 'react';
import { Outlet } from 'react-router';
import { ModernSidebar } from '@/shared/components/navigation/ModernSidebar';
import { ModernHeader } from '@/shared/components/navigation/ModernHeader';

export const AppLayout = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (!mobile) {
        setIsSidebarOpen(false);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const sidebarWidth = isCollapsed ? 80 : 256;

  const handleToggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleCloseSidebar = () => {
    setIsSidebarOpen(false);
  };

  const handleToggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 dark:from-gray-900 dark:to-blue-900/10 transition-colors duration-300">
      {/* Sidebar */}
      <ModernSidebar
        isOpen={isSidebarOpen}
        onClose={handleCloseSidebar}
        isCollapsed={isCollapsed}
        onToggleCollapse={handleToggleCollapse}
      />

      {/* Header */}
      <ModernHeader
        sidebarWidth={sidebarWidth}
        userName="Python"
        onMenuClick={handleToggleSidebar}
        isMobile={isMobile}
      />

      {/* Main Content */}
      <main
        style={{
          marginLeft: isMobile ? 0 : `${sidebarWidth}px`,
          marginTop: '64px',
        }}
        className="min-h-[calc(100vh-64px)] p-4 md:p-6 transition-all duration-300"
      >
        <Outlet />
      </main>
    </div>
  );
};

export default AppLayout;
