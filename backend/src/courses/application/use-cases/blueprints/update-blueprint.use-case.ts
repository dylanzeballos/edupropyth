import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { ICourseBlueprintRepository } from '../../../domain/interfaces/course-blueprint-repository.interface';
import { COURSE_BLUEPRINT_REPOSITORY } from '../../../domain/interfaces/course-blueprint-repository.interface';
import { CourseBlueprint } from '../../../domain/entities/course-blueprint.entity';

interface UpdateBlueprintDto {
  title?: string;
  description?: string;
  thumbnail?: string;
  isActive?: boolean;
}

@Injectable()
export class UpdateBlueprintUseCase {
  constructor(
    @Inject(COURSE_BLUEPRINT_REPOSITORY)
    private readonly blueprintRepo: ICourseBlueprintRepository,
  ) {}

  async execute(id: string, dto: UpdateBlueprintDto): Promise<CourseBlueprint> {
    const blueprint = await this.blueprintRepo.findById(id);
    if (!blueprint) throw new NotFoundException('Blueprint not found');
    return this.blueprintRepo.update(id, dto);
  }
}
