import type { Topic } from '@/features/topics';
import type { Resource } from '@/features/resources';
import type { Activity } from '@/features/activities';

export interface ModalHandlers {
  openModal: (modalName: string, data?: unknown) => void;
}

export const createModalHandlers = (openModal: (modalName: string, data?: unknown) => void) => ({
  onAddTopic: (canCreate: boolean) =>
    canCreate ? () => openModal('createTopic') : undefined,

  onEditTopic: (canEdit: boolean) =>
    canEdit ? (topic: Topic) => openModal('editTopic', topic) : undefined,

  onDeleteTopic: (canDelete: boolean) =>
    canDelete ? (topicId: string) => openModal('deleteTopic', topicId) : undefined,

  onAddResource: (canAdd: boolean) =>
    canAdd ? (topic: Topic) => openModal('createResource', topic) : undefined,

  onEditResource: (canEdit: boolean) =>
    canEdit ? (resource: Resource) => openModal('editResource', resource) : undefined,

  onDeleteResource: (canDelete: boolean) =>
    canDelete ? (resourceId: string) => openModal('deleteResource', resourceId) : undefined,

  onAddActivity: (canAdd: boolean) =>
    canAdd ? (topic: Topic) => openModal('createActivity', topic) : undefined,

  onEditActivity: (canEdit: boolean) =>
    canEdit ? (activity: Activity) => openModal('editActivity', activity) : undefined,

  onDeleteActivity: (canDelete: boolean) =>
    canDelete ? (activityId: string) => openModal('deleteActivity', activityId) : undefined,
});
