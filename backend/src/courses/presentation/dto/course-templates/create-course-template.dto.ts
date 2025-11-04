import { ApiProperty } from '@nestjs/swagger';
import {
  IsUUID,
  IsArray,
  ValidateNested,
  IsString,
  IsOptional,
  IsObject,
  IsNumber,
} from 'class-validator';
import { Type } from 'class-transformer';

class PositionDto {
  @ApiProperty()
  @IsNumber()
  x: number;

  @ApiProperty()
  @IsNumber()
  y: number;

  @ApiProperty()
  @IsNumber()
  w: number;

  @ApiProperty()
  @IsNumber()
  h: number;
}

class ContentDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  html?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  videoUrl?: string;

  @ApiProperty({ required: false, type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  resourceIds?: string[];

  @ApiProperty({ required: false, type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  activityIds?: string[];

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  documentUrl?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  description?: string;
}

class StyleDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  backgroundColor?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  padding?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  borderRadius?: string;
}

class ContentBlockDto {
  @ApiProperty()
  @IsString()
  type: string;

  @ApiProperty()
  @IsString()
  layout: string;

  @ApiProperty()
  @IsNumber()
  order: number;

  @ApiProperty({ required: false, type: PositionDto })
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => PositionDto)
  position?: PositionDto;

  @ApiProperty({ type: ContentDto })
  @IsObject()
  @ValidateNested()
  @Type(() => ContentDto)
  content: ContentDto;

  @ApiProperty({ required: false, type: StyleDto })
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => StyleDto)
  style?: StyleDto;
}

export class CreateCourseTemplateDto {
  @ApiProperty()
  @IsUUID()
  courseId: string;

  @ApiProperty({ type: [ContentBlockDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ContentBlockDto)
  blocks: ContentBlockDto[];
}
