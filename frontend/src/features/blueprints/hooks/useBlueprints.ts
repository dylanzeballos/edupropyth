import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { blueprintService } from '../services/blueprint.service';
import type {
  CreateBlueprintRequest,
  UpdateBlueprintRequest,
} from '../types/blueprint.types';

export const BLUEPRINT_QUERY_KEYS = {
  all: ['blueprints'] as const,
  detail: (id: string) => ['blueprints', id] as const,
};

export const useBlueprints = () => {
  return useQuery({
    queryKey: BLUEPRINT_QUERY_KEYS.all,
    queryFn: blueprintService.list,
  });
};

export const useBlueprint = (id?: string) => {
  return useQuery({
    queryKey: id ? BLUEPRINT_QUERY_KEYS.detail(id) : ['blueprints', 'detail'],
    queryFn: id ? () => blueprintService.getById(id) : undefined,
    enabled: !!id,
  });
};

export const useCreateBlueprint = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateBlueprintRequest) => blueprintService.create(data),
    onSuccess: (blueprint) => {
      queryClient.invalidateQueries({ queryKey: BLUEPRINT_QUERY_KEYS.all });
      toast.success('Blueprint creado correctamente');
      return blueprint;
    },
    onError: () => {
      toast.error('No se pudo crear el blueprint');
    },
  });
};

export const useUpdateBlueprint = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateBlueprintRequest }) =>
      blueprintService.update(id, data),
    onSuccess: (blueprint) => {
      queryClient.invalidateQueries({ queryKey: BLUEPRINT_QUERY_KEYS.all });
      queryClient.invalidateQueries({
        queryKey: BLUEPRINT_QUERY_KEYS.detail(blueprint.id),
      });
      toast.success('Blueprint actualizado');
    },
    onError: () => {
      toast.error('No se pudo actualizar el blueprint');
    },
  });
};
