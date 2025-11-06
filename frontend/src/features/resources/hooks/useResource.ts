import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import type {
  CreateResourceRequest,
  UploadResourceRequest,
  UpdateResourceRequest,
} from '../types/resource.types';
import {
  createResource,
  uploadResource,
  updateResource,
  deleteResource,
} from '../services/resource.service';

export const useCreateResource = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateResourceRequest) => createResource(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['topics'] });
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      toast.success('Recurso creado exitosamente');
    },
    onError: (error: Error) => {
      toast.error(`Error al crear recurso: ${error.message}`);
    },
  });
};

export const useUploadResource = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UploadResourceRequest) => uploadResource(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['topics'] });
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      toast.success('Recurso subido exitosamente');
    },
    onError: (error: Error) => {
      toast.error(`Error al subir recurso: ${error.message}`);
    },
  });
};

export const useUpdateResource = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateResourceRequest }) =>
      updateResource(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['topics'] });
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      toast.success('Recurso actualizado exitosamente');
    },
    onError: (error: Error) => {
      toast.error(`Error al actualizar recurso: ${error.message}`);
    },
  });
};

export const useDeleteResource = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteResource(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['topics'] });
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      toast.success('Recurso eliminado exitosamente');
    },
    onError: (error: Error) => {
      toast.error(`Error al eliminar recurso: ${error.message}`);
    },
  });
};
