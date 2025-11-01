import { getData, patchData } from '@/lib/api';
import {
  UserAdmin,
  UpdateUserRoleDto,
  UpdateUserStatusDto,
  UserStatsResponse,
} from '../types/user-admin.types';

export const usersService = {
  async getAllUsers(): Promise<UserAdmin[]> {
    return (await getData('/users')) as UserAdmin[];
  },

  async getUserById(id: string): Promise<UserAdmin> {
    return (await getData(`/users/${id}`)) as UserAdmin;
  },

  async updateUserRole(data: UpdateUserRoleDto): Promise<UserAdmin> {
    return (await patchData('/users/role', data)) as UserAdmin;
  },

  async updateUserStatus(data: UpdateUserStatusDto): Promise<UserAdmin> {
    return (await patchData('/users/status', data)) as UserAdmin;
  },

  async getUserStats(): Promise<UserStatsResponse[]> {
    return (await getData('/users/stats')) as UserStatsResponse[];
  },

  async getMyProfile(): Promise<UserAdmin> {
    return (await getData('/users/me/profile')) as UserAdmin;
  },
};
