import type { ResourceType } from '@/features/courses/types/course.types';

export interface Resource {
  id: string;
  title: string;
  description?: string;
  type: ResourceType;
  url: string;
  publicId?: string;
  metadata?: Record<string, unknown>;
  order: number;
  topicId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateResourceRequest {
  topicId: string;
  title: string;
  description?: string;
  type: ResourceType;
  url: string;
  publicId?: string;
  metadata?: Record<string, unknown>;
  order: number;
}

export interface UploadResourceRequest {
  topicId: string;
  title: string;
  description?: string;
  type: ResourceType;
  order: number;
  file: File;
}

export interface UpdateResourceRequest {
  title?: string;
  description?: string;
  type?: ResourceType;
  url?: string;
  order?: number;
  metadata?: Record<string, unknown>;
}
