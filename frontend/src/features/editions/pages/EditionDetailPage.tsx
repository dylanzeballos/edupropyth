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
import { useEdition, useUpdateEdition } from '@/features/editions';
import {
  useGroups,
  useCreateGroup,
  useUpdateGroup,
  useDeleteGroup,
  GroupCard,
  type Group,
} from '@/features/groups';
import type { GroupFormData } from '@/features/groups/validation/group.schema';
import type { UpdateCourseFormData } from '@/features/courses/validation/course.schema';
import type { Course } from '@/features/courses/types/course.types';
import { Modal, EmptyState, Button } from '@/shared/components/ui';
import { GroupForm } from '@/features/groups';

export const EditionDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const modals = useModals();

  const { data: edition, isLoading, error } = useEdition(id);
  const { data: topics } = useTopics(id || '');
  const {
    data: groups,
    isLoading: isLoadingGroups,
    error: groupsError,
  } = useGroups(id);
  const updateEditionMutation = useUpdateEdition();
  const createGroupMutation = useCreateGroup(id);
  const updateGroupMutation = useUpdateGroup(id);
  const deleteGroupMutation = useDeleteGroup(id);
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
    canManageGroups,
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

  const handleCreateGroup = (data: GroupFormData) => {
    createGroupMutation.mutate(
      {
        name: data.name,
        instructorId: data.instructorId?.trim()
          ? data.instructorId
          : undefined,
      },
      {
        onSuccess: () => modals.closeModal('createGroup'),
      },
    );
  };

  const handleUpdateGroupForm = (data: GroupFormData) => {
    const group = modals.getModalData<Group>('editGroup');
    if (!group) return;
    updateGroupMutation.mutate(
      {
        groupId: group.id,
        data: {
          name: data.name,
          isActive: data.isActive,
          instructorId: data.instructorId?.trim()
            ? data.instructorId
            : undefined,
        },
      },
      {
        onSuccess: () => modals.closeModal('editGroup'),
      },
    );
  };

  const handleDeleteGroup = () => {
    const group = modals.getModalData<Group>('deleteGroup');
    if (!group) return;
    deleteGroupMutation.mutate(group.id, {
      onSuccess: () => modals.closeModal('deleteGroup'),
    });
  };

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

        <section className="mt-8 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Grupos
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Organiza a los estudiantes por grupo y asigna instructores.
              </p>
            </div>
            {canManageGroups && (
              <Button
                onClick={() => modals.openModal('createGroup')}
                className="w-full md:w-auto ml-auto"
              >
                Crear grupo
              </Button>
            )}
          </div>

          {isLoadingGroups ? (
            <div className="flex justify-center items-center py-12 text-gray-500 dark:text-gray-400">
              <div className="flex flex-col items-center gap-2">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" />
                Cargando grupos...
              </div>
            </div>
          ) : groupsError ? (
            <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-xl p-6 text-red-700 dark:text-red-200">
              No se pudieron cargar los grupos.
            </div>
          ) : !groups || groups.length === 0 ? (
            <EmptyState
              title="Aún no tienes grupos"
              description="Crea un grupo para comenzar a asignar estudiantes."
              actionLabel={canManageGroups ? 'Crear grupo' : undefined}
              onAction={
                canManageGroups ? () => modals.openModal('createGroup') : undefined
              }
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {groups.map((group) => (
                <GroupCard
                  key={group.id}
                  group={group}
                  onEdit={
                    canManageGroups
                      ? (selected) => modals.openModal('editGroup', selected)
                      : undefined
                  }
                  onDelete={
                    canManageGroups
                      ? (selected) => modals.openModal('deleteGroup', selected)
                      : undefined
                  }
                />
              ))}
            </div>
          )}
        </section>
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

      {canManageGroups && (
        <>
          <Modal
            isOpen={modals.isModalOpen('createGroup')}
            onClose={() => modals.closeModal('createGroup')}
            title="Crear grupo"
          >
            <GroupForm
              onSubmit={handleCreateGroup}
              onCancel={() => modals.closeModal('createGroup')}
              isSubmitting={createGroupMutation.isPending}
            />
          </Modal>

          <Modal
            isOpen={modals.isModalOpen('editGroup')}
            onClose={() => modals.closeModal('editGroup')}
            title="Editar grupo"
          >
            <GroupForm
              defaultValues={modals.getModalData<Group>('editGroup') ?? undefined}
              onSubmit={handleUpdateGroupForm}
              onCancel={() => modals.closeModal('editGroup')}
              isSubmitting={updateGroupMutation.isPending}
              showStatusToggle
            />
          </Modal>

          <Modal
            isOpen={modals.isModalOpen('deleteGroup')}
            onClose={() => modals.closeModal('deleteGroup')}
            title="Eliminar grupo"
          >
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              ¿Seguro que deseas eliminar este grupo? Esta acción no se puede deshacer.
            </p>
            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => modals.closeModal('deleteGroup')}
                disabled={deleteGroupMutation.isPending}
              >
                Cancelar
              </Button>
              <Button
                variant="destructive"
                onClick={handleDeleteGroup}
                disabled={deleteGroupMutation.isPending}
              >
                Eliminar
              </Button>
            </div>
          </Modal>
        </>
      )}
    </div>
  );
};
