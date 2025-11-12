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

    if (
      ![
        CourseStatus.DRAFT,
        CourseStatus.ACTIVE,
        CourseStatus.HISTORIC,
      ].includes(status)
    ) {
      throw new BadRequestException(
        'Only DRAFT, ACTIVE, or HISTORIC are allowed for editions',
      );
    }

    if (status === CourseStatus.ACTIVE && edition.blueprintId) {
      const allEditions = await this.courseRepo.findAll();
      const activeEditionExists = allEditions.some(
        (e) =>
          e.blueprintId === edition.blueprintId &&
          e.id !== id &&
          e.status === CourseStatus.ACTIVE,
      );

      if (activeEditionExists) {
        throw new BadRequestException(
          'Ya existe una edición activa para este curso. Solo puede haber una edición activa a la vez.',
        );
      }
    }

    return this.courseRepo.update(id, { status });
  }
}
