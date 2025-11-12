import type { Course } from '@/features/courses/types/course.types';
import type { Group } from '@/features/groups/types/group.types';

export interface Edition extends Course {
  blueprintId?: string;
  groups?: Group[];
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
  status: 'draft' | 'active' | 'historic';
}
