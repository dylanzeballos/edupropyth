import { ApiProperty } from '@nestjs/swagger';
import { Topic } from '../../../domain/entities/topic.entity';
import { ResourceResponseDto } from '../resources/resource-response.dto';
import { ActivityResponseDto } from '../activities/activity-response.dto';

export class TopicResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  courseId: string;

  @ApiProperty()
  title: string;

  @ApiProperty({ required: false })
  description?: string;

  @ApiProperty()
  order: number;

  @ApiProperty()
  isActive: boolean;

  @ApiProperty({ type: [ResourceResponseDto], required: false })
  resources?: ResourceResponseDto[];

  @ApiProperty({ type: [ActivityResponseDto], required: false })
  activities?: ActivityResponseDto[];

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  static fromTopic(topic: Topic): TopicResponseDto {
    const dto = new TopicResponseDto();
    dto.id = topic.id;
    dto.courseId = topic.courseId;
    dto.title = topic.title;
    dto.description = topic.description;
    dto.order = topic.order;
    dto.isActive = topic.isActive;
    dto.createdAt = topic.createdAt;
    dto.updatedAt = topic.updatedAt;

    if (topic.resources) {
      dto.resources = topic.resources
        .sort((a, b) => a.order - b.order)
        .map((resource) => ResourceResponseDto.fromResource(resource));
    }

    if (topic.activities) {
      dto.activities = topic.activities
        .sort((a, b) => a.order - b.order)
        .map((activity) => ActivityResponseDto.fromActivity(activity));
    }

    return dto;
  }
}
