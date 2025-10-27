import { UserRole } from '@/features/auth/types/user.type';

export interface UserAdmin {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateUserRoleDto {
  userId: string;
  role: UserRole;
}

export interface UpdateUserStatusDto {
  userId: string;
  isActive: boolean;
}

export interface UserStatsResponse {
  role: UserRole;
  count: string;
}

export interface UserStats {
  total: number;
  byRole: {
    [key in UserRole]?: number;
  };
  active: number;
  inactive: number;
}
