import { useMutation, useQueryClient } from '@tanstack/react-query';
import { activityService } from '../services/activity.service';
import type { CreateActivityDto } from '../types/activity.types';
import { toast } from 'sonner';

interface UseActivityActionsOptions {
  topicId?: string;
  courseId?: string;
  onCreateSuccess?: () => void;
  onUpdateSuccess?: () => void;
  onDeleteSuccess?: () => void;
}

export const useActivityActions = ({
  topicId,
  courseId,
  onCreateSuccess,
  onUpdateSuccess,
  onDeleteSuccess,
}: UseActivityActionsOptions = {}) => {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: (data: CreateActivityDto) =>
      activityService.createActivity(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['topics'] });
      if (topicId) {
        queryClient.invalidateQueries({ queryKey: ['topic', topicId] });
      }
      if (courseId) {
        queryClient.invalidateQueries({ queryKey: ['courses', courseId] });
      }
      toast.success('Actividad creada exitosamente');
      onCreateSuccess?.();
    },
    onError: (error: unknown) => {
      const message =
        error && typeof error === 'object' && 'response' in error
          ? (error as { response?: { data?: { message?: string } } }).response
              ?.data?.message
          : 'Error al crear la actividad';
      toast.error(message || 'Error al crear la actividad');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Partial<CreateActivityDto>;
    }) => activityService.updateActivity(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['topics'] });
      if (topicId) {
        queryClient.invalidateQueries({ queryKey: ['topic', topicId] });
      }
      if (courseId) {
        queryClient.invalidateQueries({ queryKey: ['courses', courseId] });
      }
      toast.success('Actividad actualizada exitosamente');
      onUpdateSuccess?.();
    },
    onError: (error: unknown) => {
      const message =
        error && typeof error === 'object' && 'response' in error
          ? (error as { response?: { data?: { message?: string } } }).response
              ?.data?.message
          : 'Error al actualizar la actividad';
      toast.error(message || 'Error al actualizar la actividad');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => activityService.deleteActivity(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['topics'] });
      if (topicId) {
        queryClient.invalidateQueries({ queryKey: ['topic', topicId] });
      }
      if (courseId) {
        queryClient.invalidateQueries({ queryKey: ['courses', courseId] });
      }
      toast.success('Actividad eliminada exitosamente');
      onDeleteSuccess?.();
    },
    onError: (error: unknown) => {
      const message =
        error && typeof error === 'object' && 'response' in error
          ? (error as { response?: { data?: { message?: string } } }).response
              ?.data?.message
          : 'Error al eliminar la actividad';
      toast.error(message || 'Error al eliminar la actividad');
    },
  });

  const handleCreate = (data: CreateActivityDto) => {
    createMutation.mutate(data);
  };

  const handleUpdate = (id: string, data: Partial<CreateActivityDto>) => {
    updateMutation.mutate({ id, data });
  };

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
  };

  return {
    handleCreate,
    handleUpdate,
    handleDelete,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
};
