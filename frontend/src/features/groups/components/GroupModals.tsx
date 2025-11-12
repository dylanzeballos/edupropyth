import { Modal, Button } from '@/shared/components/ui';
import { GroupForm } from './GroupForm';
import type { Group } from '../types/group.types';
import type { GroupFormData } from '../validation/group.schema';

interface GroupModalsProps {
  isCreateOpen: boolean;
  isEditOpen: boolean;
  isDeleteOpen: boolean;
  onCloseCreate: () => void;
  onCloseEdit: () => void;
  onCloseDelete: () => void;
  onSubmitCreate: (data: GroupFormData) => void;
  onSubmitEdit: (data: GroupFormData) => void;
  onConfirmDelete: () => void;
  getEditData?: () => Group | undefined;
  isCreating: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
}

export const GroupModals = ({
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
}: GroupModalsProps) => {
  const editGroup = getEditData?.();

  return (
    <>
      <Modal
        isOpen={isCreateOpen}
        onClose={onCloseCreate}
        title="Crear grupo"
      >
        <GroupForm
          onSubmit={onSubmitCreate}
          onCancel={onCloseCreate}
          isSubmitting={isCreating}
        />
      </Modal>

      <Modal
        isOpen={isEditOpen}
        onClose={onCloseEdit}
        title="Editar grupo"
      >
        <GroupForm
          defaultValues={{
            ...(editGroup ?? {}),
            instructorId: editGroup?.instructorId || '',
          }}
          onSubmit={onSubmitEdit}
          onCancel={onCloseEdit}
          isSubmitting={isUpdating}
          showStatusToggle
        />
      </Modal>

      <Modal
        isOpen={isDeleteOpen}
        onClose={onCloseDelete}
        title="Eliminar grupo"
      >
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          ¿Seguro que deseas eliminar este grupo? Esta acción no se puede deshacer.
        </p>
        <div className="flex justify-end gap-3">
          <Button
            variant="outline"
            onClick={onCloseDelete}
            disabled={isDeleting}
          >
            Cancelar
          </Button>
          <Button
            variant="destructive"
            onClick={onConfirmDelete}
            disabled={isDeleting}
          >
            Eliminar
          </Button>
        </div>
      </Modal>
    </>
  );
};