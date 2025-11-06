import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { IResourceRepository } from '../../../domain/interfaces/resource-repository.interface';
import { RESOURCE_REPOSITORY } from '../../../domain/interfaces/resource-repository.interface';
import type { ITopicRepository } from '../../../domain/interfaces/topic-repository.interface';
import { TOPIC_REPOSITORY } from '../../../domain/interfaces/topic-repository.interface';
import { Resource } from '../../../domain/entities/resource.entity';

@Injectable()
export class CreateResourceUseCase {
  constructor(
    @Inject(RESOURCE_REPOSITORY)
    private resourceRepository: IResourceRepository,
    @Inject(TOPIC_REPOSITORY) private topicRepository: ITopicRepository,
  ) {}

  async execute(data: Partial<Resource>): Promise<Resource> {
    if (!data.topicId) {
      throw new NotFoundException('Topic ID is required');
    }

    const topic = await this.topicRepository.findById(data.topicId);

    if (!topic) {
      throw new NotFoundException('Topic not found');
    }

    return this.resourceRepository.create(data);
  }
}
