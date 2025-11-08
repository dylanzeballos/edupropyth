import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { ICourseBlueprintRepository } from '../../../domain/interfaces/course-blueprint-repository.interface';
import { COURSE_BLUEPRINT_REPOSITORY } from '../../../domain/interfaces/course-blueprint-repository.interface';
import { CourseBlueprint } from '../../../domain/entities/course-blueprint.entity';

@Injectable()
export class GetBlueprintUseCase {
  constructor(
    @Inject(COURSE_BLUEPRINT_REPOSITORY)
    private readonly blueprintRepo: ICourseBlueprintRepository,
  ) {}

  async execute(id: string): Promise<CourseBlueprint> {
    const blueprint = await this.blueprintRepo.findById(id);
    if (!blueprint) throw new NotFoundException('Blueprint not found');
    return blueprint;
  }
}
