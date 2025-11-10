import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { editionService } from '../services/edition.service';
import type {
  CreateEditionRequest,
  ChangeEditionStatusRequest,
  UpdateEditionRequest,
} from '../types/edition.types';

export const EDITION_QUERY_KEYS = {
  all: ['editions'] as const,
  byBlueprint: (blueprintId: string) =>
    ['editions', 'blueprint', blueprintId] as const,
  detail: (editionId: string) => ['editions', editionId] as const,
};

export const useEditionsByBlueprint = (blueprintId?: string) => {
  return useQuery({
    queryKey: blueprintId
      ? EDITION_QUERY_KEYS.byBlueprint(blueprintId)
      : EDITION_QUERY_KEYS.all,
    queryFn: blueprintId
      ? () => editionService.listByBlueprint(blueprintId)
      : undefined,
    enabled: !!blueprintId,
  });
};

export const useEdition = (editionId?: string) => {
  return useQuery({
    queryKey: editionId ? EDITION_QUERY_KEYS.detail(editionId) : ['editions'],
    queryFn: editionId ? () => editionService.getEdition(editionId) : undefined,
    enabled: !!editionId,
  });
};

export const useCreateEdition = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateEditionRequest) =>
      editionService.createEdition(data),
    onSuccess: (edition, variables) => {
      queryClient.invalidateQueries({
        queryKey: EDITION_QUERY_KEYS.byBlueprint(variables.blueprintId),
      });
      queryClient.invalidateQueries({
        queryKey: EDITION_QUERY_KEYS.detail(edition.id),
      });
      toast.success('Edición creada correctamente');
    },
    onError: (error: unknown) => {
      const message =
        typeof error === 'object' &&
        error !== null &&
        'response' in error &&
        error.response &&
        typeof error.response === 'object' &&
        'data' in error.response &&
        error.response.data &&
        typeof error.response.data === 'object' &&
        'message' in error.response.data
          ? (error.response.data.message as string)
          : 'No se pudo crear la edición';
      toast.error(message);
    },
  });
};

export const useUpdateEdition = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      editionId,
      data,
    }: {
      editionId: string;
      data: UpdateEditionRequest;
    }) => editionService.updateEdition(editionId, data),
    onSuccess: (edition) => {
      queryClient.invalidateQueries({
        queryKey: EDITION_QUERY_KEYS.detail(edition.id),
      });
      if (edition.blueprintId) {
        queryClient.invalidateQueries({
          queryKey: EDITION_QUERY_KEYS.byBlueprint(edition.blueprintId),
        });
      }
      toast.success('Edición actualizada');
    },
    onError: () => {
      toast.error('No se pudo actualizar la edición');
    },
  });
};

export const useChangeEditionStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      editionId,
      data,
    }: {
      editionId: string;
      data: ChangeEditionStatusRequest;
    }) => editionService.changeEditionStatus(editionId, data),
    onSuccess: (edition) => {
      queryClient.invalidateQueries({
        queryKey: EDITION_QUERY_KEYS.detail(edition.id),
      });
      if (edition.blueprintId) {
        queryClient.invalidateQueries({
          queryKey: EDITION_QUERY_KEYS.byBlueprint(edition.blueprintId),
        });
      }
      toast.success('Estado de la edición actualizado');
    },
    onError: () => {
      toast.error('No se pudo actualizar el estado de la edición');
    },
  });
};
