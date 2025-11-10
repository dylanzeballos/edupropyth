import { useMemo } from 'react';
import { useParams, useNavigate } from 'react-router';
import { motion } from 'framer-motion';
import { useModals } from '@/shared/hooks/useModalState';
import { CourseHeader } from '@/features/courses/components/CourseHeader';
import { CourseInfo } from '@/features/courses/components/CourseInfo';
import { CourseTopicsList } from '@/features/courses/components/CourseTopicsList';
import { CourseLoadingState } from '@/features/courses/components/CourseLoadingState';
import { CourseTopicModals } from '@/features/courses/components/CourseTopicModals';
import { CourseResourceModals } from '@/features/courses/components/CourseResourceModals';
import { CourseActivityModals } from '@/features/courses/components/CourseActivityModals';
import { CourseForm } from '@/features/courses/components/CourseForm';
import { createModalHandlers } from '@/features/courses/utils/modal-handlers';
import { useCoursePermissions } from '@/features/courses/hooks/useCoursePermissions';
import { useCourseNavigation } from '@/features/courses/hooks/useCourseNavigation';
import { useCourseHandlers } from '@/features/courses/hooks/useCourseHandlers';
import { useTopics, useTopicActions, type Topic } from '@/features/topics';
import { useResourceActions, type Resource } from '@/features/resources';
import { useActivityActions, type Activity } from '@/features/activities';
import {
  useEdition,
  useUpdateEdition,
} from '@/features/editions';
import type { UpdateCourseFormData } from '@/features/courses/validation/course.schema';
import type { Course } from '@/features/courses/types/course.types';
import { Modal } from '@/shared/components/ui';

export const EditionDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const modals = useModals();

  const { data: edition, isLoading, error } = useEdition(id);
  const { data: topics } = useTopics(id || '');
  const updateEditionMutation = useUpdateEdition();
  const permissions = useCoursePermissions();
  const courseLike = edition as Course | undefined;
  const { navigateToCoursesPage } = useCourseNavigation({ course: courseLike });

  const {
    canEditCourse,
    canCreateTopics,
    canEditTopics,
    canDeleteTopics,
    canAddResources,
    canEditResources,
    canDeleteResources,
  } = permissions;

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

  const updateEditionAdapter = useMemo(
    () => ({
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
    }),
    [updateEditionMutation],
  );

  const {
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
  } = useCourseHandlers({
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

  const handleNavigateBack = () => {
    if (edition?.blueprintId) {
      navigate(`/courses/${edition.blueprintId}/management`);
      return;
    }
    navigateToCoursesPage();
  };

  const loadingState = CourseLoadingState({
    isLoading,
    hasError: !!error || !edition,
    onNavigateBack: handleNavigateBack,
  });

  if (loadingState) return loadingState;
  if (!courseLike) return null;

  const modalActions = createModalHandlers(modals.openModal);

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <CourseHeader
          course={courseLike}
          canEdit={canEditCourse}
          canConfigureTemplate={false}
          onBack={handleNavigateBack}
          onEdit={() => modals.openModal('editEdition')}
        />

        {courseLike.thumbnail && (
          <div className="mb-8 rounded-xl overflow-hidden shadow-lg">
            <img
              src={courseLike.thumbnail}
              alt={courseLike.title}
              className="w-full h-96 object-cover"
            />
          </div>
        )}

        <CourseTopicsList
          topics={topics || []}
          courseStatus={courseLike.status}
          canEdit={canEditTopics}
          canManageContent={canAddResources}
          onAddTopic={modalActions.onAddTopic(canCreateTopics)}
          onEditTopic={modalActions.onEditTopic(canEditTopics)}
          onDeleteTopic={modalActions.onDeleteTopic(canDeleteTopics)}
          onAddResource={modalActions.onAddResource(canAddResources)}
          onEditResource={modalActions.onEditResource(canEditResources)}
          onDeleteResource={modalActions.onDeleteResource(canDeleteResources)}
          onAddActivity={modalActions.onAddActivity(canAddResources)}
          onEditActivity={modalActions.onEditActivity(canEditResources)}
          onDeleteActivity={modalActions.onDeleteActivity(canDeleteResources)}
        />

        <CourseInfo course={courseLike} count={topics?.length || 0} />
      </motion.div>

      {canEditCourse && (
        <Modal
          isOpen={modals.isModalOpen('editEdition')}
          onClose={() => modals.closeModal('editEdition')}
          title="Editar edición"
        >
          <CourseForm
            course={courseLike}
            onSubmit={handleUpdateCourse}
            onCancel={() => modals.closeModal('editEdition')}
            isSubmitting={updateEditionMutation.isPending}
          />
        </Modal>
      )}

      {(canCreateTopics || canEditTopics || canDeleteTopics) && (
        <CourseTopicModals
          topics={topics || []}
          isCreateOpen={modals.isModalOpen('createTopic')}
          isEditOpen={modals.isModalOpen('editTopic')}
          isDeleteOpen={modals.isModalOpen('deleteTopic')}
          onCloseCreate={() => modals.closeModal('createTopic')}
          onCloseEdit={() => modals.closeModal('editTopic')}
          onCloseDelete={() => modals.closeModal('deleteTopic')}
          onSubmitCreate={handleCreateTopic}
          onSubmitEdit={handleUpdateTopic}
          onConfirmDelete={handleDeleteTopic}
          getEditData={() => modals.getModalData<Topic>('editTopic')}
          isCreating={topicActions.isCreating}
          isUpdating={topicActions.isUpdating}
          isDeleting={topicActions.isDeleting}
        />
      )}

      {(canAddResources || canEditResources || canDeleteResources) && (
        <CourseResourceModals
          isCreateOpen={modals.isModalOpen('createResource')}
          isEditOpen={modals.isModalOpen('editResource')}
          isDeleteOpen={modals.isModalOpen('deleteResource')}
          onCloseCreate={() => modals.closeModal('createResource')}
          onCloseEdit={() => modals.closeModal('editResource')}
          onCloseDelete={() => modals.closeModal('deleteResource')}
          onSubmitCreate={handleSubmitResource}
          onSubmitEdit={handleUpdateResource}
          onConfirmDelete={handleDeleteResource}
          getCreateData={() => modals.getModalData<Topic>('createResource')}
          getEditData={() => modals.getModalData<Resource>('editResource')}
          isCreating={resourceActions.isCreating}
          isUpdating={resourceActions.isUpdating}
          isDeleting={resourceActions.isDeleting}
        />
      )}

      {(canAddResources || canEditResources || canDeleteResources) && (
        <CourseActivityModals
          isCreateOpen={modals.isModalOpen('createActivity')}
          isEditOpen={modals.isModalOpen('editActivity')}
          isDeleteOpen={modals.isModalOpen('deleteActivity')}
          onCloseCreate={() => modals.closeModal('createActivity')}
          onCloseEdit={() => modals.closeModal('editActivity')}
          onCloseDelete={() => modals.closeModal('deleteActivity')}
          onSubmitCreate={handleCreateActivity}
          onSubmitEdit={handleUpdateActivity}
          onConfirmDelete={handleDeleteActivity}
          getCreateData={() => modals.getModalData<Topic>('createActivity')}
          getEditData={() => modals.getModalData<Activity>('editActivity')}
          isCreating={activityActions.isCreating}
          isUpdating={activityActions.isUpdating}
          isDeleting={activityActions.isDeleting}
        />
      )}
    </div>
  );
};
