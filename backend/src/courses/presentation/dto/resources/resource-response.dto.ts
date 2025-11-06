import { ApiProperty } from '@nestjs/swagger';
import { Resource } from '../../../domain/entities/resource.entity';
import { ResourceType } from '../../../domain/enums/resource-type.enum';

export class ResourceResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  topicId: string;

  @ApiProperty()
  title: string;

  @ApiProperty({ required: false })
  description?: string;

  @ApiProperty({ enum: ResourceType })
  type: ResourceType;

  @ApiProperty()
  url: string;

  @ApiProperty({ required: false })
  publicId?: string;

  @ApiProperty({ required: false })
  metadata?: Record<string, any>;

  @ApiProperty()
  order: number;

  @ApiProperty()
  isActive: boolean;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  static fromResource(resource: Resource): ResourceResponseDto {
    const dto = new ResourceResponseDto();
    dto.id = resource.id;
    dto.topicId = resource.topicId;
    dto.title = resource.title;
    dto.description = resource.description;
    dto.type = resource.type;
    dto.url = resource.url;
    dto.publicId = resource.publicId;
    dto.metadata = resource.metadata;
    dto.order = resource.order;
    dto.isActive = resource.isActive;
    dto.createdAt = resource.createdAt;
    dto.updatedAt = resource.updatedAt;
    return dto;
  }
}
