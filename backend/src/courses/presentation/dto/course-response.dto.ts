import { Course } from 'src/courses/domain/entities/course.entity';
import { TopicResponseDto } from './topic-response.dto';

export class CourseResponseDto {
  id: string;
  title: string;
  description: string;
  content?: string;
  isActive: boolean;
  image?: string;
  duration: number;
  difficulty: string;
  topics?: TopicResponseDto[];
  createdAt: Date;
  updatedAt: Date;

  constructor(course: Course) {
    this.id = course.id;
    this.title = course.title;
    this.description = course.description;
    this.content = course.content;
    this.isActive = course.isActive;
    this.image = course.image;
    this.duration = course.duration;
    this.difficulty = course.difficulty;
    this.createdAt = course.createdAt;
    this.updatedAt = course.updatedAt;

    if (course.topics) {
      this.topics = course.topics
        .sort((a, b) => a.order - b.order)
        .map((topic) => new TopicResponseDto(topic));
    }
  }

  static fromCourse(course: Course): CourseResponseDto {
    return new CourseResponseDto(course);
  }
}
