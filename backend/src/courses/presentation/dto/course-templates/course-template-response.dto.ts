import { ApiProperty } from '@nestjs/swagger';
import type { CourseTemplate } from '../../../domain/entities/course-template.entity';

class PositionResponse {
  @ApiProperty()
  x: number;

  @ApiProperty()
  y: number;

  @ApiProperty()
  w: number;

  @ApiProperty()
  h: number;
}

class ContentResponse {
  @ApiProperty({ required: false })
  html?: string;

  @ApiProperty({ required: false })
  videoUrl?: string;

  @ApiProperty({ required: false, type: [String] })
  resourceIds?: string[];

  @ApiProperty({ required: false, type: [String] })
  activityIds?: string[];

  @ApiProperty({ required: false })
  documentUrl?: string;

  @ApiProperty({ required: false })
  title?: string;

  @ApiProperty({ required: false })
  description?: string;
}

class StyleResponse {
  @ApiProperty({ required: false })
  backgroundColor?: string;

  @ApiProperty({ required: false })
  padding?: string;

  @ApiProperty({ required: false })
  borderRadius?: string;
}

class ContentBlockResponse {
  @ApiProperty()
  id: string;

  @ApiProperty()
  type: string;

  @ApiProperty()
  layout: string;

  @ApiProperty()
  order: number;

  @ApiProperty({ required: false, type: PositionResponse })
  position?: PositionResponse;

  @ApiProperty({ type: ContentResponse })
  content: ContentResponse;

  @ApiProperty({ required: false, type: StyleResponse })
  style?: StyleResponse;
}

export class CourseTemplateResponseDto {
  id: string;
  courseId: string;
  blocks: ContentBlockResponse[];
  createdBy: string;
  updatedBy?: string;
  createdAt: string;
  updatedAt: string;

  static fromEntity(template: CourseTemplate): CourseTemplateResponseDto {
    return {
      id: template.id,
      courseId: template.courseId,
      blocks: template.blocks,
      createdBy: template.createdBy,
      updatedBy: template.updatedBy,
      createdAt: template.createdAt.toISOString(),
      updatedAt: template.updatedAt.toISOString(),
    };
  }
}
