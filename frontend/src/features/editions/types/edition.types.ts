import type { CourseStatus, Topic } from '@/features/courses/types/course.types';

export interface Edition {
  id: string;
  title: string;
  description?: string;
  thumbnail?: string;
  status: CourseStatus;
  instructorId?: string;
  isActive: boolean;
  clonedFromId?: string;
  blueprintId?: string;
  topics?: Topic[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateEditionRequest {
  blueprintId: string;
  title: string;
  description?: string;
  thumbnail?: string;
  instructorId?: string;
  sourceCourseId?: string;
}

export interface UpdateEditionRequest {
  title?: string;
  description?: string;
  thumbnail?: string;
  instructorId?: string | null;
  isActive?: boolean;
}

export interface ChangeEditionStatusRequest {
  status: 'draft' | 'active';
}
