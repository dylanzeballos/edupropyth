import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { courseService } from '../services/course.service';
import type {
  CreateCourseRequest,
  UpdateCourseRequest,
} from '../types/course.types';

export const COURSE_QUERY_KEYS = {
  course: ['course'] as const,
};

/**
 * Hook para obtener el curso
 */
export const useCourse = () => {
  return useQuery({
    queryKey: COURSE_QUERY_KEYS.course,
    queryFn: courseService.getCourse,
    retry: (failureCount, error: any) => {
      // No reintentar si es 404 (curso no creado aún)
      if (error?.response?.status === 404) {
        return false;
      }
      return failureCount < 3;
    },
  });
};

/**
 * Hook para crear el curso
 */
export const useCreateCourse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCourseRequest) =>
      courseService.createCourse(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: COURSE_QUERY_KEYS.course });
      toast.success('Curso creado exitosamente');
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message || 'Error al crear el curso';
      toast.error(message);
    },
  });
};

/**
 * Hook para actualizar el curso
 */
export const useUpdateCourse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateCourseRequest) =>
      courseService.updateCourse(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: COURSE_QUERY_KEYS.course });
      toast.success('Curso actualizado exitosamente');
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message || 'Error al actualizar el curso';
      toast.error(message);
    },
  });
};
