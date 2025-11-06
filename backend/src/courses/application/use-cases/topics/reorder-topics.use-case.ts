import { Inject, Injectable } from '@nestjs/common';
import type { ITopicRepository } from '../../../domain/interfaces/topic-repository.interface';
import { TOPIC_REPOSITORY } from '../../../domain/interfaces/topic-repository.interface';

@Injectable()
export class ReorderTopicsUseCase {
  constructor(
    @Inject(TOPIC_REPOSITORY) private topicRepository: ITopicRepository,
  ) {}

  async execute(
    courseId: string,
    orders: Array<{ id: string; order: number }>,
  ): Promise<void> {
    await this.topicRepository.reorder(courseId, orders);
  }
}
