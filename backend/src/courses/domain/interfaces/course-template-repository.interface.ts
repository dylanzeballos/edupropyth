import type { CourseTemplate } from '../entities/course-template.entity';

export const COURSE_TEMPLATE_REPOSITORY = Symbol('COURSE_TEMPLATE_REPOSITORY');

export interface ICourseTemplateRepository {
  create(template: Partial<CourseTemplate>): Promise<CourseTemplate>;
  findById(id: string): Promise<CourseTemplate | null>;
  findByCourseId(courseId: string): Promise<CourseTemplate | null>;
  update(id: string, data: Partial<CourseTemplate>): Promise<CourseTemplate>;
  delete(id: string): Promise<void>;
}
