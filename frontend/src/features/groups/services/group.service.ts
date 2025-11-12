import { apiClient } from '@/lib/api';
import type {
  Group,
  CreateGroupRequest,
  UpdateGroupRequest,
} from '../types/group.types';

export const groupService = {
  listByEdition: async (editionId: string): Promise<Group[]> => {
    const response = await apiClient.get<Group[]>(
      `/editions/${editionId}/groups`,
    );
    return response.data;
  },

  createGroup: async (
    editionId: string,
    data: CreateGroupRequest,
  ): Promise<Group> => {
    const response = await apiClient.post<Group>(
      `/editions/${editionId}/groups`,
      data,
    );
    return response.data;
  },

  updateGroup: async (
    editionId: string,
    groupId: string,
    data: UpdateGroupRequest,
  ): Promise<Group> => {
    const response = await apiClient.patch<Group>(
      `/editions/${editionId}/groups/${groupId}`,
      data,
    );
    return response.data;
  },

  deleteGroup: async (editionId: string, groupId: string): Promise<void> => {
    await apiClient.delete(`/editions/${editionId}/groups/${groupId}`);
  },
};
