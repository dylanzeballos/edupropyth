import {
  BookOpen,
  Trophy,
  BarChart3,
  Settings,
  Home,
  FileText,
  Code2,
  Users,
  Layout,
} from 'lucide-react';
import { Permission } from '@/shared/utils/permissions';
import { SidebarItem } from './sidebar.types';

export const allMainItems: SidebarItem[] = [
  {
    id: 'dashboard',
    label: 'Tablero',
    icon: Home,
    path: '/dashboard',
    permission: Permission.VIEW_COURSES,
  },
  {
    id: 'courses',
    label: 'Cursos',
    icon: BookOpen,
    path: '/my-courses',
    matchPaths: ['/courses/', '/topics'],
    permission: Permission.VIEW_COURSES,
  },
  {
    id: 'editor',
    label: 'Editor de Código',
    icon: Code2,
    path: '/editor',
    permission: Permission.EXECUTE_COURSE,
  },
  {
    id: 'progress',
    label: 'Mi Progreso',
    icon: BarChart3,
    path: '/progress',
    permission: Permission.VIEW_OWN_PROGRESS,
  },
];

export const allToolItems: SidebarItem[] = [
  {
    id: 'course-management',
    label: 'Gestión de Cursos',
    icon: Layout,
    path: '/course-management',
    matchPaths: ['/template', '/management'],
    permissions: [Permission.EDIT_COURSE, Permission.MANAGE_COURSE_CONTENT],
  },
  {
    id: 'users',
    label: 'Usuarios',
    icon: Users,
    path: '/users',
    permission: Permission.MANAGE_USERS,
  },
  {
    id: 'all-progress',
    label: 'Progreso Global',
    icon: BarChart3,
    path: '/all-progress',
    permission: Permission.VIEW_ALL_PROGRESS,
  },
  {
    id: 'leaderboard',
    label: 'Clasificación',
    icon: Trophy,
    path: '/leaderboard',
    permission: Permission.VIEW_COURSES,
  },
  {
    id: 'documentation',
    label: 'Documentación',
    icon: FileText,
    path: '/documentation',
    permission: Permission.VIEW_TOPICS,
  },
  {
    id: 'settings',
    label: 'Configuración',
    icon: Settings,
    path: '/settings',
    permission: Permission.VIEW_SETTINGS,
  },
];
