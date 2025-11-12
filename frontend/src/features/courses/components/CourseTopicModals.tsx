import React from 'react';
import { Modal } from '@/shared/components/ui/Modal';
import { Button } from '@/shared/components/ui';
import { TopicForm, type Topic, type CreateTopicFormData, type UpdateTopicFormData } from '@/features/topics';

interface CourseTopicModalsProps {
  topics: Topic[];
  isCreateOpen: boolean;
  isEditOpen: boolean;
  isDeleteOpen: boolean;
  onCloseCreate: () => void;
  onCloseEdit: () => void;
  onCloseDelete: () => void;
  onSubmitCreate: (data: CreateTopicFormData | UpdateTopicFormData) => void;
  onSubmitEdit: (data: CreateTopicFormData | UpdateTopicFormData) => void;
  onConfirmDelete: () => void;
  getEditData: () => Topic | null;
  isCreating: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
}

export const CourseTopicModals: React.FC<CourseTopicModalsProps> = ({
  topics,
  isCreateOpen,
  isEditOpen,
  isDeleteOpen,
  onCloseCreate,
  onCloseEdit,
  onCloseDelete,
  onSubmitCreate,
  onSubmitEdit,
  onConfirmDelete,
  getEditData,
  isCreating,
  isUpdating,
  isDeleting,
}) => {
  const editTopic = getEditData();

  return (
    <>
      <Modal isOpen={isCreateOpen} onClose={onCloseCreate} title="Crear Nuevo Tópico">
        <TopicForm
          onSubmit={onSubmitCreate}
          onCancel={onCloseCreate}
          isSubmitting={isCreating}
          nextOrder={topics?.length || 0}
        />
      </Modal>

      <Modal isOpen={isEditOpen} onClose={onCloseEdit} title="Editar Tópico">
        {editTopic && (
          <TopicForm
            topic={editTopic}
            onSubmit={onSubmitEdit}
            onCancel={onCloseEdit}
            isSubmitting={isUpdating}
          />
        )}
      </Modal>

      <Modal isOpen={isDeleteOpen} onClose={onCloseDelete} title="Eliminar Tópico">
        <div className="space-y-4">
          <p className="text-gray-600 dark:text-gray-400">
            ¿Estás seguro de que deseas eliminar este tópico? Esta acción no se puede
            deshacer y se eliminarán todos los recursos y actividades asociados.
          </p>
          <div className="flex justify-end space-x-3">
            <Button variant="outline" onClick={onCloseDelete} disabled={isDeleting}>
              Cancelar
            </Button>
            <Button
              onClick={onConfirmDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {isDeleting ? 'Eliminando...' : 'Eliminar'}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};
