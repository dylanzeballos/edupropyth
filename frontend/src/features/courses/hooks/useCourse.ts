import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { courseService } from '../services/course.service';
import type {
  CreateCourseRequest,
  UpdateCourseRequest,
} from '../types/course.types';

export const COURSE_QUERY_KEYS = {
  all: ['courses'] as const,
  course: (id: string) => ['courses', id] as const,
};

/**
 * Hook para obtener todos los cursos
 */
export const useCourses = () => {
  return useQuery({
    queryKey: COURSE_QUERY_KEYS.all,
    queryFn: courseService.getCourses,
  });
};

/**
 * Hook para obtener un curso específico
 */
export const useCourse = (id?: string) => {
  return useQuery({
    queryKey: id ? COURSE_QUERY_KEYS.course(id) : ['courses', 'none'],
    queryFn: id ? () => courseService.getCourse(id) : undefined,
    enabled: !!id,
    retry: (failureCount, error: unknown) => {
      // No reintentar si es 404 (curso no encontrado)
      if (
        error &&
        typeof error === 'object' &&
        'response' in error &&
        error.response &&
        typeof error.response === 'object' &&
        'status' in error.response &&
        error.response.status === 404
      ) {
        return false;
      }
      return failureCount < 3;
    },
  });
};

/**
 * Hook para crear un curso
 */
export const useCreateCourse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCourseRequest) =>
      courseService.createCourse(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: COURSE_QUERY_KEYS.all });
      toast.success('Curso creado exitosamente');
    },
    onError: (error: unknown) => {
      const message =
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
          ? error.response.data.message
          : 'Error al crear el curso';
      toast.error(message);
    },
  });
};

/**
 * Hook para actualizar un curso
 */
export const useUpdateCourse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCourseRequest }) =>
      courseService.updateCourse(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: COURSE_QUERY_KEYS.all });
      queryClient.invalidateQueries({ queryKey: COURSE_QUERY_KEYS.course(variables.id) });
      toast.success('Curso actualizado exitosamente');
    },
    onError: (error: unknown) => {
      const message =
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
          ? error.response.data.message
          : 'Error al actualizar el curso';
      toast.error(message);
    },
  });
};
