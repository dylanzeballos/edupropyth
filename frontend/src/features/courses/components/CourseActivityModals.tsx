import React from 'react';
import { Modal } from '@/shared/components/ui/Modal';
import { Button } from '@/shared/components/ui';
import { ActivityForm, type Activity, type CreateActivityFormData } from '@/features/activities';
import type { Topic } from '@/features/topics';

interface CourseActivityModalsProps {
  isCreateOpen: boolean;
  isEditOpen: boolean;
  isDeleteOpen: boolean;
  onCloseCreate: () => void;
  onCloseEdit: () => void;
  onCloseDelete: () => void;
  onSubmitCreate: (data: CreateActivityFormData) => void;
  onSubmitEdit: (data: CreateActivityFormData) => void;
  onConfirmDelete: () => void;
  getCreateData: () => Topic | null;
  getEditData: () => Activity | null;
  isCreating: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
}

export const CourseActivityModals: React.FC<CourseActivityModalsProps> = ({
  isCreateOpen,
  isEditOpen,
  isDeleteOpen,
  onCloseCreate,
  onCloseEdit,
  onCloseDelete,
  onSubmitCreate,
  onSubmitEdit,
  onConfirmDelete,
  getCreateData,
  getEditData,
  isCreating,
  isUpdating,
  isDeleting,
}) => {
  const createTopic = getCreateData();
  const editActivity = getEditData();

  return (
    <>
      <Modal isOpen={isCreateOpen} onClose={onCloseCreate} title="Crear Nueva Actividad">
        {createTopic && (
          <ActivityForm
            topicId={createTopic.id}
            order={createTopic.activities?.length || 0}
            onSubmit={onSubmitCreate}
            onCancel={onCloseCreate}
            isSubmitting={isCreating}
          />
        )}
      </Modal>

      <Modal isOpen={isEditOpen} onClose={onCloseEdit} title="Editar Actividad">
        {editActivity && (
          <ActivityForm
            topicId={editActivity.topicId}
            order={editActivity.order}
            initialData={{
              title: editActivity.title,
              description: editActivity.description,
              type: editActivity.type,
              content: editActivity.content,
              dueDate: editActivity.dueDate,
              maxScore: editActivity.maxScore,
              isRequired: editActivity.isRequired,
            }}
            onSubmit={onSubmitEdit}
            onCancel={onCloseEdit}
            isSubmitting={isUpdating}
          />
        )}
      </Modal>

      <Modal isOpen={isDeleteOpen} onClose={onCloseDelete} title="Eliminar Actividad">
        <div className="space-y-4">
          <p className="text-gray-600 dark:text-gray-400">
            ¿Estás seguro de que deseas eliminar esta actividad? Esta acción no se puede
            deshacer y se eliminarán todas las entregas asociadas.
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
