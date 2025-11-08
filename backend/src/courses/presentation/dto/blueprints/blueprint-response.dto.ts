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

  constructor(blueprint: CourseBlueprint) {
    this.id = blueprint.id;
    this.title = blueprint.title;
    this.description = blueprint.description;
    this.thumbnail = blueprint.thumbnail;
    this.isActive = blueprint.isActive;
    this.createdAt = blueprint.createdAt;
    this.updatedAt = blueprint.updatedAt;
  }

  static fromBlueprint(blueprint: CourseBlueprint): BlueprintResponseDto {
    return new BlueprintResponseDto(blueprint);
  }
}
