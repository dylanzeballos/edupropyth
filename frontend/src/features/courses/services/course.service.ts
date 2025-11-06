import { apiClient } from '@/lib/api';
import type {
  Course,
  CreateCourseRequest,
  UpdateCourseRequest,
} from '../types/course.types';

export const courseService = {
  createCourse: async (data: CreateCourseRequest): Promise<Course> => {
    const response = await apiClient.post<Course>('/courses', data);
    return response.data;
  },

  getCourses: async (): Promise<Course[]> => {
    const response = await apiClient.get<Course[]>('/courses');
    return response.data;
  },

  getCourse: async (id: string): Promise<Course> => {
    const response = await apiClient.get<Course>(`/courses/${id}`);
    return response.data;
  },

  updateCourse: async (id: string, data: UpdateCourseRequest): Promise<Course> => {
    const response = await apiClient.patch<Course>(`/courses/${id}`, data);
    return response.data;
  },
};
