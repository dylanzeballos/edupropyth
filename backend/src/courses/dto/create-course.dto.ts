import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateCourseDto {
  @ApiProperty({
    description: 'Unique code used to identify the course',
    maxLength: 50,
    example: 'PY-101',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  code: string;

  @ApiProperty({
    description: 'Human readable name of the course',
    maxLength: 150,
    example: 'Programación con Python',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  name: string;

  @ApiPropertyOptional({
    description: 'Slug used for URLs (optional)',
    maxLength: 160,
    example: 'programacion-con-python',
  })
  @IsOptional()
  @IsString()
  @MaxLength(160)
  slug?: string;

  @ApiPropertyOptional({
    description: 'Long description for the course',
    example: 'Curso introductorio para estudiantes de primer semestre.',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    description: 'Flag indicating if the course is active',
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
