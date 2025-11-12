import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { groupService } from '../services/group.service';
import type {
  CreateGroupRequest,
  UpdateGroupRequest,
} from '../types/group.types';

export const GROUP_QUERY_KEYS = {
  byEdition: (editionId: string) => ['groups', editionId] as const,
};

export const useGroups = (editionId?: string) => {
  return useQuery({
    queryKey: editionId
      ? GROUP_QUERY_KEYS.byEdition(editionId)
      : ['groups', 'none'],
    queryFn: editionId
      ? () => groupService.listByEdition(editionId)
      : undefined,
    enabled: !!editionId,
  });
};

export const useCreateGroup = (editionId?: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateGroupRequest) => {
      if (!editionId) {
        throw new Error('No edition id provided');
      }
      return groupService.createGroup(editionId, data);
    },
    onSuccess: (group) => {
      if (editionId) {
        queryClient.invalidateQueries({
          queryKey: GROUP_QUERY_KEYS.byEdition(editionId),
        });
      }
      toast.success('Grupo creado correctamente');
      return group;
    },
    onError: () => {
      toast.error('No se pudo crear el grupo');
    },
  });
};

export const useUpdateGroup = (editionId?: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      groupId,
      data,
    }: {
      groupId: string;
      data: UpdateGroupRequest;
    }) => {
      if (!editionId) {
        throw new Error('No edition id provided');
      }
      return groupService.updateGroup(editionId, groupId, data);
    },
    onSuccess: (group) => {
      if (editionId) {
        queryClient.invalidateQueries({
          queryKey: GROUP_QUERY_KEYS.byEdition(editionId),
        });
      }
      toast.success('Grupo actualizado');
      return group;
    },
    onError: () => {
      toast.error('No se pudo actualizar el grupo');
    },
  });
};

export const useDeleteGroup = (editionId?: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (groupId: string) => {
      if (!editionId) {
        throw new Error('No edition id provided');
      }
      return groupService.deleteGroup(editionId, groupId);
    },
    onSuccess: () => {
      if (editionId) {
        queryClient.invalidateQueries({
          queryKey: GROUP_QUERY_KEYS.byEdition(editionId),
        });
      }
      toast.success('Grupo eliminado');
    },
    onError: () => {
      toast.error('No se pudo eliminar el grupo');
    },
  });
};
