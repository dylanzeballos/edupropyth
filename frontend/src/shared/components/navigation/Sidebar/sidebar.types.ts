import { LucideIcon } from 'lucide-react';
import { Permission } from '@/shared/utils/permissions';

export interface SidebarItem {
  id: string;
  label: string;
  icon: LucideIcon;
  badge?: number;
  path: string;
  matchPaths?: string[];
  permission?: Permission;
  permissions?: Permission[];
}

export interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  isMobile: boolean;
}

export interface SidebarNavItemProps {
  item: SidebarItem;
  isActive: boolean;
  isCollapsed: boolean;
  onClose: () => void;
  isMobile: boolean;
}

export interface SidebarLogoProps {
  isCollapsed: boolean;
  isMobile: boolean;
  onToggleCollapse: () => void;
}

export interface SidebarUserSectionProps {
  isCollapsed: boolean;
  onLogout: () => void;
  userInitials: string;
  userDisplayName: string;
  userRole: string;
}
