import { apiClient } from '@/lib/api';
import type {
  Course,
  CreateCourseRequest,
  UpdateCourseRequest,
} from '../types/course.types';

export const courseService = {
  /**
   * Crea el curso único del sistema
   */
  createCourse: async (data: CreateCourseRequest): Promise<Course> => {
    const response = await apiClient.post<Course>('/courses', data);
    return response.data;
  },

  /**
   * Obtiene el curso con todos sus tópicos
   */
  getCourse: async (): Promise<Course> => {
    const response = await apiClient.get<Course>('/courses');
    return response.data;
  },

  /**
   * Actualiza el curso existente
   */
  updateCourse: async (data: UpdateCourseRequest): Promise<Course> => {
    const response = await apiClient.patch<Course>('/courses', data);
    return response.data;
  },
};
