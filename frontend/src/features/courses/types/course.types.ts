import type { Activity as ActivityType } from '@/features/activities';

export type CourseStatus = 'draft' | 'active' | 'historic';

export type ResourceType = 'slide' | 'video' | 'audio' | 'document' | 'link';

export interface Resource {
  id: string;
  topicId: string;
  title: string;
  description?: string;
  type: ResourceType;
  url: string;
  publicId?: string;
  metadata?: Record<string, unknown>;
  order: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export type Activity = ActivityType;

export interface Topic {
  id: string;
  courseId: string;
  title: string;
  description?: string;
  order: number;
  isActive: boolean;
  resources?: Resource[];
  activities?: Activity[];
  createdAt: string;
  updatedAt: string;
}

export interface Course {
  id: string;
  title: string;
  description?: string;
  thumbnail?: string;
  status: CourseStatus;
  instructorId?: string;
  isActive: boolean;
  clonedFromId?: string;
  topics?: Topic[];
  createdAt: string;
  updatedAt: string;
  editionsCount?: number;
  draftEditionsCount?: number;
  activeEditionsCount?: number;
  historicEditionsCount?: number;
}

export interface CreateCourseRequest {
  title: string;
  description?: string;
  thumbnail?: string;
}

export interface UpdateCourseRequest extends Partial<CreateCourseRequest> {
  isActive?: boolean;
  status?: CourseStatus;
}
