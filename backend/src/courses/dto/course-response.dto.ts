import { ApiProperty } from '@nestjs/swagger';
import { CourseEditionStatus } from '../entities/course-edition.entity';

export class PaginationMetaDto {
  @ApiProperty({ description: 'Total number of records' })
  total!: number;

  @ApiProperty({ description: 'Current page number (1-based)' })
  page!: number;

  @ApiProperty({ description: 'Maximum number of records per page' })
  limit!: number;

  @ApiProperty({ description: 'Last available page number' })
  lastPage!: number;

  constructor(partial?: Partial<PaginationMetaDto>) {
    Object.assign(this, partial);
  }
}

export class CourseEditionDto {
  @ApiProperty({ description: 'Edition identifier', example: 'd5b...' })
  id!: string;

  @ApiProperty({
    description: 'Edition label (unique per course)',
    example: 'II-2025',
  })
  label!: string;

  @ApiProperty({
    description: 'Edition status',
    enum: CourseEditionStatus,
  })
  status!: CourseEditionStatus;

  @ApiProperty({
    description: 'Academic term (optional)',
    nullable: true,
    example: 'II',
  })
  term!: string | null;

  @ApiProperty({
    description: 'Academic year (optional)',
    nullable: true,
    example: 2025,
  })
  year!: number | null;

  @ApiProperty({
    description: 'Edition start date',
    type: String,
    nullable: true,
  })
  startDate!: string | null;

  @ApiProperty({
    description: 'Edition end date',
    type: String,
    nullable: true,
  })
  endDate!: string | null;

  @ApiProperty({
    description: 'Date when the edition was archived (if archived)',
    type: String,
    nullable: true,
  })
  archivedAt!: string | null;

  @ApiProperty({
    description: 'User who archived the edition',
    nullable: true,
  })
  archivedByUserId!: string | null;

  @ApiProperty({ description: 'Creation timestamp', type: String })
  createdAt!: string;

  @ApiProperty({ description: 'Last update timestamp', type: String })
  updatedAt!: string;

  constructor(partial?: Partial<CourseEditionDto>) {
    Object.assign(this, partial);
  }
}

export class CourseSummaryDto {
  @ApiProperty({ description: 'Course identifier', example: '92c...' })
  id!: string;

  @ApiProperty({ description: 'Unique code of the course', example: 'PY-101' })
  code!: string;

  @ApiProperty({
    description: 'Human readable course name',
    example: 'Programación con Python',
  })
  name!: string;

  @ApiProperty({
    description: 'Slug used for URLs',
    nullable: true,
    example: 'programacion-con-python',
  })
  slug!: string | null;

  @ApiProperty({
    description: 'Course long description',
    nullable: true,
  })
  description!: string | null;

  @ApiProperty({
    description: 'Indicates if the course is active',
    default: true,
  })
  isActive!: boolean;

  @ApiProperty({
    description: 'Number of editions associated with the course',
    example: 3,
  })
  editionsCount!: number;

  @ApiProperty({ description: 'Creation timestamp', type: String })
  createdAt!: string;

  @ApiProperty({ description: 'Last update timestamp', type: String })
  updatedAt!: string;

  constructor(partial?: Partial<CourseSummaryDto>) {
    Object.assign(this, partial);
  }
}

export class CourseDetailDto extends CourseSummaryDto {
  @ApiProperty({
    description: 'Editions belonging to the course',
    type: () => CourseEditionDto,
    isArray: true,
  })
  editions!: CourseEditionDto[];

  constructor(partial?: Partial<CourseDetailDto>) {
    super(partial);
    Object.assign(this, partial);
  }
}

export class PaginatedCoursesResponseDto {
  @ApiProperty({
    description: 'List of courses',
    type: () => CourseSummaryDto,
    isArray: true,
  })
  data!: CourseSummaryDto[];

  @ApiProperty({ description: 'Pagination metadata', type: () => PaginationMetaDto })
  meta!: PaginationMetaDto;

  constructor(partial?: Partial<PaginatedCoursesResponseDto>) {
    Object.assign(this, partial);
  }
}

export class PaginatedCourseEditionsResponseDto {
  @ApiProperty({
    description: 'List of course editions',
    type: () => CourseEditionDto,
    isArray: true,
  })
  data!: CourseEditionDto[];

  @ApiProperty({ description: 'Pagination metadata', type: () => PaginationMetaDto })
  meta!: PaginationMetaDto;

  constructor(partial?: Partial<PaginatedCourseEditionsResponseDto>) {
    Object.assign(this, partial);
  }
}
