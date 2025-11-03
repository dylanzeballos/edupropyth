import { Inject, Injectable } from '@nestjs/common';
import type { ICourseBlueprintRepository } from '../../../domain/interfaces/course-blueprint-repository.interface';
import { COURSE_BLUEPRINT_REPOSITORY } from '../../../domain/interfaces/course-blueprint-repository.interface';
import { CourseBlueprint } from '../../../domain/entities/course-blueprint.entity';

@Injectable()
export class ListBlueprintsUseCase {
  constructor(
    @Inject(COURSE_BLUEPRINT_REPOSITORY)
    private readonly blueprintRepo: ICourseBlueprintRepository,
  ) {}

  async execute(): Promise<CourseBlueprint[]> {
    return this.blueprintRepo.findAll();
  }
}
