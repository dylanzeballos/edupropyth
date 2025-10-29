import {
  IsString,
  IsNotEmpty,
  IsInt,
  Min,
  IsOptional,
  IsIn,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateTopicDto {
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
  @IsNotEmpty()
  content: string;

  @IsInt()
  @Min(1)
  order: number;

  @IsInt()
  @IsOptional()
  @Min(0)
  duration?: number;

  @IsString()
  @IsOptional()
  @IsIn(['theory', 'practice', 'exercise', 'quiz'])
  type?: string;

  @IsString()
  @IsNotEmpty()
  courseId: string;

  constructor(partial: Partial<CreateTopicDto> = {}) {
    Object.assign(this, partial);
  }
}
