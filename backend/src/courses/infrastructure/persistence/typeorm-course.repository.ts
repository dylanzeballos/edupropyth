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

  async findById(id: string): Promise<Course | null> {
    return this.courseRepository.findOne({ where: { id } });
  }

  async findOne(id: string): Promise<Course | null> {
    return this.findById(id);
  }

  async findOneWithTopics(id: string): Promise<Course | null> {
    return this.courseRepository.findOne({
      where: { id },
      relations: ['topics', 'topics.resources', 'topics.activities'],
      order: {
        topics: {
          order: 'ASC',
          resources: { order: 'ASC' },
          activities: { order: 'ASC' },
        },
      },
    });
  }

  async findAll(): Promise<Course[]> {
    return this.courseRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findAllWithTopics(): Promise<Course[]> {
    return this.courseRepository.find({
      relations: ['topics', 'topics.resources', 'topics.activities'],
      order: {
        createdAt: 'DESC',
        topics: {
          order: 'ASC',
          resources: { order: 'ASC' },
          activities: { order: 'ASC' },
        },
      },
    });
  }

  async create(courseData: Partial<Course>): Promise<Course> {
    const course = this.courseRepository.create(courseData);
    return await this.courseRepository.save(course);
  }

  async update(id: string, courseData: Partial<Course>): Promise<Course> {
    const course = await this.findById(id);

    if (!course) {
      throw new NotFoundException(`Course with ID ${id} not found`);
    }

    Object.assign(course, courseData);
    return await this.courseRepository.save(course);
  }

  async delete(id: string): Promise<void> {
    const course = await this.findById(id);

    if (!course) {
      throw new NotFoundException(`Course with ID ${id} not found`);
    }

    await this.courseRepository.remove(course);
  }

  async exists(id: string): Promise<boolean> {
    const count = await this.courseRepository.count({ where: { id } });
    return count > 0;
  }
}
