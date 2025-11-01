import { ApiProperty } from '@nestjs/swagger';
import { Activity } from '../../../domain/entities/activity.entity';
import { ActivityType } from '../../../domain/enums/activity-type.enum';

export class ActivityResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  topicId: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  description: string;

  @ApiProperty({ enum: ActivityType })
  type: ActivityType;

  @ApiProperty()
  content: Record<string, any>;

  @ApiProperty({ required: false })
  dueDate?: Date;

  @ApiProperty({ required: false })
  maxScore?: number;

  @ApiProperty()
  order: number;

  @ApiProperty()
  isRequired: boolean;

  @ApiProperty()
  isActive: boolean;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  static fromActivity(activity: Activity): ActivityResponseDto {
    const dto = new ActivityResponseDto();
    dto.id = activity.id;
    dto.topicId = activity.topicId;
    dto.title = activity.title;
    dto.description = activity.description;
    dto.type = activity.type;
    dto.content = activity.content;
    dto.dueDate = activity.dueDate;
    dto.maxScore = activity.maxScore;
    dto.order = activity.order;
    dto.isRequired = activity.isRequired;
    dto.isActive = activity.isActive;
    dto.createdAt = activity.createdAt;
    dto.updatedAt = activity.updatedAt;
    return dto;
  }
}
