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

  async execute(id: string): Promise<CourseResponseDto> {
    const course = await this.courseRepository.findOneWithTopics(id);

    if (!course) {
      throw new NotFoundException(`Course with ID ${id} not found`);
    }

    return CourseResponseDto.fromCourse(course);
  }

  async executeAll(): Promise<CourseResponseDto[]> {
    const courses = await this.courseRepository.findAll();
    return courses.map((course) => CourseResponseDto.fromCourse(course));
  }
}
