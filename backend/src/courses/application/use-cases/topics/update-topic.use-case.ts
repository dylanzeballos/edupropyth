import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { ITopicRepository } from '../../../domain/interfaces/topic-repository.interface';
import { TOPIC_REPOSITORY } from '../../../domain/interfaces/topic-repository.interface';
import { Topic } from '../../../domain/entities/topic.entity';

@Injectable()
export class UpdateTopicUseCase {
  constructor(
    @Inject(TOPIC_REPOSITORY) private topicRepository: ITopicRepository,
  ) {}

  async execute(id: string, data: Partial<Topic>): Promise<Topic> {
    const topic = await this.topicRepository.findById(id);

    if (!topic) {
      throw new NotFoundException('Topic not found');
    }

    return this.topicRepository.update(id, data);
  }
}
