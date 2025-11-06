import { SetMetadata } from '@nestjs/common';
import { CourseStatus } from '../../domain/enums/course-status.enum';
import { ALLOWED_STATUSES_KEY } from '../guards/course-status.guard';

export const AllowedCourseStatuses = (...statuses: CourseStatus[]) =>
  SetMetadata(ALLOWED_STATUSES_KEY, statuses);
