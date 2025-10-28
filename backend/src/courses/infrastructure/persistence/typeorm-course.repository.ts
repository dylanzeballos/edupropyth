import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ICourseRepository } from 'src/courses/domain/interfaces/course-repository.interface';
import { Course } from 'src/courses/domain/entities/course.entity';

@Injectable()
export class TypeOrmCourseRepository implements ICourseRepository {
  constructor(
    @InjectRepository(Course)
    private readonly courseRepository: Repository<Course>,
  ) {}

  async findOne(): Promise<Course | null> {
    return await this.courseRepository.findOne({ where: {} });
  }

  async findOneWithTopics(): Promise<Course | null> {
    return await this.courseRepository.findOne({
      relations: ['topics'],
    });
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
