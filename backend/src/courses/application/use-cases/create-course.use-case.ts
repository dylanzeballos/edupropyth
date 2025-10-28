import { Injectable, Inject, ConflictException } from '@nestjs/common';
import { COURSE_REPOSITORY } from 'src/courses/domain/interfaces/course-repository.interface';
import type { ICourseRepository } from 'src/courses/domain/interfaces/course-repository.interface';
import { IUserContext } from 'src/courses/domain/interfaces/user-context.interface';
import { CreateCourseDto } from 'src/courses/presentation/dto/create-course.dto';
import { CourseResponseDto } from 'src/courses/presentation/dto/course-response.dto';

@Injectable()
export class CreateCourseUseCase {
  constructor(
    @Inject(COURSE_REPOSITORY)
    private readonly courseRepository: ICourseRepository,
  ) {}

  async execute(
    createCourseDto: CreateCourseDto,
    user: IUserContext,
  ): Promise<CourseResponseDto> {
    const existingCourse = await this.courseRepository.exists();
    if (existingCourse) {
      throw new ConflictException(
        'Ya existe un curso en el sistema. Solo puede haber un curso único.',
      );
    }

    const course = await this.courseRepository.create({
      ...createCourseDto,
      duration: createCourseDto.duration || 0,
      difficulty: createCourseDto.difficulty || 'beginner',
    });

    return CourseResponseDto.fromCourse(course);
  }
}
