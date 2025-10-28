import { Topic } from 'src/courses/domain/entities/topic.entity';

export class TopicResponseDto {
  id: string;
  title: string;
  description: string;
  content: string;
  order: number;
  isActive: boolean;
  duration: number;
  type: string;
  courseId: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(topic: Topic) {
    this.id = topic.id;
    this.title = topic.title;
    this.description = topic.description;
    this.content = topic.content;
    this.order = topic.order;
    this.isActive = topic.isActive;
    this.duration = topic.duration;
    this.type = topic.type;
    this.courseId = topic.courseId;
    this.createdAt = topic.createdAt;
    this.updatedAt = topic.updatedAt;
  }

  static fromTopic(topic: Topic): TopicResponseDto {
    return new TopicResponseDto(topic);
  }
}
