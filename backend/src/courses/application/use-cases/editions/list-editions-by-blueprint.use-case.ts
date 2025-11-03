import { Inject, Injectable } from '@nestjs/common';
import { COURSE_REPOSITORY } from '../../../domain/interfaces/course-repository.interface';
import type { ICourseRepository } from '../../../domain/interfaces/course-repository.interface';
import { Course } from '../../../domain/entities/course.entity';

@Injectable()
export class ListEditionsByBlueprintUseCase {
  constructor(
    @Inject(COURSE_REPOSITORY)
    private readonly courseRepo: ICourseRepository,
  ) {}

  async execute(blueprintId: string): Promise<Course[]> {
    const all = await this.courseRepo.findAll();
    return all.filter((course) => course.blueprintId === blueprintId);
  }
}
