import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsOptional,
  IsNumber,
  Min,
  IsUUID,
  IsObject,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ResourceType } from '../../../domain/enums/resource-type.enum';

export class CreateResourceDto {
  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  topicId: string;

  @ApiProperty({ example: 'Presentación del curso' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ enum: ResourceType })
  @IsEnum(ResourceType)
  type: ResourceType;

  @ApiProperty({ example: 'https://example.com/resource.pdf' })
  @IsString()
  @IsNotEmpty()
  url: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  publicId?: string;

  @ApiProperty({ required: false })
  @IsObject()
  @IsOptional()
  metadata?: Record<string, any>;

  @ApiProperty({ example: 1 })
  @IsNumber()
  @Min(0)
  order: number;
}
