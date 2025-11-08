import { useCallback } from 'react';
import type { Activity, CreateActivityFormData } from '@/features/activities';
import type { Topic, CreateTopicFormData, UpdateTopicFormData } from '@/features/topics';
import type { Resource, UploadResourceRequest, CreateResourceRequest } from '@/features/resources';
import type { UpdateCourseFormData } from '../validation/course.schema';

interface UseActivityHandlersProps {
  activityActions: {
    handleCreate: (data: CreateActivityFormData) => void;
    handleUpdate: (id: string, data: Partial<CreateActivityFormData>) => void;
    handleDelete: (id: string) => void;
  };
  topicActions: {
    handleCreate: (data: CreateTopicFormData | UpdateTopicFormData) => void;
    handleUpdate: (id: string, data: CreateTopicFormData | UpdateTopicFormData) => void;
    handleDelete: (id: string) => void;
  };
  resourceActions: {
    handleCreate: (data: UploadResourceRequest | CreateResourceRequest) => void;
    handleUpdate: (id: string, data: UploadResourceRequest | CreateResourceRequest) => void;
    handleDelete: (id: string) => void;
  };
  modals: {
    getModalData: <T>(modalName: string) => T | undefined;
    closeModal: (modalName: string) => void;
  };
  updateCourseMutation: {
    mutate: (params: { id: string; data: UpdateCourseFormData }, options?: { onSuccess?: () => void }) => void;
  };
  courseId?: string;
}

export const useCourseHandlers = ({
  activityActions,
  topicActions,
  resourceActions,
  modals,
  updateCourseMutation,
  courseId,
}: UseActivityHandlersProps) => {
  const handleUpdateCourse = useCallback(
    (data: UpdateCourseFormData) => {
      if (!courseId) return;
      updateCourseMutation.mutate(
        { id: courseId, data },
        { onSuccess: () => modals.closeModal('editCourse') },
      );
    },
    [courseId, updateCourseMutation, modals],
  );

  const handleCreateTopic = useCallback(
    (data: CreateTopicFormData | UpdateTopicFormData) => {
      topicActions.handleCreate(data);
    },
    [topicActions],
  );

  const handleUpdateTopic = useCallback(
    (data: CreateTopicFormData | UpdateTopicFormData) => {
      const topic = modals.getModalData<Topic>('editTopic');
      if (!topic) return;
      topicActions.handleUpdate(topic.id, data);
    },
    [topicActions, modals],
  );

  const handleDeleteTopic = useCallback(() => {
    const topicId = modals.getModalData<string>('deleteTopic');
    if (!topicId) return;
    topicActions.handleDelete(topicId);
  }, [topicActions, modals]);

  const handleSubmitResource = useCallback(
    (data: UploadResourceRequest | CreateResourceRequest) => {
      resourceActions.handleCreate(data);
    },
    [resourceActions],
  );

  const handleUpdateResource = useCallback(
    (data: UploadResourceRequest | CreateResourceRequest) => {
      const resource = modals.getModalData<Resource>('editResource');
      if (!resource) return;
      resourceActions.handleUpdate(resource.id, data);
    },
    [resourceActions, modals],
  );

  const handleDeleteResource = useCallback(() => {
    const resourceId = modals.getModalData<string>('deleteResource');
    if (!resourceId) return;
    resourceActions.handleDelete(resourceId);
  }, [resourceActions, modals]);

  const handleCreateActivity = useCallback(
    (data: CreateActivityFormData) => {
      activityActions.handleCreate(data);
    },
    [activityActions],
  );

  const handleUpdateActivity = useCallback(
    (data: CreateActivityFormData) => {
      const activity = modals.getModalData<Activity>('editActivity');
      if (!activity) return;
      activityActions.handleUpdate(activity.id, data);
    },
    [activityActions, modals],
  );

  const handleDeleteActivity = useCallback(() => {
    const activityId = modals.getModalData<string>('deleteActivity');
    if (!activityId) return;
    activityActions.handleDelete(activityId);
  }, [activityActions, modals]);

  return {
    handleUpdateCourse,
    handleCreateTopic,
    handleUpdateTopic,
    handleDeleteTopic,
    handleSubmitResource,
    handleUpdateResource,
    handleDeleteResource,
    handleCreateActivity,
    handleUpdateActivity,
    handleDeleteActivity,
  };
};
