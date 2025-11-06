import type { Resource, Activity } from '@/features/courses/types/course.types';

export interface Topic {
  id: string;
  title: string;
  description?: string;
  order: number;
  isActive: boolean;
  courseId: string;
  resources?: Resource[];
  activities?: Activity[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateTopicRequest {
  title: string;
  description?: string;
  order: number; 
}

export interface UpdateTopicRequest {
  title?: string;
  description?: string;
  order?: number;
  isActive?: boolean;
}

export interface ReorderTopicsRequest {
  topics: {
    id: string;
    order: number;
  }[];
}
