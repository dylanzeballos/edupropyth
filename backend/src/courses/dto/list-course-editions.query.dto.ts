import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsEnum,
  IsIn,
  IsInt,
  IsOptional,
  IsPositive,
  Max,
  Min,
} from 'class-validator';
import {
  CourseEditionStatus,
} from '../entities/course-edition.entity';

export const EDITION_SORT_FIELDS = ['createdAt', 'startDate'] as const;
export type EditionSortField = (typeof EDITION_SORT_FIELDS)[number];

export class ListCourseEditionsQueryDto {
  @ApiPropertyOptional({
    description: 'Filter by edition status',
    enum: CourseEditionStatus,
  })
  @IsOptional()
  @IsEnum(CourseEditionStatus)
  status?: CourseEditionStatus;

  @ApiPropertyOptional({
    description: 'Result page number (1-based)',
    default: 1,
    minimum: 1,
  })
  @IsOptional()
  @Transform(({ value }) =>
    value === undefined || value === null || value === ''
      ? undefined
      : parseInt(value, 10),
  )
  @IsInt()
  @IsPositive()
  @Min(1)
  page = 1;

  @ApiPropertyOptional({
    description: 'Number of items per page',
    default: 20,
    minimum: 1,
    maximum: 100,
  })
  @IsOptional()
  @Transform(({ value }) =>
    value === undefined || value === null || value === ''
      ? undefined
      : parseInt(value, 10),
  )
  @IsInt()
  @IsPositive()
  @Min(1)
  @Max(100)
  limit = 20;

  @ApiPropertyOptional({
    description: 'Field used to sort results',
    enum: EDITION_SORT_FIELDS,
    default: 'createdAt',
  })
  @IsOptional()
  @Transform(({ value }) =>
    typeof value === 'string' ? value.trim() : undefined,
  )
  @IsIn(EDITION_SORT_FIELDS)
  sortBy: EditionSortField = 'createdAt';

  @ApiPropertyOptional({
    description: 'Sort direction',
    enum: ['asc', 'desc'],
    default: 'desc',
  })
  @IsOptional()
  @Transform(({ value }) =>
    typeof value === 'string' ? value.toLowerCase() : undefined,
  )
  @IsIn(['asc', 'desc'])
  sortDirection: 'asc' | 'desc' = 'desc';
}
