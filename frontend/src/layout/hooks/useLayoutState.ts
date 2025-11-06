import { useState, useEffect } from 'react';
import {
  LAYOUT_CONSTANTS,
  isMobileViewport,
  getSidebarWidth,
} from '@/shared/constants/layout.constants';

export const useLayoutState = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      const mobile = isMobileViewport();
      setIsMobile(mobile);

      if (mobile) {
        setIsSidebarOpen(false);
      }
    };

    checkMobile();

    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const sidebarWidth = getSidebarWidth(isCollapsed);

  const handleToggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  const handleCloseSidebar = () => {
    setIsSidebarOpen(false);
  };

  const handleToggleCollapse = () => {
    setIsCollapsed((prev) => !prev);
  };

  return {
    isCollapsed,
    isSidebarOpen,
    isMobile,
    sidebarWidth,
    handleToggleSidebar,
    handleCloseSidebar,
    handleToggleCollapse,
    headerHeight: LAYOUT_CONSTANTS.HEADER_HEIGHT,
  };
};
