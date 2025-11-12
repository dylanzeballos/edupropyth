import { motion } from 'framer-motion';
import { CourseHeader } from '@/features/courses/components/CourseHeader';
import { CourseInfo } from '@/features/courses/components/CourseInfo';
import { CourseTopicsList } from '@/features/courses/components/CourseTopicsList';
import { CourseForm } from '@/features/courses/components/CourseForm';
import { GroupsSection, GroupModals, type Group } from '@/features/groups';
import type { Topic } from '@/features/topics';
import type { Resource } from '@/features/resources';
import type { Activity } from '@/features/activities';
import { CourseTopicModals } from '@/features/courses/components/CourseTopicModals';
import { CourseResourceModals } from '@/features/courses/components/CourseResourceModals';
import { CourseActivityModals } from '@/features/courses/components/CourseActivityModals';
import { Modal } from '@/shared/components/ui';
import { useEditionPageSetup } from '../hooks/useEditionPageSetup';

export const EditionDetailPage = () => {
  const {
    courseLike,
    topics,
    groups,
    
    isLoadingGroups,
    groupsError,
    loadingState,
    
    permissions: {
      canEditCourse,
      canCreateTopics,
      canEditTopics,
      canDeleteTopics,
      canAddResources,
      canEditResources,
      canDeleteResources,
      canManageGroups,
      canConfigureTemplate,
    },
    
    handleNavigateBack,
    courseHandlers: {
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
    },
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
  } = useEditionPageSetup();

  if (loadingState) return loadingState;
  if (!courseLike) return null;

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
          canConfigureTemplate={canConfigureTemplate}
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

        <GroupsSection
          groups={groups}
          isLoading={isLoadingGroups}
          error={groupsError}
          canManageGroups={canManageGroups}
          onCreateGroup={() => modals.openModal('createGroup')}
          onEditGroup={(group) => modals.openModal('editGroup', group)}
          onDeleteGroup={(group) => modals.openModal('deleteGroup', group)}
          canEditGroup={canEditGroup}
          canDeleteGroup={canDeleteGroup}
        />
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

      {hasGroupPermissions && (
        <GroupModals
          isCreateOpen={modals.isModalOpen('createGroup')}
          isEditOpen={modals.isModalOpen('editGroup')}
          isDeleteOpen={modals.isModalOpen('deleteGroup')}
          onCloseCreate={() => modals.closeModal('createGroup')}
          onCloseEdit={() => modals.closeModal('editGroup')}
          onCloseDelete={() => modals.closeModal('deleteGroup')}
          onSubmitCreate={handleCreateGroup}
          onSubmitEdit={handleUpdateGroup}
          onConfirmDelete={handleDeleteGroup}
          getEditData={() => modals.getModalData<Group>('editGroup') ?? undefined}
          isCreating={isCreating}
          isUpdating={isUpdating}
          isDeleting={isDeleting}
        />
      )}
    </div>
  );
};
