import { ApiProperty } from '@nestjs/swagger';
import { Course } from '../../domain/entities/course.entity';
import { CourseStatus } from '../../domain/enums/course-status.enum';
import { TopicResponseDto } from './topics/topic-response.dto';

export class CourseResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  title: string;

  @ApiProperty({ required: false })
  description?: string;

  @ApiProperty({ required: false })
  thumbnail?: string;

  @ApiProperty({ enum: CourseStatus })
  status: CourseStatus;

  @ApiProperty({ required: false })
  instructorId?: string;

  @ApiProperty()
  isActive: boolean;

  @ApiProperty({ required: false })
  clonedFromId?: string;

  @ApiProperty({ type: [TopicResponseDto], required: false })
  topics?: TopicResponseDto[];

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  constructor(course: Course) {
    this.id = course.id;
    this.title = course.title;
    this.description = course.description;
    this.thumbnail = course.thumbnail;
    this.status = course.status;
    this.instructorId = course.instructorId;
    this.isActive = course.isActive;
    this.clonedFromId = course.clonedFromId;
    this.createdAt = course.createdAt;
    this.updatedAt = course.updatedAt;

    if (course.topics) {
      this.topics = course.topics
        .sort((a, b) => a.order - b.order)
        .map((topic) => TopicResponseDto.fromTopic(topic));
    }
  }

  static fromCourse(course: Course): CourseResponseDto {
    return new CourseResponseDto(course);
  }
}
