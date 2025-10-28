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
  @IsString()
  @IsNotEmpty()
  @MaxLength(80)
  label: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  term?: string;

  @IsOptional()
  @IsInt()
  @Min(2000)
  year?: number;

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsOptional()
  @IsEnum(CourseEditionStatus)
  status?: CourseEditionStatus;
}
