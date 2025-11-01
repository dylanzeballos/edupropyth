import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { ITopicRepository } from '../../../domain/interfaces/topic-repository.interface';
import { TOPIC_REPOSITORY } from '../../../domain/interfaces/topic-repository.interface';

@Injectable()
export class DeleteTopicUseCase {
  constructor(
    @Inject(TOPIC_REPOSITORY) private topicRepository: ITopicRepository,
  ) {}

  async execute(id: string): Promise<void> {
    const topic = await this.topicRepository.findById(id);

    if (!topic) {
      throw new NotFoundException('Topic not found');
    }

    await this.topicRepository.delete(id);
  }
}
