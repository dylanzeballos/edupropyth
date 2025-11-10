import type { Course } from '@/features/courses/types/course.types';
import type { Blueprint } from '../types/blueprint.types';

export const blueprintToCourseLike = (blueprint: Blueprint): Course => ({
  id: blueprint.id,
  title: blueprint.title,
  description: blueprint.description,
  thumbnail: blueprint.thumbnail,
  status: blueprint.isActive ? 'active' : 'draft',
  instructorId: undefined,
  isActive: blueprint.isActive,
  clonedFromId: undefined,
  topics: [],
  createdAt: blueprint.createdAt,
  updatedAt: blueprint.updatedAt,
});
