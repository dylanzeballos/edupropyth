import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  Min,
  IsUUID,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTopicDto {
  @ApiProperty({ example: 'Introducción a TypeScript' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'Conceptos básicos de TypeScript', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: 1 })
  @IsNumber()
  @Min(0)
  order: number;

  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsUUID()
  @IsNotEmpty()
  courseId: string;
}
