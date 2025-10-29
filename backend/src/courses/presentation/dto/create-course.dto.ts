import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsInt,
  Min,
  IsIn,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateCourseDto {
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  title: string;

  @IsString()
  @IsNotEmpty()
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  description: string;

  @IsString()
  @IsOptional()
  content?: string;

  @IsString()
  @IsOptional()
  image?: string;

  @IsInt()
  @IsOptional()
  @Min(0)
  duration?: number;

  @IsString()
  @IsOptional()
  @IsIn(['beginner', 'intermediate', 'advanced'])
  difficulty?: string;

  constructor(partial: Partial<CreateCourseDto> = {}) {
    Object.assign(this, partial);
  }
}
