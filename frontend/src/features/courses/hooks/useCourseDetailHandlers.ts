import { useNavigate } from 'react-router';
import {
  useCreateEdition,
  useChangeEditionStatus,
} from '@/features/editions';
import { useUpdateBlueprint } from '@/features/blueprints';
import { useModals } from '@/shared/hooks/useModalState';
import type { UpdateBlueprintRequest } from '@/features/blueprints';
import type { CreateEditionFormData } from '@/features/editions/validation/edition.schema';
import type { UpdateCourseFormData } from '../validation/course.schema';

interface UseCourseDetailHandlersProps {
  blueprintId?: string;
}

export const useCourseDetailHandlers = ({ blueprintId }: UseCourseDetailHandlersProps) => {
  const navigate = useNavigate();
  const modals = useModals();
  const updateBlueprintMutation = useUpdateBlueprint();
  const createEditionMutation = useCreateEdition();
  const changeEditionStatusMutation = useChangeEditionStatus();

  const handleUpdateCourse = (data: UpdateCourseFormData) => {
    if (!blueprintId) return;
    updateBlueprintMutation.mutate(
      { id: blueprintId, data: data as UpdateBlueprintRequest },
      { onSuccess: () => modals.closeModal('editCourse') },
    );
  };

  const handleCreateEdition = (data: CreateEditionFormData) => {
    if (!blueprintId) return;
    createEditionMutation.mutate(
      {
        blueprintId,
        title: data.title,
        description: data.description?.trim() ? data.description : undefined,
        thumbnail: data.thumbnail?.trim() ? data.thumbnail : undefined,
        sourceCourseId: data.sourceCourseId || undefined,
      },
      {
        onSuccess: () => modals.closeModal('createEdition'),
      },
    );
  };

  const handleManageEdition = (editionId: string) => {
    navigate(`/editions/${editionId}`);
  };

  const handleChangeEditionStatus = (editionId: string, status: 'draft' | 'active' | 'historic') => {
    changeEditionStatusMutation.mutate({
      editionId,
      data: { status },
    });
  };

  return {
    handleUpdateCourse,
    handleCreateEdition,
    handleManageEdition,
    handleChangeEditionStatus,
    isUpdatingBlueprint: updateBlueprintMutation.isPending,
    isCreatingEdition: createEditionMutation.isPending,
    isChangingStatus: changeEditionStatusMutation.isPending,
  };
};