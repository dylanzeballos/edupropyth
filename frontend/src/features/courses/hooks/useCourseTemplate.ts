import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  courseTemplateService,
  type CreateCourseTemplateDto,
  type UpdateCourseTemplateDto,
} from '../services/course-template.service';

const COURSE_TEMPLATE_QUERY_KEYS = {
  all: ['course-templates'] as const,
  template: (id: string) => [...COURSE_TEMPLATE_QUERY_KEYS.all, id] as const,
  byCourse: (courseId: string) =>
    [...COURSE_TEMPLATE_QUERY_KEYS.all, 'course', courseId] as const,
};

export const useCourseTemplate = (templateId?: string) => {
  return useQuery({
    queryKey: COURSE_TEMPLATE_QUERY_KEYS.template(templateId!),
    queryFn: () => courseTemplateService.getTemplateById(templateId!),
    enabled: !!templateId,
    staleTime: 1000 * 60 * 5,
  });
};

export const useCourseTemplateById = (courseId?: string) => {
  return useQuery({
    queryKey: COURSE_TEMPLATE_QUERY_KEYS.byCourse(courseId!),
    queryFn: () => courseTemplateService.getTemplateByCourseId(courseId!),
    enabled: !!courseId,
    staleTime: 1000 * 60 * 5,
  });
};

export const useCreateCourseTemplate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCourseTemplateDto) =>
      courseTemplateService.createTemplate(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: COURSE_TEMPLATE_QUERY_KEYS.all,
      });
      queryClient.invalidateQueries({
        queryKey: COURSE_TEMPLATE_QUERY_KEYS.byCourse(data.courseId),
      });
      toast.success('Template de curso creado exitosamente');
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message ||
        error.message ||
        'Error al crear el template';
      toast.error(message);
    },
  });
};

export const useUpdateCourseTemplate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      templateId,
      data,
    }: {
      templateId: string;
      data: UpdateCourseTemplateDto;
    }) => courseTemplateService.updateTemplate(templateId, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: COURSE_TEMPLATE_QUERY_KEYS.all,
      });
      queryClient.invalidateQueries({
        queryKey: COURSE_TEMPLATE_QUERY_KEYS.byCourse(data.courseId),
      });
      toast.success('Template actualizado exitosamente');
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message ||
        error.message ||
        'Error al actualizar el template';
      toast.error(message);
    },
  });
};

export const useUpdateCourseTemplateByCourseId = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      courseId,
      data,
    }: {
      courseId: string;
      data: UpdateCourseTemplateDto;
    }) => courseTemplateService.updateTemplateByCourseId(courseId, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: COURSE_TEMPLATE_QUERY_KEYS.all,
      });
      queryClient.invalidateQueries({
        queryKey: COURSE_TEMPLATE_QUERY_KEYS.byCourse(data.courseId),
      });
      toast.success('Template actualizado exitosamente');
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message ||
        error.message ||
        'Error al actualizar el template';
      toast.error(message);
    },
  });
};

export const useDeleteCourseTemplate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (templateId: string) =>
      courseTemplateService.deleteTemplate(templateId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: COURSE_TEMPLATE_QUERY_KEYS.all,
      });
      toast.success('Template eliminado exitosamente');
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message ||
        error.message ||
        'Error al eliminar el template';
      toast.error(message);
    },
  });
};

export const useDeleteCourseTemplateByCourseId = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (courseId: string) =>
      courseTemplateService.deleteTemplateByCourseId(courseId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: COURSE_TEMPLATE_QUERY_KEYS.all,
      });
      toast.success('Template eliminado exitosamente');
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message ||
        error.message ||
        'Error al eliminar el template';
      toast.error(message);
    },
  });
};
