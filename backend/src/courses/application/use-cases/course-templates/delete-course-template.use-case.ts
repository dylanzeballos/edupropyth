import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { ICourseTemplateRepository } from '../../../domain/interfaces/course-template-repository.interface';
import { COURSE_TEMPLATE_REPOSITORY } from '../../../domain/interfaces/course-template-repository.interface';

@Injectable()
export class DeleteCourseTemplateUseCase {
  constructor(
    @Inject(COURSE_TEMPLATE_REPOSITORY)
    private templateRepository: ICourseTemplateRepository,
  ) {}

  async execute(id: string): Promise<void> {
    const template = await this.templateRepository.findById(id);
    if (!template) {
      throw new NotFoundException('Course template not found');
    }

    await this.templateRepository.delete(id);
  }

  async executeByCourseId(courseId: string): Promise<void> {
    const template = await this.templateRepository.findByCourseId(courseId);
    if (!template) {
      throw new NotFoundException('Course template not found');
    }

    await this.templateRepository.delete(template.id);
  }
}
