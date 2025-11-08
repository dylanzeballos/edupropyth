import {
  Inject,
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import type { ICourseTemplateRepository } from '../../../domain/interfaces/course-template-repository.interface';
import { COURSE_TEMPLATE_REPOSITORY } from '../../../domain/interfaces/course-template-repository.interface';
import type { ICourseRepository } from '../../../domain/interfaces/course-repository.interface';
import { COURSE_REPOSITORY } from '../../../domain/interfaces/course-repository.interface';
import {
  CourseTemplate,
  ContentBlock,
} from '../../../domain/entities/course-template.entity';

interface CreateCourseTemplateInput {
  courseId: string;
  blocks: Omit<ContentBlock, 'id'>[];
}

@Injectable()
export class CreateCourseTemplateUseCase {
  constructor(
    @Inject(COURSE_TEMPLATE_REPOSITORY)
    private templateRepository: ICourseTemplateRepository,
    @Inject(COURSE_REPOSITORY)
    private courseRepository: ICourseRepository,
  ) {}

  async execute(
    data: CreateCourseTemplateInput,
    userId: string,
  ): Promise<CourseTemplate> {
    const course = await this.courseRepository.findById(data.courseId);
    if (!course) {
      throw new NotFoundException('Course not found');
    }

    const existingTemplate = await this.templateRepository.findByCourseId(
      data.courseId,
    );
    if (existingTemplate) {
      throw new ConflictException('Template already exists for this course');
    }

    const blocksWithIds: ContentBlock[] = data.blocks.map((block, index) => ({
      ...block,
      id: `${data.courseId}-block-${index}-${Date.now()}`,
    }));

    const template = await this.templateRepository.create({
      courseId: data.courseId,
      blocks: blocksWithIds,
      createdBy: userId,
    });

    return template;
  }
}
