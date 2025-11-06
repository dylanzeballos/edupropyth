import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CourseTemplate } from 'src/courses/domain/entities/course-template.entity';
import type { ICourseTemplateRepository } from 'src/courses/domain/interfaces/course-template-repository.interface';

@Injectable()
export class TypeormCourseTemplateRepository
  implements ICourseTemplateRepository
{
  constructor(
    @InjectRepository(CourseTemplate)
    private readonly repository: Repository<CourseTemplate>,
  ) {}

  async create(template: Partial<CourseTemplate>): Promise<CourseTemplate> {
    const newTemplate = this.repository.create(template);
    return await this.repository.save(newTemplate);
  }

  async findById(id: string): Promise<CourseTemplate | null> {
    return await this.repository.findOne({ where: { id } });
  }

  async findByCourseId(courseId: string): Promise<CourseTemplate | null> {
    return await this.repository.findOne({ where: { courseId } });
  }

  async update(
    id: string,
    data: Partial<CourseTemplate>,
  ): Promise<CourseTemplate> {
    const template = await this.findById(id);
    if (!template) {
      throw new NotFoundException('Course template not found');
    }

    Object.assign(template, data);
    return await this.repository.save(template);
  }

  async delete(id: string): Promise<void> {
    const result = await this.repository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('Course template not found');
    }
  }
}
