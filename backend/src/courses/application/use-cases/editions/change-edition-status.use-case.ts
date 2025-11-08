import {
  Inject,
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { COURSE_REPOSITORY } from '../../../domain/interfaces/course-repository.interface';
import type { ICourseRepository } from '../../../domain/interfaces/course-repository.interface';
import { Course } from '../../../domain/entities/course.entity';
import { CourseStatus } from '../../../domain/enums/course-status.enum';

@Injectable()
export class ChangeEditionStatusUseCase {
  constructor(
    @Inject(COURSE_REPOSITORY)
    private readonly courseRepo: ICourseRepository,
  ) {}

  async execute(id: string, status: CourseStatus): Promise<Course> {
    const edition = await this.courseRepo.findById(id);
    if (!edition) throw new NotFoundException('Edition not found');

    if (![CourseStatus.DRAFT, CourseStatus.ACTIVE].includes(status)) {
      throw new BadRequestException(
        'Only DRAFT or ACTIVE are allowed for editions',
      );
    }

    return this.courseRepo.update(id, { status });
  }
}
