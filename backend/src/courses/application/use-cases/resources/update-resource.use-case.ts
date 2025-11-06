import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { IResourceRepository } from '../../../domain/interfaces/resource-repository.interface';
import { RESOURCE_REPOSITORY } from '../../../domain/interfaces/resource-repository.interface';
import { Resource } from '../../../domain/entities/resource.entity';

@Injectable()
export class UpdateResourceUseCase {
  constructor(
    @Inject(RESOURCE_REPOSITORY)
    private resourceRepository: IResourceRepository,
  ) {}

  async execute(id: string, data: Partial<Resource>): Promise<Resource> {
    const resource = await this.resourceRepository.findById(id);

    if (!resource) {
      throw new NotFoundException('Resource not found');
    }

    return this.resourceRepository.update(id, data);
  }
}
