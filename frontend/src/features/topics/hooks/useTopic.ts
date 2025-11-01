import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { topicService } from '../services/topic.service';
import type {
  CreateTopicRequest,
  UpdateTopicRequest,
  ReorderTopicsRequest,
} from '../types/topic.types';
import { toast } from 'sonner';

const getErrorMessage = (error: unknown, defaultMessage: string): string => {
  if (
    error &&
    typeof error === 'object' &&
    'response' in error &&
    error.response &&
    typeof error.response === 'object' &&
    'data' in error.response &&
    error.response.data &&
    typeof error.response.data === 'object' &&
    'message' in error.response.data &&
    typeof error.response.data.message === 'string'
  ) {
    return error.response.data.message;
  }
  return defaultMessage;
};

export const TOPIC_QUERY_KEYS = {
  all: (courseId: string) => ['courses', courseId, 'topics'] as const,
  topic: (courseId: string, topicId: string) =>
    ['courses', courseId, 'topics', topicId] as const,
};

export const useTopics = (courseId: string) => {
  return useQuery({
    queryKey: TOPIC_QUERY_KEYS.all(courseId),
    queryFn: () => topicService.getTopics(courseId),
    enabled: !!courseId,
  });
};

export const useTopic = (courseId: string, topicId: string) => {
  return useQuery({
    queryKey: TOPIC_QUERY_KEYS.topic(courseId, topicId),
    queryFn: () => topicService.getTopic(courseId, topicId),
    enabled: !!courseId && !!topicId,
  });
};

export const useCreateTopic = (courseId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateTopicRequest) =>
      topicService.createTopic(courseId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: TOPIC_QUERY_KEYS.all(courseId),
      });
      queryClient.invalidateQueries({ queryKey: ['courses', courseId] });
      toast.success('Tema creado exitosamente');
    },
    onError: (error: unknown) => {
      toast.error(getErrorMessage(error, 'Error al crear el tema'));
    },
  });
};

export const useUpdateTopic = (courseId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      topicId,
      data,
    }: {
      topicId: string;
      data: UpdateTopicRequest;
    }) => topicService.updateTopic(topicId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: TOPIC_QUERY_KEYS.all(courseId),
      });
      queryClient.invalidateQueries({
        queryKey: TOPIC_QUERY_KEYS.topic(courseId, variables.topicId),
      });
      queryClient.invalidateQueries({ queryKey: ['courses', courseId] });
      toast.success('Tema actualizado exitosamente');
    },
    onError: (error: unknown) => {
      toast.error(getErrorMessage(error, 'Error al actualizar el tema'));
    },
  });
};

export const useDeleteTopic = (courseId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (topicId: string) => topicService.deleteTopic(topicId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: TOPIC_QUERY_KEYS.all(courseId),
      });
      queryClient.invalidateQueries({ queryKey: ['courses', courseId] });
      toast.success('Tema eliminado exitosamente');
    },
    onError: (error: unknown) => {
      toast.error(getErrorMessage(error, 'Error al eliminar el tema'));
    },
  });
};

export const useReorderTopics = (courseId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ReorderTopicsRequest) =>
      topicService.reorderTopics(courseId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: TOPIC_QUERY_KEYS.all(courseId),
      });
      queryClient.invalidateQueries({ queryKey: ['courses', courseId] });
      toast.success('Temas reordenados exitosamente');
    },
    onError: (error: unknown) => {
      toast.error(getErrorMessage(error, 'Error al reordenar los temas'));
    },
  });
};

export const useCloneTopicToHistoric = (courseId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      topicId,
      targetCourseId,
    }: {
      topicId: string;
      targetCourseId: string;
    }) => topicService.cloneTopicToHistoric(courseId, topicId, targetCourseId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: TOPIC_QUERY_KEYS.all(variables.targetCourseId),
      });
      queryClient.invalidateQueries({
        queryKey: ['courses', variables.targetCourseId],
      });
      toast.success('Tema clonado exitosamente al curso histórico');
    },
    onError: (error: unknown) => {
      toast.error(getErrorMessage(error, 'Error al clonar el tema'));
    },
  });
};
