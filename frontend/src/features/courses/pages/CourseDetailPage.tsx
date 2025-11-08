import { useParams, useNavigate } from 'react-router';
import { motion } from 'framer-motion';
import { useCourse, useUpdateCourse } from '../hooks/useCourse';
import { useCoursePermissions } from '../hooks/useCoursePermissions';
import { useCourseNavigation } from '../hooks/useCourseNavigation';
import { useCourseHandlers } from '../hooks/useCourseHandlers';
import { CourseForm } from '../components/CourseForm';
import { CourseHeader } from '../components/CourseHeader';
import { CourseInfo } from '../components/CourseInfo';
import { CourseTopicsList } from '../components/CourseTopicsList';
import { CourseLoadingState } from '../components/CourseLoadingState';
import { CourseTopicModals } from '../components/CourseTopicModals';
import { CourseResourceModals } from '../components/CourseResourceModals';
import { CourseActivityModals } from '../components/CourseActivityModals';
import { createModalHandlers } from '../utils/modal-handlers';
import { Modal } from '@/shared/components/ui/Modal';
import { useModals } from '@/shared/hooks/useModalState';
import { useTopics, useTopicActions, type Topic } from '@/features/topics';
import { useResourceActions, type Resource } from '@/features/resources';
import { useActivityActions, type Activity } from '@/features/activities';

export const CourseDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const modals = useModals();

  const { data: course, isLoading, error } = useCourse(id);
  const { data: topics } = useTopics(id || '');
  const updateCourseMutation = useUpdateCourse();
  const permissions = useCoursePermissions();
  const { navigateToCoursesPage } = useCourseNavigation({ course });

  const {
    canEditCourse,
    canConfigureTemplate,
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
      getModalData: (modalName: string) => modals.getModalData(modalName) ?? undefined,
      closeModal: modals.closeModal,
    },
    updateCourseMutation,
    courseId: id,
  });

  const loadingState = CourseLoadingState({
    isLoading,
    hasError: !!error || !course,
    onNavigateBack: () => navigate('/my-courses'),
  });

  if (loadingState) return loadingState;

  const modalActions = createModalHandlers(modals.openModal);

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <CourseHeader
          course={course!}
          canEdit={canEditCourse}
          canConfigureTemplate={canConfigureTemplate}
          onBack={navigateToCoursesPage}
          onEdit={() => modals.openModal('editCourse')}
        />

        {course!.thumbnail && (
          <div className="mb-8 rounded-xl overflow-hidden shadow-lg">
            <img
              src={course!.thumbnail}
              alt={course!.title}
              className="w-full h-96 object-cover"
            />
          </div>
        )}

        <CourseTopicsList
          topics={topics || []}
          courseStatus={course!.status}
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

        <CourseInfo course={course!} topicsCount={topics?.length || 0} />
      </motion.div>

      {canEditCourse && (
        <Modal
          isOpen={modals.isModalOpen('editCourse')}
          onClose={() => modals.closeModal('editCourse')}
          title="Editar Curso"
        >
          <CourseForm
            course={course!}
            onSubmit={handleUpdateCourse}
            onCancel={() => modals.closeModal('editCourse')}
            isSubmitting={updateCourseMutation.isPending}
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
