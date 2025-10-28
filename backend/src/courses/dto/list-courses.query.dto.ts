import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsIn,
  IsInt,
  IsOptional,
  IsPositive,
  Max,
  Min,
} from 'class-validator';

export const COURSE_SORT_FIELDS = ['createdAt', 'name', 'code'] as const;
export type CourseSortField = (typeof COURSE_SORT_FIELDS)[number];

export class ListCoursesQueryDto {
  @ApiPropertyOptional({
    description: 'Full-text search by name or code',
  })
  @IsOptional()
  @Transform(({ value }) =>
    typeof value === 'string' ? value.trim() : value ?? undefined,
  )
  search?: string;

  @ApiPropertyOptional({
    description: 'Filter by active status',
  })
  @IsOptional()
  @Transform(({ value }) => {
    if (value === undefined || value === null || value === '') {
      return undefined;
    }
    if (typeof value === 'boolean') {
      return value;
    }
    return value === 'true';
  })
  @IsBoolean()
  isActive?: boolean;

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
    description: 'Field used to sort the results',
    enum: COURSE_SORT_FIELDS,
    default: 'createdAt',
  })
  @IsOptional()
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      return value.trim();
    }
    return undefined;
  })
  @IsIn(COURSE_SORT_FIELDS)
  sortBy: CourseSortField = 'createdAt';

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
