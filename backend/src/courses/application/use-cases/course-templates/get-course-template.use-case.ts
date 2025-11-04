import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { ICourseTemplateRepository } from '../../../domain/interfaces/course-template-repository.interface';
import { COURSE_TEMPLATE_REPOSITORY } from '../../../domain/interfaces/course-template-repository.interface';
import type { CourseTemplate } from '../../../domain/entities/course-template.entity';

@Injectable()
export class GetCourseTemplateUseCase {
  constructor(
    @Inject(COURSE_TEMPLATE_REPOSITORY)
    private templateRepository: ICourseTemplateRepository,
  ) {}

  async executeById(id: string): Promise<CourseTemplate> {
    const template = await this.templateRepository.findById(id);
    if (!template) {
      throw new NotFoundException('Course template not found');
    }
    return template;
  }

  async executeByCourseId(courseId: string): Promise<CourseTemplate | null> {
    const template = await this.templateRepository.findByCourseId(courseId);
    return template;
  }
}
