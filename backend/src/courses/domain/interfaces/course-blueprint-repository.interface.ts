import { CourseBlueprint } from '../entities/course-blueprint.entity';

export interface ICourseBlueprintRepository {
  findById(id: string): Promise<CourseBlueprint | null>;
  findAll(): Promise<CourseBlueprint[]>;
  create(data: Partial<CourseBlueprint>): Promise<CourseBlueprint>;
  update(id: string, data: Partial<CourseBlueprint>): Promise<CourseBlueprint>;
  delete(id: string): Promise<void>;
}

export const COURSE_BLUEPRINT_REPOSITORY = Symbol(
  'COURSE_BLUEPRINT_REPOSITORY',
);
