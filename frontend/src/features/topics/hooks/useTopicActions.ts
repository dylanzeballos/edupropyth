import { useCallback } from 'react';
import { useCreateTopic, useUpdateTopic, useDeleteTopic } from './useTopic';
import type {
  CreateTopicFormData,
  UpdateTopicFormData,
} from '@/features/topics';

interface UseTopicActionsOptions {
  courseId: string;
  onCreateSuccess?: () => void;
  onUpdateSuccess?: () => void;
  onDeleteSuccess?: () => void;
}

export const useTopicActions = ({
  courseId,
  onCreateSuccess,
  onUpdateSuccess,
  onDeleteSuccess,
}: UseTopicActionsOptions) => {
  const createTopicMutation = useCreateTopic(courseId);
  const updateTopicMutation = useUpdateTopic(courseId);
  const deleteTopicMutation = useDeleteTopic(courseId);

  const handleCreate = useCallback(
    (data: CreateTopicFormData | UpdateTopicFormData) => {
      createTopicMutation.mutate(data as CreateTopicFormData, {
        onSuccess: () => {
          onCreateSuccess?.();
        },
      });
    },
    [createTopicMutation, onCreateSuccess],
  );

  const handleUpdate = useCallback(
    (topicId: string, data: CreateTopicFormData | UpdateTopicFormData) => {
      updateTopicMutation.mutate(
        { topicId, data: data as UpdateTopicFormData },
        {
          onSuccess: () => {
            onUpdateSuccess?.();
          },
        },
      );
    },
    [updateTopicMutation, onUpdateSuccess],
  );

  const handleDelete = useCallback(
    (topicId: string) => {
      deleteTopicMutation.mutate(topicId, {
        onSuccess: () => {
          onDeleteSuccess?.();
        },
      });
    },
    [deleteTopicMutation, onDeleteSuccess],
  );

  return {
    handleCreate,
    handleUpdate,
    handleDelete,
    isCreating: createTopicMutation.isPending,
    isUpdating: updateTopicMutation.isPending,
    isDeleting: deleteTopicMutation.isPending,
  };
};
