import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { IActivityRepository } from '../../../domain/interfaces/activity-repository.interface';
import { ACTIVITY_REPOSITORY } from '../../../domain/interfaces/activity-repository.interface';
import type { ITopicRepository } from '../../../domain/interfaces/topic-repository.interface';
import { TOPIC_REPOSITORY } from '../../../domain/interfaces/topic-repository.interface';
import { Activity } from '../../../domain/entities/activity.entity';

@Injectable()
export class CreateActivityUseCase {
  constructor(
    @Inject(ACTIVITY_REPOSITORY)
    private activityRepository: IActivityRepository,
    @Inject(TOPIC_REPOSITORY) private topicRepository: ITopicRepository,
  ) {}

  async execute(data: Partial<Activity>): Promise<Activity> {
    if (!data.topicId) {
      throw new NotFoundException('Topic ID is required');
    }

    const topic = await this.topicRepository.findById(data.topicId);

    if (!topic) {
      throw new NotFoundException('Topic not found');
    }

    return this.activityRepository.create(data);
  }
}
