import { apiClient } from '@/lib/api';

export interface ContentBlock {
  id: string;
  type: 'html' | 'video' | 'resource' | 'document' | 'activities' | 'audio';
  layout:
    | 'full'
    | 'half'
    | 'third'
    | 'two-thirds'
    | 'quarter'
    | 'three-quarters';
  order: number;
  position?: {
    x: number;
    y: number;
    w: number;
    h: number;
  };
  content: {
    html?: string;
    videoUrl?: string;
    resourceIds?: string[];
    activityIds?: string[];
    documentUrl?: string;
    title?: string;
    description?: string;
  };
  style?: {
    backgroundColor?: string;
    padding?: string;
    borderRadius?: string;
  };
}

export interface CourseTemplate {
  id: string;
  courseId: string;
  blocks: ContentBlock[];
  createdBy: string;
  updatedBy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCourseTemplateDto {
  courseId: string;
  blocks: Omit<ContentBlock, 'id'>[];
}

export interface UpdateCourseTemplateDto {
  blocks?: Omit<ContentBlock, 'id'>[];
}

export const courseTemplateService = {
  getTemplateById: async (templateId: string): Promise<CourseTemplate> => {
    const response = await apiClient.get<CourseTemplate>(
      `/course-templates/${templateId}`,
    );
    return response.data;
  },

  getTemplateByCourseId: async (
    courseId: string,
  ): Promise<CourseTemplate | null> => {
    try {
      const response = await apiClient.get<CourseTemplate>(
        `/course-templates/course/${courseId}`,
      );
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        return null;
      }
      throw error;
    }
  },

  createTemplate: async (
    data: CreateCourseTemplateDto,
  ): Promise<CourseTemplate> => {
    const response = await apiClient.post<CourseTemplate>(
      '/course-templates',
      data,
    );
    return response.data;
  },

  updateTemplate: async (
    templateId: string,
    data: UpdateCourseTemplateDto,
  ): Promise<CourseTemplate> => {
    const response = await apiClient.put<CourseTemplate>(
      `/course-templates/${templateId}`,
      data,
    );
    return response.data;
  },

  updateTemplateByCourseId: async (
    courseId: string,
    data: UpdateCourseTemplateDto,
  ): Promise<CourseTemplate> => {
    const response = await apiClient.put<CourseTemplate>(
      `/course-templates/course/${courseId}`,
      data,
    );
    return response.data;
  },

  deleteTemplate: async (templateId: string): Promise<void> => {
    await apiClient.delete(`/course-templates/${templateId}`);
  },

  deleteTemplateByCourseId: async (courseId: string): Promise<void> => {
    await apiClient.delete(`/course-templates/course/${courseId}`);
  },

  createDefaultTemplate: async (courseId: string): Promise<CourseTemplate> => {
    const response = await apiClient.post<CourseTemplate>(
      `/course-templates/default/${courseId}`,
    );
    return response.data;
  },
};
