import { apiClient } from '@/lib/api';
import type {
  Topic,
  CreateTopicRequest,
  UpdateTopicRequest,
  ReorderTopicsRequest,
} from '../types/topic.types';

export const topicService = {
  getTopics: async (courseId: string): Promise<Topic[]> => {
    const response = await apiClient.get<{ topics: Topic[] }>(`/courses/${courseId}`);
    return response.data.topics || [];
  },

  getTopic: async (courseId: string, topicId: string): Promise<Topic> => {
    const course = await apiClient.get<{ topics: Topic[] }>(`/courses/${courseId}`);
    const topic = course.data.topics?.find(t => t.id === topicId);
    if (!topic) {
      throw new Error('Topic not found');
    }
    return topic;
  },

  createTopic: async (
    courseId: string,
    data: CreateTopicRequest
  ): Promise<Topic> => {
    const response = await apiClient.post<Topic>(
      '/topics',
      { ...data, courseId }
    );
    return response.data;
  },

  updateTopic: async (
    topicId: string,
    data: UpdateTopicRequest
  ): Promise<Topic> => {
    const response = await apiClient.put<Topic>(
      `/topics/${topicId}`,
      data
    );
    return response.data;
  },

  deleteTopic: async (topicId: string): Promise<void> => {
    await apiClient.delete(`/topics/${topicId}`);
  },

  reorderTopics: async (
    courseId: string,
    data: ReorderTopicsRequest
  ): Promise<void> => {
    await apiClient.put(
      `/topics/courses/${courseId}/reorder`,
      data
    );
  },

  cloneTopicToHistoric: async (
    courseId: string,
    topicId: string,
    targetCourseId: string
  ): Promise<Topic> => {
    const response = await apiClient.post<Topic>(
      `/topics/${topicId}/clone`,
      { targetCourseId, courseId }
    );
    return response.data;
  },
};
