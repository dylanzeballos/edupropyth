import { Course } from '../entities/course.entity';

export interface ICourseRepository {
  findById(id: string): Promise<Course | null>;
  findOne(id: string): Promise<Course | null>;
  findOneWithTopics(id: string): Promise<Course | null>;
  findAll(): Promise<Course[]>;
  findAllWithTopics(): Promise<Course[]>;
  findAllEditionsWithDetails(): Promise<Course[]>;
  create(courseData: Partial<Course>): Promise<Course>;
  update(id: string, courseData: Partial<Course>): Promise<Course>;
  delete(id: string): Promise<void>;
  exists(id: string): Promise<boolean>;
}

export const COURSE_REPOSITORY = Symbol('COURSE_REPOSITORY');
