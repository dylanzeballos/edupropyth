import { useCallback } from 'react';
import {
  useUploadResource,
  useCreateResource,
  useUpdateResource,
  useDeleteResource,
} from '@/features/resources';
import type {
  UploadResourceRequest,
  CreateResourceRequest,
  UpdateResourceRequest,
} from '@/features/resources';

interface UseResourceActionsOptions {
  onCreateSuccess?: () => void;
  onUpdateSuccess?: () => void;
  onDeleteSuccess?: () => void;
}

export const useResourceActions = ({
  onCreateSuccess,
  onUpdateSuccess,
  onDeleteSuccess,
}: UseResourceActionsOptions) => {
  const uploadResourceMutation = useUploadResource();
  const createResourceMutation = useCreateResource();
  const updateResourceMutation = useUpdateResource();
  const deleteResourceMutation = useDeleteResource();

  const handleCreate = useCallback(
    (data: UploadResourceRequest | CreateResourceRequest) => {
      if ('file' in data) {
        uploadResourceMutation.mutate(data, {
          onSuccess: () => {
            onCreateSuccess?.();
          },
        });
      } else {
        createResourceMutation.mutate(data, {
          onSuccess: () => {
            onCreateSuccess?.();
          },
        });
      }
    },
    [uploadResourceMutation, createResourceMutation, onCreateSuccess]
  );

  const handleUpdate = useCallback(
    (resourceId: string, data: UploadResourceRequest | CreateResourceRequest) => {
      const updateData: UpdateResourceRequest = {
        title: data.title,
        description: data.description,
        type: data.type,
        order: data.order,
      };

      if ('url' in data) {
        updateData.url = data.url;
      }

      updateResourceMutation.mutate(
        { id: resourceId, data: updateData },
        {
          onSuccess: () => {
            onUpdateSuccess?.();
          },
        }
      );
    },
    [updateResourceMutation, onUpdateSuccess]
  );

  const handleDelete = useCallback(
    (resourceId: string) => {
      deleteResourceMutation.mutate(resourceId, {
        onSuccess: () => {
          onDeleteSuccess?.();
        },
      });
    },
    [deleteResourceMutation, onDeleteSuccess]
  );

  return {
    handleCreate,
    handleUpdate,
    handleDelete,
    isCreating:
      uploadResourceMutation.isPending || createResourceMutation.isPending,
    isUpdating: updateResourceMutation.isPending,
    isDeleting: deleteResourceMutation.isPending,
  };
};
