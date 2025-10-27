import { getData, patchData } from '@/lib/api';
import {
  UserAdmin,
  UpdateUserRoleDto,
  UpdateUserStatusDto,
  UserStatsResponse,
} from '../types/user-admin.types';

export const usersService = {
  async getAllUsers(): Promise<UserAdmin[]> {
    return await getData('/users');
  },

  async getUserById(id: string): Promise<UserAdmin> {
    return await getData(`/users/${id}`);
  },

  async updateUserRole(data: UpdateUserRoleDto): Promise<UserAdmin> {
    return await patchData('/users/role', data);
  },

  async updateUserStatus(data: UpdateUserStatusDto): Promise<UserAdmin> {
    return await patchData('/users/status', data);
  },

  async getUserStats(): Promise<UserStatsResponse[]> {
    return await getData('/users/stats');
  },

  async getMyProfile(): Promise<UserAdmin> {
    return await getData('/users/me/profile');
  },
};
