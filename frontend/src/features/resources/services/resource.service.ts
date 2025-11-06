import { apiClient } from '../../../lib/api';
import type {
  Resource,
  CreateResourceRequest,
  UploadResourceRequest,
  UpdateResourceRequest,
} from '../types/resource.types';

export const createResource = async (
  data: CreateResourceRequest
): Promise<Resource> => {
  const response = await apiClient.post<Resource>('/resources', data);
  return response.data;
};

export const uploadResource = async (
  data: UploadResourceRequest
): Promise<Resource> => {
  if (!data.file || !(data.file instanceof File)) {
    throw new Error('Debe proporcionar un archivo válido');
  }

  const formData = new FormData();
  
  formData.append('topicId', data.topicId);
  formData.append('title', data.title);
  formData.append('type', data.type);
  formData.append('order', data.order.toString());
  
  if (data.description) {
    formData.append('description', data.description);
  }
  
  formData.append('file', data.file, data.file.name);

  const response = await apiClient.post<Resource>('/resources/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const updateResource = async (
  id: string,
  data: UpdateResourceRequest
): Promise<Resource> => {
  const response = await apiClient.put<Resource>(`/resources/${id}`, data);
  return response.data;
};

export const deleteResource = async (id: string): Promise<void> => {
  await apiClient.delete(`/resources/${id}`);
};
