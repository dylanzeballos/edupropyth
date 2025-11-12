import { ApiProperty } from '@nestjs/swagger';
import { CourseBlueprint } from '../../../domain/entities/course-blueprint.entity';

export class BlueprintResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  title: string;

  @ApiProperty({ required: false })
  description?: string;

  @ApiProperty({ required: false })
  thumbnail?: string;

  @ApiProperty()
  isActive: boolean;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty({ required: false })
  editionsCount?: number;

  @ApiProperty({ required: false })
  draftEditionsCount?: number;

  @ApiProperty({ required: false })
  activeEditionsCount?: number;

  @ApiProperty({ required: false })
  historicEditionsCount?: number;

  constructor(
    blueprint: CourseBlueprint,
    editionsCount?: number,
    draftEditionsCount?: number,
    activeEditionsCount?: number,
    historicEditionsCount?: number,
  ) {
    this.id = blueprint.id;
    this.title = blueprint.title;
    this.description = blueprint.description;
    this.thumbnail = blueprint.thumbnail;
    this.isActive = blueprint.isActive;
    this.createdAt = blueprint.createdAt;
    this.updatedAt = blueprint.updatedAt;
    this.editionsCount = editionsCount;
    this.draftEditionsCount = draftEditionsCount;
    this.activeEditionsCount = activeEditionsCount;
    this.historicEditionsCount = historicEditionsCount;
  }

  static fromBlueprint(
    blueprint: CourseBlueprint,
    editionsCount?: number,
    draftEditionsCount?: number,
    activeEditionsCount?: number,
    historicEditionsCount?: number,
  ): BlueprintResponseDto {
    return new BlueprintResponseDto(
      blueprint,
      editionsCount,
      draftEditionsCount,
      activeEditionsCount,
      historicEditionsCount,
    );
  }
}
