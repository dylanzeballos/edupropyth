import { apiClient } from '@/lib/api';
import type {
  Edition,
  CreateEditionRequest,
  UpdateEditionRequest,
  ChangeEditionStatusRequest,
} from '../types/edition.types';

export const editionService = {
  listByBlueprint: async (blueprintId: string): Promise<Edition[]> => {
    const response = await apiClient.get<Edition[]>(
      `/editions?blueprintId=${blueprintId}`,
    );
    return response.data;
  },

  getEdition: async (editionId: string): Promise<Edition> => {
    const response = await apiClient.get<Edition>(`/editions/${editionId}`);
    return response.data;
  },

  createEdition: async (data: CreateEditionRequest): Promise<Edition> => {
    const response = await apiClient.post<Edition>('/editions', data);
    return response.data;
  },

  updateEdition: async (
    editionId: string,
    data: UpdateEditionRequest,
  ): Promise<Edition> => {
    const response = await apiClient.patch<Edition>(
      `/editions/${editionId}`,
      data,
    );
    return response.data;
  },

  changeEditionStatus: async (
    editionId: string,
    data: ChangeEditionStatusRequest,
  ): Promise<Edition> => {
    const response = await apiClient.patch<Edition>(
      `/editions/${editionId}/status`,
      data,
    );
    return response.data;
  },
};
