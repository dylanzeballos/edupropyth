import { Injectable, Inject } from '@nestjs/common';
import { COURSE_REPOSITORY } from '../../domain/interfaces/course-repository.interface';
import type { ICourseRepository } from '../../domain/interfaces/course-repository.interface';
import { IUserContext } from '../../domain/interfaces/user-context.interface';
import { CreateCourseDto } from '../../presentation/dto/create-course.dto';
import { CourseResponseDto } from '../../presentation/dto/course-response.dto';
import { CourseStatus } from '../../domain/enums/course-status.enum';
import { CreateDefaultCourseTemplateUseCase } from './course-templates/create-default-course-template.use-case';

@Injectable()
export class CreateCourseUseCase {
  constructor(
    @Inject(COURSE_REPOSITORY)
    private readonly courseRepository: ICourseRepository,
    private readonly createDefaultTemplateUseCase: CreateDefaultCourseTemplateUseCase,
  ) {}

  async execute(
    createCourseDto: CreateCourseDto,
    user: IUserContext,
  ): Promise<CourseResponseDto> {
    const course = await this.courseRepository.create({
      title: createCourseDto.title,
      description: createCourseDto.description,
      thumbnail: createCourseDto.thumbnail,
      instructorId: user.id,
      status: CourseStatus.DRAFT,
      isActive: true,
    });

    // Crear template por defecto para el curso
    try {
      await this.createDefaultTemplateUseCase.execute(course.id, user.id);
    } catch (error) {
      // Si falla la creación del template, solo log el error pero no fallar la creación del curso
      console.error('Error creating default template for course:', error);
    }

    return CourseResponseDto.fromCourse(course);
  }
}
