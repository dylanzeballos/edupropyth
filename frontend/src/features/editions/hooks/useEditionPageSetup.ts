import { useParams } from 'react-router';
import { useModals } from '@/shared/hooks/useModalState';
import { useCoursePermissions } from '@/features/courses/hooks/useCoursePermissions';
import { useCourseHandlers } from '@/features/courses/hooks/useCourseHandlers';
import { useTopics, useTopicActions } from '@/features/topics';
import { useResourceActions } from '@/features/resources';
import { useActivityActions } from '@/features/activities';
import { useEdition, useUpdateEdition } from '@/features/editions';
import { useAuthStore } from '@/features/auth';
import { useGroups } from '@/features/groups';
import { createModalHandlers } from '@/features/courses/utils/modal-handlers';
import { CourseLoadingState } from '@/features/courses/components/CourseLoadingState';
import { useEditionHandlers } from './useEditionHandlers';
import { useEditionNavigation } from './useEditionNavigation';
import { useGroupActions } from './useGroupActions';
import type { UpdateCourseFormData } from '@/features/courses/validation/course.schema';
import type { Course } from '@/features/courses/types/course.types';
import type { Group } from '@/features/groups';

export const useEditionPageSetup = () => {
  const { id } = useParams<{ id: string }>();
  const modals = useModals();
  const { user } = useAuthStore();

  const { data: edition, isLoading, error } = useEdition(id);
  const { data: topics } = useTopics(id || '');
  const {
    data: groups,
    isLoading: isLoadingGroups,
    error: groupsError,
  } = useGroups(id);
  
  const updateEditionMutation = useUpdateEdition();
  const permissions = useCoursePermissions({ courseStatus: edition?.status });
  const courseLike = edition as Course | undefined;
  const isHistoric = edition?.status === 'historic';

  const { handleNavigateBack } = useEditionNavigation({ edition });

  const {
    canUserEditGroup,
    canUserDeleteGroup,
    hasGroupPermissions: getHasGroupPermissions,
  } = useEditionHandlers({
    user,
    isHistoric,
    hasManagePermissions: permissions.canManageGroups,
  });

  const {
    handleCreateGroup,
    handleUpdateGroup,
    handleDeleteGroup,
    isCreating,
    isUpdating,
    isDeleting,
  } = useGroupActions({ 
    editionId: id,
    modals: {
      getModalData: modals.getModalData,
      closeModal: modals.closeModal,
    },
  });

  const topicActions = useTopicActions({
    courseId: id || '',
    onCreateSuccess: () => modals.closeModal('createTopic'),
    onUpdateSuccess: () => modals.closeModal('editTopic'),
    onDeleteSuccess: () => modals.closeModal('deleteTopic'),
  });

  const resourceActions = useResourceActions({
    onCreateSuccess: () => modals.closeModal('createResource'),
    onUpdateSuccess: () => modals.closeModal('editResource'),
    onDeleteSuccess: () => modals.closeModal('deleteResource'),
  });

  const activityActions = useActivityActions({
    courseId: id,
    onCreateSuccess: () => modals.closeModal('createActivity'),
    onUpdateSuccess: () => modals.closeModal('editActivity'),
    onDeleteSuccess: () => modals.closeModal('deleteActivity'),
  });

  const updateEditionAdapter = {
    mutate: (
      params: { id: string; data: UpdateCourseFormData },
      options?: { onSuccess?: () => void },
    ) => {
      updateEditionMutation.mutate(
        {
          editionId: params.id,
          data: params.data,
        },
        options,
      );
    },
  };

  const courseHandlers = useCourseHandlers({
    activityActions,
    topicActions,
    resourceActions,
    modals: {
      getModalData: (modalName: string) =>
        modals.getModalData(modalName) ?? undefined,
      closeModal: modals.closeModal,
    },
    updateCourseMutation: updateEditionAdapter,
    courseId: id,
  });

  const modalActions = createModalHandlers(modals.openModal);

  const loadingState = CourseLoadingState({
    isLoading,
    hasError: !!error || !edition,
    onNavigateBack: handleNavigateBack,
  });

  const canEditGroup = (group: Group): boolean => canUserEditGroup(group);
  const canDeleteGroup = (): boolean => canUserDeleteGroup();
  const hasGroupPermissions = getHasGroupPermissions(groups);

  return {
    edition,
    topics,
    groups,
    courseLike,
        isLoading,
    isLoadingGroups,
    error,
    groupsError,
    loadingState,
        permissions,
        handleNavigateBack,
    courseHandlers,
    modalActions,
        handleCreateGroup,
    handleUpdateGroup,
    handleDeleteGroup,
    canEditGroup,
    canDeleteGroup,
    hasGroupPermissions,
        isCreating,
    isUpdating,
    isDeleting,
        topicActions,
    resourceActions,
    activityActions,
        modals,
        updateEditionMutation,
  };
};