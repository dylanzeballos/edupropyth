import {
  IsString,
  IsOptional,
  IsNumber,
  Min,
  IsBoolean,
  IsObject,
  IsEnum,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ResourceType } from '../../../domain/enums/resource-type.enum';

export class UpdateResourceDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ required: false, enum: ResourceType })
  @IsEnum(ResourceType)
  @IsOptional()
  type?: ResourceType;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  url?: string;

  @ApiProperty({ required: false })
  @IsNumber()
  @Min(0)
  @IsOptional()
  order?: number;

  @ApiProperty({ required: false })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @ApiProperty({ required: false })
  @IsObject()
  @IsOptional()
  metadata?: Record<string, any>;
}
