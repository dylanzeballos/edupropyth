/**
 * Layout Constants
 * Centralized constants for layout dimensions and breakpoints
 */

export const LAYOUT_CONSTANTS = {
  // Sidebar dimensions
  SIDEBAR_WIDTH_EXPANDED: 256,
  SIDEBAR_WIDTH_COLLAPSED: 80,

  // Header dimensions
  HEADER_HEIGHT: 64,

  // Breakpoints
  MOBILE_BREAKPOINT: 1024,
  TABLET_BREAKPOINT: 768,
  DESKTOP_BREAKPOINT: 1280,
} as const;

/**
 * Check if current viewport is mobile
 */
export const isMobileViewport = () =>
  window.innerWidth < LAYOUT_CONSTANTS.MOBILE_BREAKPOINT;

/**
 * Check if current viewport is tablet
 */
export const isTabletViewport = () =>
  window.innerWidth >= LAYOUT_CONSTANTS.TABLET_BREAKPOINT &&
  window.innerWidth < LAYOUT_CONSTANTS.DESKTOP_BREAKPOINT;

/**
 * Check if current viewport is desktop
 */
export const isDesktopViewport = () =>
  window.innerWidth >= LAYOUT_CONSTANTS.DESKTOP_BREAKPOINT;

/**
 * Get sidebar width based on collapsed state
 */
export const getSidebarWidth = (isCollapsed: boolean) =>
  isCollapsed
    ? LAYOUT_CONSTANTS.SIDEBAR_WIDTH_COLLAPSED
    : LAYOUT_CONSTANTS.SIDEBAR_WIDTH_EXPANDED;
