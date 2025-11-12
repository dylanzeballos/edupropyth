import {
  Inject,
  Injectable,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { COURSE_REPOSITORY } from '../../../domain/interfaces/course-repository.interface';
import type { ICourseRepository } from '../../../domain/interfaces/course-repository.interface';
import { Course } from '../../../domain/entities/course.entity';
import { CourseStatus } from '../../../domain/enums/course-status.enum';

interface UpdateEditionDto {
  title?: string;
  description?: string;
  thumbnail?: string;
  instructorId?: string;
}

@Injectable()
export class UpdateEditionUseCase {
  constructor(
    @Inject(COURSE_REPOSITORY)
    private readonly courseRepo: ICourseRepository,
  ) {}

  async execute(id: string, dto: UpdateEditionDto): Promise<Course> {
    const edition = await this.courseRepo.findById(id);
    if (!edition) throw new NotFoundException('Edition not found');
    if (edition.status !== CourseStatus.DRAFT) {
      throw new ForbiddenException('Only draft editions can be updated');
    }
    return this.courseRepo.update(id, dto);
  }
}
