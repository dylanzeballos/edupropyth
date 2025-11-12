import { Inject, Injectable } from '@nestjs/common';
import type { ICourseBlueprintRepository } from '../../../domain/interfaces/course-blueprint-repository.interface';
import { COURSE_BLUEPRINT_REPOSITORY } from '../../../domain/interfaces/course-blueprint-repository.interface';
import type { ICourseRepository } from '../../../domain/interfaces/course-repository.interface';
import { COURSE_REPOSITORY } from '../../../domain/interfaces/course-repository.interface';
import { CourseBlueprint } from '../../../domain/entities/course-blueprint.entity';
import { CourseStatus } from '../../../domain/enums/course-status.enum';

export interface BlueprintWithCounts extends CourseBlueprint {
  editionsCount: number;
  draftEditionsCount: number;
  activeEditionsCount: number;
  historicEditionsCount: number;
}

@Injectable()
export class ListBlueprintsUseCase {
  constructor(
    @Inject(COURSE_BLUEPRINT_REPOSITORY)
    private readonly blueprintRepo: ICourseBlueprintRepository,
    @Inject(COURSE_REPOSITORY)
    private readonly courseRepo: ICourseRepository,
  ) {}

  async execute(): Promise<BlueprintWithCounts[]> {
    const blueprints = await this.blueprintRepo.findAll();
    const allEditions = await this.courseRepo.findAll();

    return blueprints.map((blueprint) => {
      const editions = allEditions.filter(
        (course) => course.blueprintId === blueprint.id,
      );

      const editionsCount = editions.length;
      const draftEditionsCount = editions.filter(
        (e) => e.status === CourseStatus.DRAFT,
      ).length;
      const activeEditionsCount = editions.filter(
        (e) => e.status === CourseStatus.ACTIVE,
      ).length;
      const historicEditionsCount = editions.filter(
        (e) => e.status === CourseStatus.HISTORIC,
      ).length;

      return {
        ...blueprint,
        editionsCount,
        draftEditionsCount,
        activeEditionsCount,
        historicEditionsCount,
      };
    });
  }
}
