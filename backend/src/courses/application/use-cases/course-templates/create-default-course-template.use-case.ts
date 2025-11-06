import { Injectable, Inject } from '@nestjs/common';
import type { ICourseTemplateRepository } from '../../../domain/interfaces/course-template-repository.interface';
import { COURSE_TEMPLATE_REPOSITORY } from '../../../domain/interfaces/course-template-repository.interface';
import type {
  CourseTemplate,
  ContentBlock,
} from '../../../domain/entities/course-template.entity';

@Injectable()
export class CreateDefaultCourseTemplateUseCase {
  constructor(
    @Inject(COURSE_TEMPLATE_REPOSITORY)
    private templateRepository: ICourseTemplateRepository,
  ) {}

  async execute(courseId: string, userId: string): Promise<CourseTemplate> {
    const existingTemplate =
      await this.templateRepository.findByCourseId(courseId);
    if (existingTemplate) {
      return existingTemplate;
    }

    const defaultBlocks: ContentBlock[] = [
      {
        id: `${courseId}-default-video-${Date.now()}`,
        type: 'video',
        layout: 'half',
        order: 0,
        position: {
          x: 0,
          y: 0,
          w: 6,
          h: 4,
        },
        content: {
          title: 'Video',
          description: 'Videos del tópico',
        },
      },
      {
        id: `${courseId}-default-resources-${Date.now()}`,
        type: 'resource',
        layout: 'half',
        order: 1,
        position: {
          x: 6,
          y: 0,
          w: 6,
          h: 4,
        },
        content: {
          title: 'Recursos',
          description: 'Material de apoyo y enlaces útiles',
        },
      },
      {
        id: `${courseId}-default-document-${Date.now()}`,
        type: 'document',
        layout: 'half',
        order: 2,
        position: {
          x: 0,
          y: 4,
          w: 6,
          h: 4,
        },
        content: {
          title: 'Documentos',
          description: 'Material de lectura',
        },
      },
      {
        id: `${courseId}-default-audio-${Date.now()}`,
        type: 'audio',
        layout: 'half',
        order: 3,
        position: {
          x: 6,
          y: 4,
          w: 6,
          h: 4,
        },
        content: {
          title: 'Audio',
          description: 'Podcasts y grabaciones',
        },
      },
      {
        id: `${courseId}-default-activities-${Date.now()}`,
        type: 'activities',
        layout: 'full',
        order: 4,
        position: {
          x: 0,
          y: 8,
          w: 12,
          h: 3,
        },
        content: {
          title: 'Actividades',
          description: 'Ejercicios y tareas del tópico',
        },
      },
    ];

    const template = await this.templateRepository.create({
      courseId,
      blocks: defaultBlocks,
      createdBy: userId,
    });

    return template;
  }
}
