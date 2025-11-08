import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { ICourseTemplateRepository } from '../../../domain/interfaces/course-template-repository.interface';
import { COURSE_TEMPLATE_REPOSITORY } from '../../../domain/interfaces/course-template-repository.interface';
import type {
  CourseTemplate,
  ContentBlock,
} from '../../../domain/entities/course-template.entity';

interface UpdateCourseTemplateInput {
  blocks?: Omit<ContentBlock, 'id'>[];
}

@Injectable()
export class UpdateCourseTemplateUseCase {
  constructor(
    @Inject(COURSE_TEMPLATE_REPOSITORY)
    private templateRepository: ICourseTemplateRepository,
  ) {}

  async execute(
    id: string,
    data: UpdateCourseTemplateInput,
    userId: string,
  ): Promise<CourseTemplate> {
    const template = await this.templateRepository.findById(id);
    if (!template) {
      throw new NotFoundException('Course template not found');
    }

    let blocksWithIds: ContentBlock[] | undefined;
    if (data.blocks) {
      blocksWithIds = data.blocks.map((block, index) => ({
        ...block,
        id: `${template.courseId}-block-${index}-${Date.now()}`,
      }));
    }

    const updatedTemplate = await this.templateRepository.update(id, {
      ...(blocksWithIds && { blocks: blocksWithIds }),
      updatedBy: userId,
    });

    return updatedTemplate;
  }

  async executeByCourseId(
    courseId: string,
    data: UpdateCourseTemplateInput,
    userId: string,
  ): Promise<CourseTemplate> {
    const template = await this.templateRepository.findByCourseId(courseId);
    if (!template) {
      throw new NotFoundException('Course template not found');
    }

    return this.execute(template.id, data, userId);
  }
}
