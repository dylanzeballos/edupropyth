import { Course } from '../entities/course.entity';
import { CourseEdition } from '../entities/course-edition.entity';
import {
  CourseDetailDto,
  CourseEditionDto,
  CourseSummaryDto,
} from '../dto/course-response.dto';

type CourseWithCounts = Course & { editionsCount?: number | null };

const toISOString = (value: Date | null | undefined): string | null => {
  if (!value) {
    return null;
  }
  return value.toISOString();
};

export class CourseMapper {
  static toSummary(course: CourseWithCounts): CourseSummaryDto {
    return new CourseSummaryDto({
      id: course.id,
      code: course.code,
      name: course.name,
      slug: course.slug ?? null,
      description: course.description ?? null,
      isActive: course.isActive,
      editionsCount: Number(course.editionsCount ?? 0),
      createdAt: course.createdAt.toISOString(),
      updatedAt: course.updatedAt.toISOString(),
    });
  }

  static toEditionDto(edition: CourseEdition): CourseEditionDto {
    return new CourseEditionDto({
      id: edition.id,
      label: edition.label,
      status: edition.status,
      term: edition.term ?? null,
      year: edition.year ?? null,
      startDate: toISOString(edition.startDate),
      endDate: toISOString(edition.endDate),
      archivedAt: toISOString(edition.archivedAt),
      archivedByUserId: edition.archivedByUserId ?? null,
      createdAt: edition.createdAt.toISOString(),
      updatedAt: edition.updatedAt.toISOString(),
    });
  }

  static toDetail(
    course: CourseWithCounts,
    editions: CourseEdition[],
  ): CourseDetailDto {
    const summary = CourseMapper.toSummary(course);
    return new CourseDetailDto({
      ...summary,
      description: course.description ?? null,
      editions: editions.map(CourseMapper.toEditionDto),
    });
  }
}
