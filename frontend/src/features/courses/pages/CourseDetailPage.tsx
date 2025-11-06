import { useParams, useNavigate } from 'react-router';
import { motion } from 'framer-motion';
import { useCourse, useUpdateCourse } from '../hooks/useCourse';
import { useCoursePermissions } from '../hooks/useCoursePermissions';
import { useCourseNavigation } from '../hooks/useCourseNavigation';
import { CourseForm } from '../components/CourseForm';
import { CourseHeader } from '../components/CourseHeader';
import { CourseInfo } from '../components/CourseInfo';
import { CourseTopicsList } from '../components/CourseTopicsList';
import { Modal } from '@/shared/components/ui/Modal';
import { Button, EmptyState } from '@/shared/components/ui';
import { useModals } from '@/shared/hooks/useModalState';
import type { UpdateCourseFormData } from '../validation/course.schema';
import {
  useTopics,
  useTopicActions,
  TopicForm,
  type Topic,
  type CreateTopicFormData,
  type UpdateTopicFormData,
} from '@/features/topics';
import {
  useResourceActions,
  ResourceForm,
  type Resource,
  type UploadResourceRequest,
  type CreateResourceRequest,
} from '@/features/resources';

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

  const handleUpdateCourse = (data: UpdateCourseFormData) => {
    if (!id) return;
    updateCourseMutation.mutate(
      { id, data },
      { onSuccess: () => modals.closeModal('editCourse') },
    );
  };

  const handleCreateTopic = (
    data: CreateTopicFormData | UpdateTopicFormData,
  ) => {
    topicActions.handleCreate(data);
  };

  const handleUpdateTopic = (
    data: CreateTopicFormData | UpdateTopicFormData,
  ) => {
    const topic = modals.getModalData<Topic>('editTopic');
    if (!topic) return;
    topicActions.handleUpdate(topic.id, data);
  };

  const handleDeleteTopic = () => {
    const topicId = modals.getModalData<string>('deleteTopic');
    if (!topicId) return;
    topicActions.handleDelete(topicId);
  };

  const handleSubmitResource = (
    data: UploadResourceRequest | CreateResourceRequest,
  ) => {
    resourceActions.handleCreate(data);
  };

  const handleUpdateResource = (
    data: UploadResourceRequest | CreateResourceRequest,
  ) => {
    const resource = modals.getModalData<Resource>('editResource');
    if (!resource) return;
    resourceActions.handleUpdate(resource.id, data);
  };

  const handleDeleteResource = () => {
    const resourceId = modals.getModalData<string>('deleteResource');
    if (!resourceId) return;
    resourceActions.handleDelete(resourceId);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="text-gray-600 dark:text-gray-400">
              Cargando curso...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Button
          variant="ghost"
          onClick={() => navigate('/my-courses')}
          className="mb-4"
        >
          Volver a cursos
        </Button>

        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-8">
          <EmptyState
            title="Curso no encontrado"
            description="El curso que buscas no existe o fue eliminado."
            actionLabel="Ver todos los cursos"
            onAction={() => navigate('/my-courses')}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <CourseHeader
          course={course}
          canEdit={canEditCourse}
          canConfigureTemplate={canConfigureTemplate}
          onBack={navigateToCoursesPage}
          onEdit={() => modals.openModal('editCourse')}
        />

        {course.thumbnail && (
          <div className="mb-8 rounded-xl overflow-hidden shadow-lg">
            <img
              src={course.thumbnail}
              alt={course.title}
              className="w-full h-96 object-cover"
            />
          </div>
        )}

        <CourseTopicsList
          topics={topics || []}
          courseStatus={course.status}
          canEdit={canEditTopics}
          canManageContent={canAddResources}
          onAddTopic={
            canCreateTopics ? () => modals.openModal('createTopic') : undefined
          }
          onEditTopic={
            canEditTopics
              ? (topic) => modals.openModal('editTopic', topic)
              : undefined
          }
          onDeleteTopic={
            canDeleteTopics
              ? (topicId) => modals.openModal('deleteTopic', topicId)
              : undefined
          }
          onAddResource={
            canAddResources
              ? (topic) => modals.openModal('createResource', topic)
              : undefined
          }
          onEditResource={
            canEditResources
              ? (resource) => modals.openModal('editResource', resource)
              : undefined
          }
          onDeleteResource={
            canDeleteResources
              ? (resourceId) => modals.openModal('deleteResource', resourceId)
              : undefined
          }
        />

        <CourseInfo course={course} topicsCount={topics?.length || 0} />
      </motion.div>

      {canEditCourse && (
        <Modal
          isOpen={modals.isModalOpen('editCourse')}
          onClose={() => modals.closeModal('editCourse')}
          title="Editar Curso"
        >
          <CourseForm
            course={course}
            onSubmit={handleUpdateCourse}
            onCancel={() => modals.closeModal('editCourse')}
            isSubmitting={updateCourseMutation.isPending}
          />
        </Modal>
      )}

      {canCreateTopics && (
        <Modal
          isOpen={modals.isModalOpen('createTopic')}
          onClose={() => modals.closeModal('createTopic')}
          title="Crear Nuevo Tópico"
        >
          <TopicForm
            onSubmit={handleCreateTopic}
            onCancel={() => modals.closeModal('createTopic')}
            isSubmitting={topicActions.isCreating}
            nextOrder={topics?.length || 0}
          />
        </Modal>
      )}

      {canEditTopics && (
        <Modal
          isOpen={modals.isModalOpen('editTopic')}
          onClose={() => modals.closeModal('editTopic')}
          title="Editar Tópico"
        >
          {modals.getModalData<Topic>('editTopic') && (
            <TopicForm
              topic={modals.getModalData<Topic>('editTopic')!}
              onSubmit={handleUpdateTopic}
              onCancel={() => modals.closeModal('editTopic')}
              isSubmitting={topicActions.isUpdating}
            />
          )}
        </Modal>
      )}

      <Modal
        isOpen={modals.isModalOpen('deleteTopic')}
        onClose={() => modals.closeModal('deleteTopic')}
        title="Eliminar Tópico"
      >
        <div className="space-y-4">
          <p className="text-gray-600 dark:text-gray-400">
            ¿Estás seguro de que deseas eliminar este tópico? Esta acción no se
            puede deshacer y se eliminarán todos los recursos y actividades
            asociados.
          </p>
          <div className="flex justify-end space-x-3">
            <Button
              variant="outline"
              onClick={() => modals.closeModal('deleteTopic')}
              disabled={topicActions.isDeleting}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleDeleteTopic}
              disabled={topicActions.isDeleting}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {topicActions.isDeleting ? 'Eliminando...' : 'Eliminar'}
            </Button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={modals.isModalOpen('createResource')}
        onClose={() => modals.closeModal('createResource')}
        title="Agregar Recurso"
      >
        {modals.getModalData<Topic>('createResource') && (
          <ResourceForm
            topicId={modals.getModalData<Topic>('createResource')!.id}
            order={
              modals.getModalData<Topic>('createResource')!.resources?.length ||
              0
            }
            onSubmit={handleSubmitResource}
            onCancel={() => modals.closeModal('createResource')}
            isLoading={resourceActions.isCreating}
          />
        )}
      </Modal>

      <Modal
        isOpen={modals.isModalOpen('editResource')}
        onClose={() => modals.closeModal('editResource')}
        title="Editar Recurso"
      >
        {modals.getModalData<Resource>('editResource') && (
          <ResourceForm
            topicId={modals.getModalData<Resource>('editResource')!.topicId}
            order={modals.getModalData<Resource>('editResource')!.order}
            initialData={{
              title: modals.getModalData<Resource>('editResource')!.title,
              description:
                modals.getModalData<Resource>('editResource')!.description,
              type: modals.getModalData<Resource>('editResource')!.type,
              url: modals.getModalData<Resource>('editResource')!.url,
              order: modals.getModalData<Resource>('editResource')!.order,
            }}
            onSubmit={handleUpdateResource}
            onCancel={() => modals.closeModal('editResource')}
            isLoading={resourceActions.isUpdating}
          />
        )}
      </Modal>

      <Modal
        isOpen={modals.isModalOpen('deleteResource')}
        onClose={() => modals.closeModal('deleteResource')}
        title="Eliminar Recurso"
      >
        <div className="space-y-4">
          <p className="text-gray-600 dark:text-gray-400">
            ¿Estás seguro de que deseas eliminar este recurso? Esta acción no se
            puede deshacer.
          </p>
          <div className="flex justify-end space-x-3">
            <Button
              variant="outline"
              onClick={() => modals.closeModal('deleteResource')}
              disabled={resourceActions.isDeleting}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleDeleteResource}
              disabled={resourceActions.isDeleting}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {resourceActions.isDeleting ? 'Eliminando...' : 'Eliminar'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
