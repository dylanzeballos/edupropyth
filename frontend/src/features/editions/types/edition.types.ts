import type { Course } from '@/features/courses/types/course.types';

export interface Edition extends Course {
  blueprintId?: string;
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
