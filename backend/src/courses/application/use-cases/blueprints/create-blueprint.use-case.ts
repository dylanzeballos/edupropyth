import { Inject, Injectable } from '@nestjs/common';
import type { ICourseBlueprintRepository } from '../../../domain/interfaces/course-blueprint-repository.interface';
import { COURSE_BLUEPRINT_REPOSITORY } from '../../../domain/interfaces/course-blueprint-repository.interface';
import { CourseBlueprint } from '../../../domain/entities/course-blueprint.entity';

interface CreateBlueprintDto {
  title: string;
  description?: string;
  thumbnail?: string;
  isActive?: boolean;
}

@Injectable()
export class CreateBlueprintUseCase {
  constructor(
    @Inject(COURSE_BLUEPRINT_REPOSITORY)
    private readonly blueprintRepo: ICourseBlueprintRepository,
  ) {}

  async execute(dto: CreateBlueprintDto): Promise<CourseBlueprint> {
    return this.blueprintRepo.create({
      title: dto.title,
      description: dto.description,
      thumbnail: dto.thumbnail,
      isActive: dto.isActive ?? true,
    });
  }
}
