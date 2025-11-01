import {
  Inject,
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { CourseStatus } from '../../domain/enums/course-status.enum';
import type { ICourseRepository } from '../../domain/interfaces/course-repository.interface';
import { COURSE_REPOSITORY } from '../../domain/interfaces/course-repository.interface';

export const ALLOWED_STATUSES_KEY = 'allowedStatuses';

@Injectable()
export class CourseStatusGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    @Inject(COURSE_REPOSITORY) private courseRepository: ICourseRepository,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const allowedStatuses = this.reflector.get<CourseStatus[]>(
      ALLOWED_STATUSES_KEY,
      context.getHandler(),
    );

    if (!allowedStatuses) {
      return true;
    }

    const request = context.switchToHttp().getRequest<{
      params: { id?: string; courseId?: string };
      body: { courseId?: string };
    }>();
    const courseId =
      request.params.id || request.params.courseId || request.body.courseId;

    if (!courseId) {
      throw new ForbiddenException('Course ID is required');
    }

    const course = await this.courseRepository.findById(courseId);

    if (!course) {
      throw new ForbiddenException('Course not found');
    }

    if (!allowedStatuses.includes(course.status)) {
      throw new ForbiddenException(
        `Cannot modify a ${course.status} course. Only ${allowedStatuses.join(', ')} courses can be modified.`,
      );
    }
    return true;
  }
}
