import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { COURSE_REPOSITORY } from '../../domain/interfaces/course-repository.interface';
import type { ICourseRepository } from '../../domain/interfaces/course-repository.interface';
import { CourseResponseDto } from '../../presentation/dto/course-response.dto';

@Injectable()
export class GetCourseUseCase {
  constructor(
    @Inject(COURSE_REPOSITORY)
    private readonly courseRepository: ICourseRepository,
  ) {}

  async execute(): Promise<CourseResponseDto> {
    const course = await this.courseRepository.findOneWithTopics();

    if (!course) {
      throw new NotFoundException('No se ha encontrado ningún curso aún');
    }

    return CourseResponseDto.fromCourse(course);
  }
}
