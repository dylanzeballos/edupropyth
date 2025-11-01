import { Injectable, Inject } from '@nestjs/common';
import { COURSE_REPOSITORY } from '../../domain/interfaces/course-repository.interface';
import type { ICourseRepository } from '../../domain/interfaces/course-repository.interface';
import { IUserContext } from '../../domain/interfaces/user-context.interface';
import { CreateCourseDto } from '../../presentation/dto/create-course.dto';
import { CourseResponseDto } from '../../presentation/dto/course-response.dto';
import { CourseStatus } from '../../domain/enums/course-status.enum';

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
    const course = await this.courseRepository.create({
      title: createCourseDto.title,
      description: createCourseDto.description,
      thumbnail: createCourseDto.thumbnail,
      instructorId: user.id,
      status: CourseStatus.DRAFT,
      isActive: true,
    });

    return CourseResponseDto.fromCourse(course);
  }
}
