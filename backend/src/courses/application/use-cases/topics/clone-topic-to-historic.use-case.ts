import { Inject, Injectable } from '@nestjs/common';
import type { ITopicRepository } from '../../../domain/interfaces/topic-repository.interface';
import { TOPIC_REPOSITORY } from '../../../domain/interfaces/topic-repository.interface';
import type { IResourceRepository } from '../../../domain/interfaces/resource-repository.interface';
import { RESOURCE_REPOSITORY } from '../../../domain/interfaces/resource-repository.interface';
import type { IActivityRepository } from '../../../domain/interfaces/activity-repository.interface';
import { ACTIVITY_REPOSITORY } from '../../../domain/interfaces/activity-repository.interface';
import { Topic } from '../../../domain/entities/topic.entity';

@Injectable()
export class CloneTopicToHistoricUseCase {
  constructor(
    @Inject(TOPIC_REPOSITORY) private topicRepository: ITopicRepository,
    @Inject(RESOURCE_REPOSITORY)
    private resourceRepository: IResourceRepository,
    @Inject(ACTIVITY_REPOSITORY)
    private activityRepository: IActivityRepository,
  ) {}

  async execute(topicId: string, newCourseId: string): Promise<Topic> {
    const topic = await this.topicRepository.findById(topicId);
    const resources = await this.resourceRepository.findByTopicId(topicId);
    const activities = await this.activityRepository.findByTopicId(topicId);

    const clonedTopic = await this.topicRepository.create({
      ...topic,
      id: undefined,
      courseId: newCourseId,
    });

    for (const resource of resources) {
      await this.resourceRepository.create({
        ...resource,
        id: undefined,
        topicId: clonedTopic.id,
      });
    }

    for (const activity of activities) {
      await this.activityRepository.create({
        ...activity,
        id: undefined,
        topicId: clonedTopic.id,
      });
    }

    return clonedTopic;
  }
}
