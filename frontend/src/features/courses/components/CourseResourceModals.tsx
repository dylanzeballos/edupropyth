import React from 'react';
import { Modal } from '@/shared/components/ui/Modal';
import { Button } from '@/shared/components/ui';
import { ResourceForm, type Resource, type UploadResourceRequest, type CreateResourceRequest } from '@/features/resources';
import type { Topic } from '@/features/topics';

interface CourseResourceModalsProps {
  isCreateOpen: boolean;
  isEditOpen: boolean;
  isDeleteOpen: boolean;
  onCloseCreate: () => void;
  onCloseEdit: () => void;
  onCloseDelete: () => void;
  onSubmitCreate: (data: UploadResourceRequest | CreateResourceRequest) => void;
  onSubmitEdit: (data: UploadResourceRequest | CreateResourceRequest) => void;
  onConfirmDelete: () => void;
  getCreateData: () => Topic | null;
  getEditData: () => Resource | null;
  isCreating: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
}

export const CourseResourceModals: React.FC<CourseResourceModalsProps> = ({
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
  const editResource = getEditData();

  return (
    <>
      <Modal isOpen={isCreateOpen} onClose={onCloseCreate} title="Agregar Recurso">
        {createTopic && (
          <ResourceForm
            topicId={createTopic.id}
            order={createTopic.resources?.length || 0}
            onSubmit={onSubmitCreate}
            onCancel={onCloseCreate}
            isLoading={isCreating}
          />
        )}
      </Modal>

      <Modal isOpen={isEditOpen} onClose={onCloseEdit} title="Editar Recurso">
        {editResource && (
          <ResourceForm
            topicId={editResource.topicId}
            order={editResource.order}
            initialData={{
              title: editResource.title,
              description: editResource.description,
              type: editResource.type,
              url: editResource.url,
              order: editResource.order,
            }}
            onSubmit={onSubmitEdit}
            onCancel={onCloseEdit}
            isLoading={isUpdating}
          />
        )}
      </Modal>

      <Modal isOpen={isDeleteOpen} onClose={onCloseDelete} title="Eliminar Recurso">
        <div className="space-y-4">
          <p className="text-gray-600 dark:text-gray-400">
            ¿Estás seguro de que deseas eliminar este recurso? Esta acción no se puede deshacer.
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
