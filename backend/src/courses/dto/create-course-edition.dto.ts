import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';
import { CourseEditionStatus } from '../entities/course-edition.entity';

export class CreateCourseEditionDto {
  @ApiProperty({
    description: 'Identifier that differentiates each edition of a course',
    maxLength: 80,
    example: 'II-2025',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(80)
  label: string;

  @ApiPropertyOptional({
    description: 'Term name for the edition (optional)',
    example: 'II',
  })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  term?: string;

  @ApiPropertyOptional({
    description: 'Academic year associated with the edition',
    example: 2025,
    minimum: 2000,
  })
  @IsOptional()
  @IsInt()
  @Min(2000)
  year?: number;

  @ApiPropertyOptional({
    description: 'Start date of the edition',
    type: String,
    example: '2025-08-01T00:00:00.000Z',
  })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiPropertyOptional({
    description: 'End date of the edition',
    type: String,
    example: '2025-12-15T00:00:00.000Z',
  })
  @IsOptional()
  @IsDateString()
  endDate?: string;

  @ApiPropertyOptional({
    description: 'Current status of the edition',
    enum: CourseEditionStatus,
    default: CourseEditionStatus.DRAFT,
  })
  @IsOptional()
  @IsEnum(CourseEditionStatus)
  status?: CourseEditionStatus;
}
