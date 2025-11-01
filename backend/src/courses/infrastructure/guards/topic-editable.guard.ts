import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Inject,
} from '@nestjs/common';
import { CourseStatus } from '../../domain/enums/course-status.enum';
import type { ITopicRepository } from '../../domain/interfaces/topic-repository.interface';
import { TOPIC_REPOSITORY } from '../../domain/interfaces/topic-repository.interface';
import type { ICourseRepository } from '../../domain/interfaces/course-repository.interface';
import { COURSE_REPOSITORY } from '../../domain/interfaces/course-repository.interface';
import type { IResourceRepository } from '../../domain/interfaces/resource-repository.interface';
import { RESOURCE_REPOSITORY } from '../../domain/interfaces/resource-repository.interface';

@Injectable()
export class TopicEditableGuard implements CanActivate {
  constructor(
    @Inject(TOPIC_REPOSITORY) private topicRepository: ITopicRepository,
    @Inject(COURSE_REPOSITORY) private courseRepository: ICourseRepository,
    @Inject(RESOURCE_REPOSITORY)
    private resourceRepository: IResourceRepository,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<{
      params: { topicId?: string; id?: string };
      url: string;
    }>();

    let topicId = request.params.topicId || request.params.id;

    // If this is a resource endpoint, we need to get the resource first to find the topicId
    if (request.url.includes('/resources/') && !request.params.topicId) {
      const resourceId = request.params.id;

      if (!resourceId) {
        throw new ForbiddenException('Resource ID is required');
      }

      const resource = await this.resourceRepository.findById(resourceId);

      if (!resource) {
        throw new ForbiddenException('Resource not found');
      }

      topicId = resource.topicId;
    }

    if (!topicId) {
      throw new ForbiddenException('Topic ID is required');
    }

    const topic = await this.topicRepository.findById(topicId);

    if (!topic) {
      throw new ForbiddenException('Topic not found');
    }

    const course = await this.courseRepository.findById(topic.courseId);

    if (!course) {
      throw new ForbiddenException('Associated course not found');
    }

    if (course.status === CourseStatus.HISTORIC) {
      throw new ForbiddenException('Cannot modify topics of a historic course');
    }
    return true;
  }
}
