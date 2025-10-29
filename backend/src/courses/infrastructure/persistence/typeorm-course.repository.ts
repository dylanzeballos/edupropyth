import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ICourseRepository } from '../../domain/interfaces/course-repository.interface';
import { Course } from '../../domain/entities/course.entity';

@Injectable()
export class TypeOrmCourseRepository implements ICourseRepository {
  constructor(
    @InjectRepository(Course)
    private readonly courseRepository: Repository<Course>,
  ) {}

  async findOne(): Promise<Course | null> {
    const courses = await this.courseRepository.find({ take: 1 });
    return courses.length > 0 ? courses[0] : null;
  }

  async findOneWithTopics(): Promise<Course | null> {
    const courses = await this.courseRepository.find({
      relations: ['topics'],
      take: 1,
    });
    return courses.length > 0 ? courses[0] : null;
  }

  async create(courseData: Partial<Course>): Promise<Course> {
    const course = this.courseRepository.create(courseData);
    return await this.courseRepository.save(course);
  }

  async update(courseData: Partial<Course>): Promise<Course> {
    const course = await this.findOne();

    if (!course)
      throw new NotFoundException('No se ha creado ningún curso aún');
    Object.assign(course, courseData);
    return await this.courseRepository.save(course);
  }

  async delete(): Promise<void> {
    const course = await this.findOne();

    if (!course) {
      throw new NotFoundException('No se ha creado ningún curso aún');
    }
    await this.courseRepository.remove(course);
  }

  async exists(): Promise<boolean> {
    const count = await this.courseRepository.count();
    return count > 0;
  }
}
