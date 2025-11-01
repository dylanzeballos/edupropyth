import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsOptional,
  IsNumber,
  Min,
  IsUUID,
  IsObject,
  IsBoolean,
  IsDateString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ActivityType } from '../../../domain/enums/activity-type.enum';

export class CreateActivityDto {
  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  topicId: string;

  @ApiProperty({ example: 'Quiz: Fundamentos de TypeScript' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'Evaluación de conocimientos básicos' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ enum: ActivityType })
  @IsEnum(ActivityType)
  type: ActivityType;

  @ApiProperty({ example: { questions: [], timeLimit: 30 } })
  @IsObject()
  @IsNotEmpty()
  content: Record<string, any>;

  @ApiProperty({ required: false })
  @IsDateString()
  @IsOptional()
  dueDate?: Date;

  @ApiProperty({ example: 100, required: false })
  @IsNumber()
  @Min(0)
  @IsOptional()
  maxScore?: number;

  @ApiProperty({ example: 1 })
  @IsNumber()
  @Min(0)
  order: number;

  @ApiProperty({ example: true, default: false })
  @IsBoolean()
  @IsOptional()
  isRequired?: boolean;
}
