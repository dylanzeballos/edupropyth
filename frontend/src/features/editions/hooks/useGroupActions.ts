import type { GroupFormData } from '@/features/groups/validation/group.schema';
import type { Group } from '@/features/groups/types/group.types';
import {
  useCreateGroup,
  useUpdateGroup,
  useDeleteGroup,
} from '@/features/groups/hooks/useGroups';

interface UseGroupActionsProps {
  editionId?: string;
  modals: {
    getModalData: <T>(modalName: string) => T | null;
    closeModal: (modalName: string) => void;
  };
}

export const useGroupActions = ({ editionId, modals }: UseGroupActionsProps) => {
  const createGroupMutation = useCreateGroup(editionId);
  const updateGroupMutation = useUpdateGroup(editionId);
  const deleteGroupMutation = useDeleteGroup(editionId);

  const handleCreateGroup = (data: GroupFormData) => {
    createGroupMutation.mutate(
      {
        name: data.name,
        schedule: data.schedule?.trim() || undefined,
        instructorId: data.instructorId?.trim() || undefined,
        maxStudents: data.maxStudents || undefined,
        enrollmentKey: data.enrollmentKey?.trim() || undefined,
        isEnrollmentOpen: data.isEnrollmentOpen ?? true,
        enrollmentStartDate: data.enrollmentStartDate?.trim() || undefined,
        enrollmentEndDate: data.enrollmentEndDate?.trim() || undefined,
      },
      {
        onSuccess: () => modals.closeModal('createGroup'),
      },
    );
  };

  const handleUpdateGroup = (data: GroupFormData) => {
    const group = modals.getModalData<Group>('editGroup');
    if (!group) return;
    
    updateGroupMutation.mutate(
      {
        groupId: group.id,
        data: {
          name: data.name,
          schedule: data.schedule?.trim() || undefined,
          isActive: data.isActive,
          instructorId: data.instructorId?.trim() || undefined,
          maxStudents: data.maxStudents || undefined,
          enrollmentKey: data.enrollmentKey?.trim() || undefined,
          isEnrollmentOpen: data.isEnrollmentOpen ?? true,
          enrollmentStartDate: data.enrollmentStartDate?.trim() || undefined,
          enrollmentEndDate: data.enrollmentEndDate?.trim() || undefined,
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

  return {
    handleCreateGroup,
    handleUpdateGroup,
    handleDeleteGroup,
    isCreating: createGroupMutation.isPending,
    isUpdating: updateGroupMutation.isPending,
    isDeleting: deleteGroupMutation.isPending,
  };
};