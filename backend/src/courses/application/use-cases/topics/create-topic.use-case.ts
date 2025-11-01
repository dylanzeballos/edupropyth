import { Inject, Injectable } from '@nestjs/common';
import type { ITopicRepository } from '../../../domain/interfaces/topic-repository.interface';
import { TOPIC_REPOSITORY } from '../../../domain/interfaces/topic-repository.interface';
import type { ICourseRepository } from '../../../domain/interfaces/course-repository.interface';
import { COURSE_REPOSITORY } from '../../../domain/interfaces/course-repository.interface';
import { Topic } from '../../../domain/entities/topic.entity';
import { CourseStatus } from '../../../domain/enums/course-status.enum';
import { ForbiddenException, NotFoundException } from '@nestjs/common';

@Injectable()
export class CreateTopicUseCase {
  constructor(
    @Inject(TOPIC_REPOSITORY) private topicRepository: ITopicRepository,
    @Inject(COURSE_REPOSITORY) private courseRepository: ICourseRepository,
  ) {}

  async execute(data: Partial<Topic>): Promise<Topic> {
    if (!data.courseId) {
      throw new NotFoundException('Course ID is required');
    }

    const course = await this.courseRepository.findById(data.courseId);

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    if (course.status === CourseStatus.HISTORIC) {
      throw new ForbiddenException('Cannot add topics to historic courses');
    }

    return this.topicRepository.create(data);
  }
}
