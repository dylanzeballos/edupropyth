import { Course } from '../entities/course.entity';

export interface ICourseRepository {
  findOne(): Promise<Course | null>;
  findOneWithTopics(): Promise<Course | null>;
  create(courseData: Partial<Course>): Promise<Course>;
  update(courseData: Partial<Course>): Promise<Course>;
  delete(): Promise<void>;
  exists(): Promise<boolean>;
}

export const COURSE_REPOSITORY = Symbol('COURSE_REPOSITORY');
