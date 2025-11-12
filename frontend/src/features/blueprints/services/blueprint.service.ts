import { apiClient } from '@/lib/api';
import type {
  Blueprint,
  CreateBlueprintRequest,
  UpdateBlueprintRequest,
} from '../types/blueprint.types';

export const blueprintService = {
  list: async (): Promise<Blueprint[]> => {
    const response = await apiClient.get<Blueprint[]>('/blueprints');
    return response.data;
  },

  getById: async (id: string): Promise<Blueprint> => {
    const response = await apiClient.get<Blueprint>(`/blueprints/${id}`);
    return response.data;
  },

  create: async (data: CreateBlueprintRequest): Promise<Blueprint> => {
    const response = await apiClient.post<Blueprint>('/blueprints', data);
    return response.data;
  },

  update: async (
    id: string,
    data: UpdateBlueprintRequest,
  ): Promise<Blueprint> => {
    const response = await apiClient.patch<Blueprint>(
      `/blueprints/${id}`,
      data,
    );
    return response.data;
  },
};
