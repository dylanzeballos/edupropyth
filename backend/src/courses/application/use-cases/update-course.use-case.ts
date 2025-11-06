import { Injectable, Inject } from '@nestjs/common';
import { COURSE_REPOSITORY } from '../../domain/interfaces/course-repository.interface';
import type { ICourseRepository } from '../../domain/interfaces/course-repository.interface';
import { IUserContext } from '../../domain/interfaces/user-context.interface';
import { UpdateCourseDto } from '../../presentation/dto/update-course.dto';
import { CourseResponseDto } from '../../presentation/dto/course-response.dto';

@Injectable()
export class UpdateCourseUseCase {
  constructor(
    @Inject(COURSE_REPOSITORY)
    private readonly courseRepository: ICourseRepository,
  ) {}

  async execute(
    id: string,
    updateCourseDto: UpdateCourseDto,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _user: IUserContext,
  ): Promise<CourseResponseDto> {
    const course = await this.courseRepository.update(id, updateCourseDto);
    return CourseResponseDto.fromCourse(course);
  }
}
